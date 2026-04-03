# Implementation notes — ms4

## ref:// is for non-hierarchical cross-references only

The trace tree hierarchy already gives parent-child navigation for free: `job-123/calc-456` is
naturally a child of `job-123` by prefix. The UI should derive this structure without needing
explicit `ref://` links.

`ref://` is reserved for edges that the hierarchy does not capture — non-hierarchical
cross-references. Examples from the brainstorm:

- `"retry_of": "ref://job-121/calc-456"` — links to a previous run of the same calculation
- `"blocked_by": "ref://job-123/calc-soc"` — expresses a DAG dependency that caused a failure
- `"same_aoi_as": "ref://job-98"` — links two jobs that share context but have no parent-child relationship

In all cases the destination exists in the tree but is not reachable by walking up or down from
the current node.

## Start by loading the traces and showing them as a simple list

The first version of woodstock-ui should show all traces as a simple list of events, not as a tree.
When the user clicks on a trace, we show the trace details in the right side panel.

## When this works, then implement showing the trace-tree

Use the roadplan ui as a reference for showing nodes that can be opened and closed.
The order of the nodes follows the order of the events. E.g. if the trace with key jobs/hello is
older than the trace with key jobs/goodbye, then the jobs/hello node appears before the jobs/goodbye
node within the jobs parent node.

## If the payload refers to an S3 url then the server should (on demand) try to fetch that file

When the user clicks on the S3 link then the UI will ask the server to read this file from S3.
E.g. in calcium this will allow us to inspect the inputs.json file of a calculation.
