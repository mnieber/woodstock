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
