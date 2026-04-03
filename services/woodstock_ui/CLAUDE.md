Before writing any code, you MUST:

1. Read ./instructions/index.md
2. Read ./instructions/using_specs/instructions-for-mapping-specs-to-implementation.md
3. Follow the spec-driven development process described there, consulting the relevant markdown files (that are also in the instructions directory) for details.

# Extra instructions regarding the example code

We'll be using both instructions/examples/blogs_fe and instructions/examples/roadplan_ui as reference implementations for woodstock_ui.
These two examples are perfectly aligned, so you can use either of them as the source for any implementation pattern in woodstock_ui.

Recommendations

1. Use blogs_fe as the primary reference for:

- Core patterns (routing, state, API)
- Basic component structures
- Form patterns
- Storybook examples

2. Use roadplan_ui as a reference for:

- Advanced UI patterns (resizable panels, portals)
- Complex state management (tree view with Skandha)
- Real-world feature complexity
- Additional utilities (Ramda, date-fns)

3. Prefer blogs_fe patterns when both offer a solution - it's simpler and serves as the canonical example
