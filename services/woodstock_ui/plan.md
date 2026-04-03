# Implementation Plan — woodstock_ui

## Dependency on scenarios and implementation_notes.md

This plan depends on the woodstock library scenarios stored in `/home/maarten/projects/woodstock/src/libs/woodstock/docs/spec/scenarios/`, particularly:

- ms6_the_woodstock_ui_queries_and_displays_traces.md
- ms4_a_client_labels_trace_nodes.md
- ms2_a_client_writes_a_simple_trace.md

The implementation notes in `/home/maarten/projects/woodstock/src/libs/woodstock/extra/spec_src/scenarios/ms6_the_woodstock_ui_queries_and_displays_traces/implementation-notes.md` should also be consulted.

## Overview

The woodstock_ui is a React application that provides a browser-based UI for viewing and exploring trace data collected by the woodstock tracing framework. It queries the woodstock-server HTTP API to retrieve trace lists and blob content, and renders them in a hierarchical tree view with detailed trace inspection capabilities.

## High-level Directory Structure

The application is organized into feature modules following the established pattern from blogs_fe:

```
src/
├── api/                    # API client layer (types, queries, mutations, schemas)
├── app/                    # Application root (AppState, AppStateProvider, App.tsx)
├── auth/                   # Authentication (existing)
├── traces/                 # Main feature module for trace browsing
│   ├── api/               # Trace-specific API types and hooks
│   ├── TracesState/       # MobX state for traces list/filtering
│   ├── TraceState/        # MobX state for single trace detail
│   ├── components/        # Trace views and components
│   ├── hooks/             # Trace-specific hooks
│   ├── routes.ts          # Navigation for trace routes
│   └── utils/             # Trace parsing and rendering utilities
├── treeview/              # Generic tree view component (existing, may be reused)
├── forms/                 # Form components (existing)
├── frames/                # Layout frames (existing)
├── routes/                # Global routing (existing)
├── mocks/                 # MSW handlers for Storybook
└── utils/                 # Shared utilities (existing)
```

## API Layer

### Types (in `api/types/`)

Based on the woodstock server API, we need these TypeScript types:

**TraceRecordT.ts**

- Represents a single trace record from the server
- Fields: `trace_key`, `trace_state`, `author`, `timestamp`, `payload`, `labels`
- Corresponds to Python `TraceRecord` model

**TraceListT.ts**

- Contains an array of TraceRecord items
- Field: `items: TraceRecordT[]`
- Corresponds to Python `TraceList` model

**BlobContentT.ts**

- Represents fetched blob content
- Fields: `path`, `content` (string or bytes)
- Used for rendering tree:// references

**TraceFilterT.ts**

- Optional filter parameters for querying traces
- Fields: `trace_key_prefix?`, `trace_state?`, `author?`, `time_range_start?`, `time_range_end?`

**TraceStateEnumT.ts**

- Enum for trace states: `ok`, `warn`, `error`, `info`

**PayloadFieldT.ts**

- Represents a parsed payload field with DSL prefix
- Fields: `key`, `value`, `type` (one of: `value`, `link`, `ref`, `tree`)

### Schemas (in `api/types/`)

**TraceRecordSchema.ts**

- Zod schema for validating TraceRecord responses from the server

**TraceListSchema.ts**

- Zod schema for validating TraceList responses

### Queries (in `api/queries/`)

**useQueryTraces.ts**

- Query hook that calls `/query-traces` endpoint
- Accepts `TraceFilterT` parameters
- Returns `TraceListT`
- Uses `useObservableQuery` pattern from blogs_fe

**useFetchBlob.ts**

- Query hook that calls `/fetch-blob` endpoint
- Accepts `tree_path` parameter
- Returns `BlobContentT`
- Conditionally enabled when a tree:// reference is clicked

### Mutations

No mutations are needed in Phase 1 (read-only UI).

## State Layer

### TracesState (in `traces/TracesState/`)

The main state container for the traces list view.

**Files:**

- `TracesState.ts` — Main state class
- `TracesData.ts` — Data facet for trace list
- `TracesFilter.ts` — Facet for filter parameters
- `TracesSelection.ts` — Facet for selected trace
- `registerTracesCtr.ts` — Wiring and side effects

**Facets:**

- `data` — Contains the list of traces from the query
- `filter` — User-selected filter parameters (prefix, state, author, time range)
- `selection` — Currently selected trace key
- `resourceState` — Tracks query loading/error state

**Props:**

- `queryTraces` — The query hook result from `useQueryTraces`

**Containers:**

- `dataCtr` — Manages trace list data
- `filterCtr` — Manages filter state
- `selectionCtr` — Manages selected trace

### TraceState (in `traces/TraceState/`)

The state container for a single trace detail view.

**Files:**

- `TraceState.ts` — Main state class
- `TraceData.ts` — Data facet for the trace
- `BlobsData.ts` — Facet for fetched blobs (tree:// references)
- `registerTraceCtr.ts` — Wiring and side effects

**Facets:**

- `data` — Contains the current trace record
- `blobs` — Contains fetched blob content keyed by tree path
- `resourceState` — Tracks loading/error state

**Props:**

- `trace` — The selected TraceRecord from TracesState
- `fetchBlob` — The query hook for fetching blobs

**Containers:**

- `dataCtr` — Manages trace detail data
- `blobsCtr` — Manages blob fetching and caching

### TraceTreeState (in `traces/TraceTreeState/`)

State for managing the hierarchical tree view of traces. Uses Skandha for tree node management.

**Files:**

- `TraceTreeState.ts` — Main state class
- `NodesData.ts` — Facet for tree nodes (using Skandha)
- `Expansion.ts` — Facet for expanded/collapsed state
- `registerTraceTreeCtr.ts` — Wiring

**Facets:**

- `nodes` — Tree node hierarchy derived from trace keys (managed via Skandha)
- `expansion` — Tracks which nodes are expanded/collapsed

**Props:**

- `traces` — The flat list of traces from TracesState

## Routes (in `traces/routes.ts`)

**Route Definitions:**

- `/traces` — List view of all traces (with optional filter parameters in URL)
- `/traces/:traceKey` — Detail view of a specific trace

**Navigation Classes:**

- `TracesNav` — Navigation interface
- `DefaultTracesNavHandler` — Default implementation using history.push
- `tracesNav` — Singleton instance

**Route Params:**

- `traceKey` — The selected trace key (can contain slashes, needs URL encoding)

## State Providers (in `traces/components/`)

**TracesStateProvider.tsx**

- Provides TracesState to consuming components
- Creates state instance with `useTracesState` hook
- Uses React Context to pass state down the tree

**TraceStateProvider.tsx**

- Provides TraceState to consuming components
- Creates state instance with `useTraceState` hook
- Nested inside TracesStateProvider

**TraceTreeStateProvider.tsx**

- Provides TraceTreeState for the tree view
- Derives tree hierarchy from traces list
- Nested inside TracesStateProvider

## Views and Components (in `traces/components/`)

### Main Views

**TracesListView.tsx**

- Top-level view for the traces list route
- Renders filter controls and trace list
- Includes refresh button in top ribbon
- Uses `TracesStateProvider`
- Layout: filter panel on left, trace list in center, detail panel on right

**TraceDetailView.tsx**

- View for displaying a single trace's details
- Renders payload fields according to DSL prefix
- Fetches and renders tree:// references
- Uses `TraceStateProvider`

**TraceTreeView.tsx**

- Hierarchical tree view of traces
- Shows parent/child relationships based on trace_key prefixes
- Supports expand/collapse
- May reuse existing `treeview/` components or create trace-specific version

### Component Sections

**TraceFilterForm.tsx**

- Form for setting trace filter parameters
- Fields: trace key prefix input, state dropdown, author input, date range pickers
- Updates TracesState.filter facet

**TraceListItems.tsx**

- Renders list of trace records
- Shows summary info: trace_key, state, author, timestamp
- Click to select and show detail

**PayloadFieldsView.tsx**

- Renders the payload fields of a trace
- Delegates to specialized renderers based on DSL prefix

**PayloadValueField.tsx**

- Renders `value://` fields as key-value pairs

**PayloadLinkField.tsx**

- Renders `link://` fields as clickable external links

**PayloadRefField.tsx**

- Renders `ref://` fields as navigable cross-references
- Clicking navigates to the referenced trace

**PayloadTreeField.tsx**

- Renders `tree://` fields by fetching blob content
- Shows loading state while fetching
- Renders content based on type (markdown, JSON, plain text)

**BlobContentView.tsx**

- Renders fetched blob content
- Supports markdown rendering
- Supports JSON formatting
- Falls back to plain text

**TraceStateBadge.tsx**

- Visual indicator for trace state (ok, warn, error, info)
- Color-coded badge component

**LabelsView.tsx**

- Displays labels associated with trace nodes
- Shows label key-value pairs
- May highlight active/special labels

**RefreshButton.tsx**

- Button in top ribbon to refresh trace data
- Triggers re-query of traces from server
- Shows loading state during refresh

### Effects

**SelectTraceEffect.tsx**

- URL-driven effect for selecting a trace
- Reads `:traceKey` from URL params
- Calls `TracesState.selection.select(traceKey)`

## Hooks (in `traces/hooks/`)

**useTracesState.ts**

- Hook that creates and returns TracesState instance
- Accepts queryTraces result as prop
- Manages resource state

**useTraceState.ts**

- Hook that creates and returns TraceState instance
- Accepts trace record and fetchBlob hook

**useTracesContext.ts**

- Hook to consume TracesState from context

**useTraceContext.ts**

- Hook to consume TraceState from context

## Utilities (in `traces/utils/`)

**parsePayloadField.ts**

- Parses a payload field value to extract DSL prefix
- Returns `PayloadFieldT` with type and value

**buildTraceTree.ts**

- Builds hierarchical tree structure from flat trace list
- Groups traces by common key prefixes
- Returns tree node structure

**formatTimestamp.ts**

- Formats ISO timestamp for display
- Supports relative time ("2 hours ago") and absolute time

**extractTreePath.ts**

- Extracts the path from a `tree://` reference
- Used when fetching blobs

## UI Style

Use a simple, clear but elegant UI style. Prioritize giving woodstock_ui a nice UI style over reusing existing styles from blogs_fe and roadplan_ui, since these two React examples are not particularly nice looking. When you've decided on a nice UI style, see how these styles can be added using the mechanisms shown in the example code, without any need to use the same styles as are used in those apps.

## User Workflows

### Workflow 1: Browse and filter traces

1. User navigates to `/traces`
2. `TracesListView` renders with `TracesStateProvider`
3. `TracesState` initializes with empty filter
4. `useQueryTraces` fetches all traces from server (no pagination, loads all)
5. User can click refresh button in top ribbon to re-fetch traces
6. User enters filter criteria in `TraceFilterForm` (prefix, state, author, time range - not labels)
7. Filter facet updates, triggering re-query
8. Trace list updates to show filtered results

### Workflow 2: View trace hierarchy

1. `TraceTreeView` receives flat trace list from `TracesState`
2. `buildTraceTree` utility constructs hierarchical structure
3. Tree nodes render with expand/collapse controls
4. User expands a parent node
5. Child traces become visible
6. Order follows event timestamp (older events first within each parent)

### Workflow 3: Select and inspect a trace

1. User clicks on a trace in the list or tree
2. `TracesState.selection` facet updates
3. Navigation to `/traces/:traceKey` occurs
4. `SelectTraceEffect` reads URL param and selects trace
5. `TraceDetailView` renders with `TraceStateProvider`
6. `PayloadFieldsView` renders payload fields
7. For each `tree://` reference, `PayloadTreeField` triggers blob fetch
8. `useFetchBlob` queries server
9. `BlobContentView` renders fetched content
10. Markdown/JSON content is formatted appropriately

### Workflow 4: Navigate via ref:// links

1. User viewing trace detail sees a `ref://` field
2. `PayloadRefField` renders it as a clickable link
3. User clicks the reference
4. Navigation to `/traces/:referencedTraceKey` occurs
5. New trace detail view loads
6. User can navigate back via browser history

### Workflow 5: Filter by trace state

1. User opens state dropdown in filter form
2. Selects "error" state
3. Filter facet updates with `trace_state: "error"`
4. Query re-runs with filter
5. Only error traces are shown
6. User can clear filter to see all traces again

## Implementation Phases

### Phase 1: Basic trace list (per implementation-notes.md)

**Goal:** Show all traces as a simple flat list, not as a tree. Select a trace to view details.

- [ ] API types: `TraceRecordT`, `TraceListT`, `TraceFilterT`, schemas
- [ ] Query hook: `useQueryTraces`
- [ ] State: `TracesState` with data, selection facets (no filter yet)
- [ ] Routes: `/traces`, `/traces/:traceKey`
- [ ] Views: `TracesListView`, `TraceDetailView`, `TraceListItems`
- [ ] Effect: `SelectTraceEffect`
- [ ] Basic payload rendering: `PayloadFieldsView`, `PayloadValueField`
- [ ] Integration: Add routes to `App.tsx`, update main switch

### Phase 2: Payload rendering with DSL support

**Goal:** Render all DSL field types correctly.

- [ ] Components: `PayloadLinkField`, `PayloadRefField`
- [ ] Utility: `parsePayloadField`
- [ ] State badge: `TraceStateBadge`
- [ ] Labels view: `LabelsView`

### Phase 3: Tree:// blob fetching

**Goal:** Fetch and render blob content for tree:// references.

- [ ] API types: `BlobContentT`, schema
- [ ] Query hook: `useFetchBlob`
- [ ] State: Extend `TraceState` with blobs facet
- [ ] Components: `PayloadTreeField`, `BlobContentView`
- [ ] Utility: `extractTreePath`

### Phase 4: Tree view

**Goal:** Show traces in hierarchical tree structure.

- [ ] State: `TraceTreeState` with nodes, expansion facets
- [ ] Utility: `buildTraceTree`
- [ ] Component: `TraceTreeView` (may adapt existing treeview or create new)
- [ ] Provider: `TraceTreeStateProvider`
- [ ] Update `TracesListView` to show tree toggle

### Phase 5: Filtering

**Goal:** Let users filter traces by prefix, state, author, time range. Note: Label-based filtering is not included in this phase.

- [ ] State: Add filter facet to `TracesState`
- [ ] Component: `TraceFilterForm` with fields for prefix, state, author, time range
- [ ] Utility: `formatTimestamp` for date range pickers
- [ ] Update URL to include filter params
- [ ] Persist filter state in URL
- [ ] Component: `RefreshButton` in top ribbon to manually refresh traces

## Key Design Decisions

### Use existing treeview component vs. create new one

**Decision:** Use the `treeview/` component from roadplan_ui as inspiration for a brand new tree view in woodstock_ui. The tree in woodstock_ui uses Skandha for tree node management.

**Rationale:** Skandha provides efficient tree state management and is the established pattern from roadplan_ui.

### Trace key URL encoding

**Decision:** Trace keys contain slashes (e.g., `job-123/calc-456`), which must be URL-encoded when used as route params.

**Rationale:** Use `encodeURIComponent` for `:traceKey` param, decode in effect.

### Blob fetching strategy

**Decision:** Fetch all tree:// blobs immediately when trace detail loads (as per ms6 spec).

**Rationale:** Spec says "all tree:// payload references are fetched immediately so the user sees the full trace."

### Label rendering

**Decision:** Display labels in a separate section below payload fields.

**Rationale:** Labels are metadata for filtering/UI hints, not part of the event payload itself.

### State vs. stateless tree view

**Decision:** Use MobX state (`TraceTreeState`) for tree expansion state.

**Rationale:** Consistent with application patterns; allows expansion state to persist during navigation.

### ref:// navigation

**Decision:** `ref://` links navigate within the woodstock UI (to `/traces/:traceKey`), not external links.

**Rationale:** Per spec, ref:// is for "navigable cross-references within the woodstock UI."

### Server URL configuration

**Decision:** Store woodstock-server base URL in app settings/environment config.

**Rationale:** Needs to work in local dev (localhost) and deployed environments (different hosts).

### Auth

No authentication will be considered for now. We assume that the woodstock server will accept requests.

### Search and filtering

Searching for traces or filtering on labels is not yet supported.

### Real-time updates

Real-time updates are supported using a refresh button that is placed in a ribbon on top of the application window.

### Pagination

For now, there is no pagination. Woodstock_ui will load all available traces from the woodstock server.

### Export

There is no export to JSON/CSV function for now.

## Notes

- No spec files are created for woodstock_ui itself (as per user assumption)
- This plan serves as the design document for implementation
- Refer to blogs_fe example as primary reference for all patterns
- Refer to roadplan_ui example for advanced tree view patterns if needed
- Follow the spec-driven development process from instructions/
