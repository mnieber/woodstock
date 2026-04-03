# Woodstock UI Mockups

Visual mockups for the Woodstock tracing framework UI. This is a standalone React app for iterating on the visual design before implementing the full application.

## Purpose

- Experiment with layouts, colors, and component styles
- Create visual references for the actual implementation
- Iterate quickly without worrying about state management or API integration

## Running Locally

```bash
# Install dependencies
yarn install

# Start dev server (runs on http://localhost:3001)
yarn dev
```

## Structure

- `src/mockups/` - Full page mockups
  - `TracesSplitViewMockup.tsx` - **Combined view** with resizable split panel (list + detail)
  - `TracesListMockup.tsx` - Main list view with filters and tree (standalone)
  - `TraceDetailMockup.tsx` - Detail view with payload and blobs (standalone)
  - `ComponentShowcase.tsx` - Individual components for testing

- `src/components/` - Reusable visual components
  - `TraceStateBadge.tsx` - State indicator badges (ok, warn, error, info)
  - `RefreshButton.tsx` - Refresh button with loading state
  - `PayloadField.tsx` - Renders payload fields with DSL prefixes

## Design Notes

- **Color scheme**: Uses Tailwind with custom primary colors (blues) and trace state colors (green/yellow/red)
- **Layout**: Filter panel (left) + Trace list (center) + Resizable splitter + Detail panel (right)
- **Split view**: Resizable horizontal splitter, limits between 20%-80%, 50% default
- **Typography**: Sans-serif for UI, monospace for trace keys and code
- **Spacing**: Clean, generous spacing for readability
- **Responsive**: Split view works best on desktop; consider stacking or tabs for mobile

## Copying to Real App

Once you're happy with a component's visual design, you can copy the JSX and Tailwind classes directly to the corresponding component in `woodstock_ui/src/`.
