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
  - `TracesListMockup.tsx` - Main list view with filters and tree
  - `TraceDetailMockup.tsx` - Detail view with payload and blobs
  - `ComponentShowcase.tsx` - Individual components for testing

- `src/components/` - Reusable visual components
  - `TraceStateBadge.tsx` - State indicator badges (ok, warn, error, info)
  - `RefreshButton.tsx` - Refresh button with loading state
  - `PayloadField.tsx` - Renders payload fields with DSL prefixes

## Design Notes

- **Color scheme**: Uses Tailwind with custom primary colors (blues) and trace state colors (green/yellow/red/blue)
- **Layout**: Filter panel (left) + Trace list (center) + Detail panel (right/separate route)
- **Typography**: Sans-serif for UI, monospace for trace keys and code
- **Spacing**: Clean, generous spacing for readability

## Copying to Real App

Once you're happy with a component's visual design, you can copy the JSX and Tailwind classes directly to the corresponding component in `woodstock_ui/src/`.
