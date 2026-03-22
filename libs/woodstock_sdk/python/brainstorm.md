I'm thinking about picking up my structured tracing tool (woodstock) again. By structured tracing I mean that traces have a key that identifies a node in the trace-tree. Each trace also has a payload, which could be anything (e.g. a Markdown file rendered by a django-service, or a JSON file stored by calcium-queue). All processes that are handling a certain job-id can store their traces in the node for that job, which makes it easy to inspect the history of that job. A process can also target a calculation-trace-node within the related job-trace-node.

A light-weight approach could be to make woodstock an S3-based protocol. There is no central server, but clients can use a woodstock_sdk for their environment (e.g. Python or Go) to write traces into the trace-tree. Viewing the traces probably needs a server that can run queries against this S3 bucket, and a react client (showing the trace-tree in the browser) that runs against this server, but the user could run that server also locally, minimizing the need for infrastructure.

Can you comment on this approach? Is this reinventing an existing solution or would it make sense to invest time in this?

---

This is a thoughtful design, and I can see why it appeals to you — it fits well with your existing stack (calcium, S3, Django, React). Let me give you an honest assessment.

What's genuinely novel here
The combination you're describing — structured, key-addressable trace trees scoped to a job-id, with S3 as the durable store and no mandatory central server — is not something that exists cleanly off the shelf. Most tracing tools are built around streams (spans flowing into a collector), not trees with stable addresses where multiple processes can converge on the same node by key. That convergence property (calcium-queue writes to job-123/queue, your Django service writes to job-123/render) is genuinely useful and not standard.

---

I like the idea that the woodstock-server can maintain a database on S3 that makes it fast to do searching and filtering. Maybe woodstock_sdk would write into the trace-tree but also add the trace-key (that identifies a node in the trace-tree) to a append-only trace-log on S3. This could allow woodstock-server to quickly find out what changed and update its database. Is there a solution here that allows woodstock-server to understand which entries in the trace-log it hasn't seen before? Or maybe woodstock_sdk should write into the S3 database directly so that it's always up-to-date and woodstock-server doesn't have to rebuild it?

To explain the use-case better: the goal is to get deep insights into the state of the system. For example, calcium could add a trace for "calculation failed" (btw it might help when every trace has a trace-key and a trace-state) and in the payload it could add the url that opens this calculation in calcite. Or calcite could add a trace for a job that says "cyclic DAG detected" and in the payload it could add a markdown text that explains where the cycle was detected.

---

The use-case description really clarifies things — this is less "distributed tracing" and more a structured, addressable audit/state log where any service can contribute observations about a job, and you can later reconstruct a full picture. The trace-state idea is good; it turns each node from a passive blob into something queryable ("show me all nodes in state failed").

The what's-new log approach
This is essentially event sourcing on S3, and there's a known pattern: the append-only log is your source of truth, the database is a derived projection.

The "which entries haven't I seen" problem has a clean solution: sequence numbers embedded in the S3 key.

traces/0000000001.json
traces/0000000002.json
...
The woodstock-server persists only one thing: the last sequence number it processed. On startup or poll, it lists traces with a StartAfter of its last-seen key and processes everything after it. No coordination needed, no races — S3 listing is ordered lexicographically, so the sequence falls out naturally.

The SDK needs to generate monotonically increasing sequence numbers without a central counter though. Options:

Timestamp + random suffix (20260322T143201Z-a3f9.json) — not perfectly ordered but good enough if you only need "roughly what's new since X"
UUID v7 — time-ordered UUIDs, designed exactly for this
Central counter in a lightweight store (e.g. a DynamoDB atomic increment, or even a Redis instance) — precise ordering but adds a dependency you probably don't want
UUID v7 is probably the right call here. Lexicographic order is preserved, no coordination needed, and woodstock-server can use StartAfter on the last processed key reliably.

SDK writes directly to the DB
The appeal is obvious — always consistent, no polling lag. But it means every SDK client needs write access to whatever database technology you choose, and that database needs to handle concurrent writers safely. SQLite on S3 is a non-starter for concurrent writes. DuckDB has the same problem. You'd essentially need a server in front of the DB anyway, which defeats the "no mandatory central server" goal.

The append-only log keeps writers dumb and fast (just a PUT to S3), and concentrates complexity in the server where it belongs.

A concrete shape
traces/
tree/
{job-id}/
meta.json # job-level trace node
{calc-id}/
meta.json # calc-level trace node
render.md # arbitrary payload blob
traces/
{uuidv7}.json # {trace_key, trace_state, timestamp, writer}
db/
index.duckdb # maintained by woodstock-server (or Parquet files)
Each whats-new entry is minimal — just enough for the server to know what changed and go fetch from the tree if needed. The server can then maintain its DuckDB index incrementally: on each poll, process new entries, upsert into the index.

On trace-state
This is the right instinct. I'd suggest treating state as a small controlled vocabulary per domain rather than free-form, e.g.:

json
{
"trace_key": "job-123/calc-456",
"trace_state": "failed",
"writer": "calcium",
"timestamp": "...",
"payload_ref": "tree/job-123/calc-456/error.md"
}
States like pending, running, failed, succeeded, warning give you filtering for free. The payload_ref keeps the what's-new entry lightweight while pointing to the rich blob. The viewer server can then answer "show me all failed nodes in the last hour" purely from its DuckDB index, without touching the tree at all.

This feels like a coherent, buildable system — and importantly, one where the SDK is genuinely trivial to implement in any language (just two PUTs per trace write: one to the tree, one to the trace-log).

---

Can you explain how this small bit of json that you just posted would be used? I like this format but I was under the impression that clients would use woodstock_sdk to write a trace-record into the trace-tree and append to the trace-log. I think your idea might be better but I'm not yet getting it.

---

You're right to flag the confusion — I conflated two things. Let me untangle it.

What I was actually suggesting
The trace-log entry is the trace record. The tree is only for payload blobs that are too large or rich to inline (like a Markdown file or a big JSON dump). So the flow would be:

For a simple trace (no large payload):

SDK writes one file to traces/{uuidv7}.json containing the full trace record
For a trace with a large payload:

SDK writes the payload blob to tree/job-123/calc-456/error.md
SDK writes to traces/{uuidv7}.json with a payload_ref pointing at the blob
The tree stops being the primary store — it's just a blob annex. The trace-log is the trace store.

Why this might be better
In your original design, the server had to scan the tree to find traces. With this approach, everything the server needs to build its index is already in traces/ — it never needs to crawl the tree. The tree is only consulted when the viewer wants to display a specific payload.

What the viewer flow looks like
User opens woodstock UI
→ hits woodstock-server
→ server queries DuckDB index (built from traces/)
→ returns list of trace nodes with states, writers, timestamps

User clicks on "cyclic DAG detected" trace
→ server fetches payload_ref from tree/ (the Markdown blob)
→ renders it in the UI
The remaining question
Does the tree (as a key-addressable namespace) still serve a purpose? I think yes — the trace_key like job-123/calc-456 is still meaningful as an address that multiple writers can target. Calcium writes job-123/calc-456 with state failed, calcite writes job-123/calc-456 with state cyclic_dag_detected. The tree key groups them conceptually even if they're stored as flat entries in traces/. The server's DuckDB index can then answer "show me all traces for job-123" by filtering on trace_key prefix.

---

I like your proposal. The small json file _is_ the trace. Maybe the payload in the trace can be a small DSL encoded in a dict. E.g. the payload could be

{
"severity": "value://high",
"calculation_page": "link://http://calcite/jobs/123/calculations/abc",
"error.md": "tree://job-123/calc-456/error.md",
}
This would allow woodstock to show a payload in the UI with different sections (e.g. a key-value section, a links section and a documents section.

Wdyt?

---

I really like this. It's a clean, self-describing format — the DSL is in the values, not the keys, so the keys remain human-readable labels. A few thoughts:

What works well
The prefix scheme naturally segments the payload into renderable sections without needing a separate schema. The UI logic is straightforward: iterate the payload, group by value prefix, render each group differently. New section types are additive — you just introduce a new prefix.

Possible prefix vocabulary
Prefix Meaning UI treatment
value:// Plain scalar Key-value table
link:// External link Links section (clickable)
tree:// Blob in S3 tree Documents section (fetched on demand)
state:// Trace state hint Badge/status indicator
ref:// Another trace-key Cross-reference (navigable link in the UI)
The ref:// one could be particularly powerful for your use case — calcium could write "triggered_by": "ref://job-123" and the UI could make that navigable, linking trace nodes together without embedding the data.

The trace record as a whole
Putting it together, a full trace record in traces/ would look something like:

json
{
"trace_key": "job-123/calc-456",
"trace_state": "failed",
"writer": "calcium",
"timestamp": "2026-03-22T14:32:01Z",
"payload": {
"severity": "value://high",
"calculation_page": "link://https://calcite/jobs/123/calculations/abc",
"error_summary": "value://Division by zero in band normalization",
"full_error": "tree://job-123/calc-456/error.md"
}
}
This is genuinely pleasant to read and write in an SDK. The SDK author in Python just builds a dict and calls woodstock.trace(key, state, payload) — no special types needed.

---

The ref:// is for jumping around in the trace-tree in woodstock, right? I like this idea as well./

Yes exactly — ref:// is internal to woodstock, link:// is external. They'd look similar in the payload but behave differently in the UI:

link://https://calcite/jobs/123/calculations/abc → opens in a new tab
ref://job-123 → navigates within the woodstock UI to that trace-key
The ref:// becomes especially useful when you have fan-out patterns. For example, a job spawns multiple calculations — calcium could write a trace on job-123 with payload entries like:

json
{
"calc_ndvi": "ref://job-123/calc-ndvi",
"calc_soc": "ref://job-123/calc-soc",
"calc_agc": "ref://job-123/calc-agc"
}
That gives you a navigable overview of the job's children right from the job-level trace node, without the UI having to infer the tree structure from prefix matching alone. It's an explicit, authored map of what matters — which is often more useful than a mechanical tree listing.

It also means different services can cross-reference each other. Calcite could write a trace on job-123/calc-456 with "triggered_by": "ref://job-123" and now the graph has edges in both directions, navigable from either end.

---

I think ref is useful for cross-referencing, but within woodstock, the job trace-node would already have the calculation trace-nodes as its children. But ref could be used to jump to a new place that is not readily available in the UI.

---

Right, good clarification. The tree structure already gives you parent-child navigation for free — you don't need ref:// to express "job-123 has these calculations as children," that falls out of the trace_key prefix hierarchy naturally.

So ref:// is really for non-hierarchical cross-references — edges that the tree structure doesn't capture. Good examples from your stack:

A calcium trace on job-123/calc-456 pointing "retry_of": "ref://job-121/calc-456" — jumping to a previous run of the same calculation
A calcite trace pointing "blocked_by": "ref://job-123/calc-soc" — expressing a DAG dependency that caused a failure
A trace on one job pointing "same_aoi_as": "ref://job-98" — linking jobs that share context but have no parent-child relationship
In all these cases the destination exists in the tree but isn't reachable by just walking up or down from the current node. That's the gap ref:// fills — a named, traversable shortcut across the tree rather than along it.
