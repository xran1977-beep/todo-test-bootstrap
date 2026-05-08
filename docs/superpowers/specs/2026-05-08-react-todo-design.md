# React Todo List — Design

**Date:** 2026-05-08
**Status:** Approved
**Stack:** React 18 + TypeScript + Vite + Vitest + @testing-library/react

## Purpose

Bootstrap-acceptance demo for the `obra/superpowers` Claude Code plugin. Exercises the full skill chain: `brainstorming → writing-plans → test-driven-development → verification-before-completion`. Output is a minimal but real React app with two test layers (unit + integration).

## Scope

In scope (MVP):

- Add a todo (text input + Add button)
- Toggle a todo's `done` flag (checkbox)
- Delete a todo (× button)
- Disable the Add button when input is empty/whitespace

Out of scope:

- Persistence (no localStorage / no backend)
- Inline edit
- Filter tabs (all / active / done)
- Drag-reorder
- Authentication, multi-list, sharing
- Animations beyond default browser focus styles

## Architecture

Two components, one type module, plain CSS:

| File | Role |
| --- | --- |
| `src/types.ts` | `type Todo = { id: string; text: string; done: boolean }` |
| `src/TodoItem.tsx` | Pure presentational component. Props: `{ todo, onToggle(id), onDelete(id) }`. Renders checkbox + label + delete button. Adds class `done` when `todo.done === true`. |
| `src/App.tsx` | Owns `Todo[]` state and the controlled input value. Renders input + Add button + list of `<TodoItem>`. Passes callbacks that mutate state via `setTodos`. |
| `src/App.css` | Minimal styling. `.done { text-decoration: line-through }`. |
| `src/main.tsx` | Vite entry — mounts `<App />` into `#root`. |

## Data flow

```
input box (controlled) ─► App.useState<string>(text)
Add button click ─► setTodos(prev => [...prev, { id: crypto.randomUUID(), text, done: false }]); setText("")
<TodoItem onToggle> ─► setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
<TodoItem onDelete> ─► setTodos(prev => prev.filter(t => t.id !== id))
```

IDs come from `crypto.randomUUID()` (available in modern browsers + jsdom 21+).

## Error handling

- **Empty / whitespace-only input:** Add button is `disabled`. No silent no-op submit.
- **No other failure modes:** no async, no network, no storage.

## Testing strategy

Two test files, exercised via `vitest run`.

### `src/TodoItem.test.tsx` — unit

1. Renders the todo's text.
2. Checkbox is checked iff `todo.done === true`.
3. Clicking the checkbox calls `onToggle(todo.id)` exactly once.
4. Clicking the delete button calls `onDelete(todo.id)` exactly once.
5. When `done` is true, the rendered `<li>` has class `done`.

### `src/App.test.tsx` — integration

1. **Add flow:** type into input + click Add → an `<li>` with that text appears, input clears.
2. **Empty-input guard:** Add button is disabled when input is empty or whitespace-only.
3. **Toggle flow:** add a todo, click its checkbox → it gains `class="done"`.
4. **Delete flow:** add a todo, click its × → the `<li>` is gone.
5. **Round-trip:** add A, add B, toggle A, delete B → list contains only A with `class="done"`.

## TDD order

Each step is one red → green commit (pre-commit hook permitting):

1. `TodoItem` renders text + checked state — **commit:** `feat: TodoItem renders text and checked state`
2. `TodoItem` calls `onToggle(id)` on checkbox click — **commit:** `feat: TodoItem.onToggle`
3. `TodoItem` calls `onDelete(id)` on delete-button click — **commit:** `feat: TodoItem.onDelete`
4. `TodoItem` adds `done` class when `todo.done` — **commit:** `feat: TodoItem.done class`
5. `App` add flow — **commit:** `feat: App.add`
6. `App` empty-input guard — **commit:** `feat: App.add disabled when empty`
7. `App` toggle + delete + round-trip — **commit:** `feat: App toggle/delete/round-trip`

## Acceptance

- `npm test` passes all 10 tests.
- `npm run dev` opens a usable page where I can add, toggle, and delete in the browser.
- Repo has the per-step commits above (or a clear equivalent if some merge).

## Non-goals (explicit)

These are valuable but deliberately deferred so the demo stays bounded:

- localStorage persistence
- TodoMVC parity (filter, count, clear-completed, double-click-edit)
- A11y polish beyond what `@testing-library` queries already exercise
