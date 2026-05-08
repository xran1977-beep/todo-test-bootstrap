# React Todo List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal React + TypeScript todo list (add / toggle / delete) using strict TDD, in `~/todo-test-bootstrap/`.

**Architecture:** Vite scaffolded React-TS project. Two components (`<App>` owns state + input; `<TodoItem>` is pure presentational). State lives in `useState<Todo[]>`. Two test files — unit tests on `<TodoItem>` callbacks, integration tests on `<App>` flows.

**Tech Stack:** React 18, TypeScript 5, Vite 5, Vitest 1.x, @testing-library/react, @testing-library/user-event, jsdom.

**Spec:** `docs/superpowers/specs/2026-05-08-react-todo-design.md`.

---

## File Structure

| Path | Purpose |
| --- | --- |
| `package.json` | Scripts: `dev`, `build`, `preview`, `test`. Vitest jsdom config. |
| `vite.config.ts` | Vite + Vitest config (jsdom, setupFiles). |
| `tsconfig.json`, `tsconfig.node.json` | Vite defaults. |
| `index.html` | Vite entry HTML. |
| `src/main.tsx` | Mount `<App />` into `#root`. |
| `src/types.ts` | `Todo` type. |
| `src/TodoItem.tsx` | Pure component: checkbox + label + delete button. |
| `src/App.tsx` | Owns `Todo[]` and input value. Renders input + Add + list. |
| `src/App.css` | `.done { text-decoration: line-through }` and minimal layout. |
| `src/test-setup.ts` | `import '@testing-library/jest-dom/vitest'`. |
| `src/TodoItem.test.tsx` | 5 unit tests. |
| `src/App.test.tsx` | 5 integration tests. |

---

### Task 0: Scaffold Vite + TS + Vitest

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx` (placeholder), `src/App.css` (placeholder), `src/test-setup.ts`, `.gitignore`

- [ ] **Step 1: Scaffold via `npm create vite`**

Run:
```bash
cd ~/todo-test-bootstrap
npm create vite@latest . -- --template react-ts
```
When prompted "Current directory is not empty…": choose **Ignore files and continue**.

- [ ] **Step 2: Install runtime deps**

Run:
```bash
npm install
```
Expected: `node_modules/` populated, no errors.

- [ ] **Step 3: Install test deps**

Run:
```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

- [ ] **Step 4: Configure Vitest in `vite.config.ts`**

Replace `vite.config.ts` with:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

- [ ] **Step 5: Create `src/test-setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 6: Add `test` script in `package.json`**

In `package.json` `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 7: Sanity-run the test runner**

Run:
```bash
npm test
```
Expected: "No test files found" (or Vitest exits 0/1 with that message). This proves the harness is wired.

- [ ] **Step 8: Commit scaffold**

```bash
git add -A
git commit -m "chore: scaffold vite + react-ts + vitest"
```

---

### Task 1: Define `Todo` type

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: Write the type**

`src/types.ts`:
```ts
export type Todo = {
  id: string
  text: string
  done: boolean
}
```

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: Todo type"
```

---

### Task 2: `TodoItem` renders text + checked state

**Files:**
- Create: `src/TodoItem.test.tsx`, `src/TodoItem.tsx`

- [ ] **Step 1: Write the failing test**

`src/TodoItem.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TodoItem } from './TodoItem'
import type { Todo } from './types'

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 'id-1',
  text: 'Buy milk',
  done: false,
  ...overrides,
})

describe('TodoItem', () => {
  it('renders the todo text', () => {
    render(<TodoItem todo={makeTodo()} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })

  it('checkbox reflects done state', () => {
    const { rerender } = render(
      <TodoItem todo={makeTodo({ done: false })} onToggle={vi.fn()} onDelete={vi.fn()} />,
    )
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    rerender(
      <TodoItem todo={makeTodo({ done: true })} onToggle={vi.fn()} onDelete={vi.fn()} />,
    )
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './TodoItem'`.

- [ ] **Step 3: Write minimal implementation**

`src/TodoItem.tsx`:
```tsx
import type { Todo } from './types'

type Props = {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li>
      <label>
        <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
        <span>{todo.text}</span>
      </label>
      <button aria-label="delete" onClick={() => onDelete(todo.id)}>×</button>
    </li>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm test
```
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add src/TodoItem.tsx src/TodoItem.test.tsx
git commit -m "feat: TodoItem renders text and checked state"
```

---

### Task 3: `TodoItem` toggle callback

**Files:**
- Modify: `src/TodoItem.test.tsx` (already covered by Step-1 implementation, but add explicit callback test)

- [ ] **Step 1: Add the failing test**

Append to `src/TodoItem.test.tsx` inside `describe('TodoItem', ...)`:
```tsx
  it('calls onToggle with the todo id when checkbox is clicked', async () => {
    const user = (await import('@testing-library/user-event')).default.setup()
    const onToggle = vi.fn()
    render(<TodoItem todo={makeTodo()} onToggle={onToggle} onDelete={vi.fn()} />)
    await user.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith('id-1')
  })
```

- [ ] **Step 2: Run test to verify**

Run:
```bash
npm test
```
Expected: 3 passing (Task-2 implementation already wires onToggle, so this is a regression-pin test).

- [ ] **Step 3: Commit**

```bash
git add src/TodoItem.test.tsx
git commit -m "test: TodoItem.onToggle pin"
```

---

### Task 4: `TodoItem` delete callback

- [ ] **Step 1: Add the failing test**

Append to `src/TodoItem.test.tsx`:
```tsx
  it('calls onDelete with the todo id when delete button is clicked', async () => {
    const user = (await import('@testing-library/user-event')).default.setup()
    const onDelete = vi.fn()
    render(<TodoItem todo={makeTodo()} onToggle={vi.fn()} onDelete={onDelete} />)
    await user.click(screen.getByRole('button', { name: 'delete' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith('id-1')
  })
```

- [ ] **Step 2: Run test to verify**

Run:
```bash
npm test
```
Expected: 4 passing.

- [ ] **Step 3: Commit**

```bash
git add src/TodoItem.test.tsx
git commit -m "test: TodoItem.onDelete pin"
```

---

### Task 5: `TodoItem` adds `done` class

- [ ] **Step 1: Add the failing test**

Append to `src/TodoItem.test.tsx`:
```tsx
  it('applies the "done" class when todo.done is true', () => {
    const { container, rerender } = render(
      <TodoItem todo={makeTodo({ done: false })} onToggle={vi.fn()} onDelete={vi.fn()} />,
    )
    const li = container.querySelector('li')!
    expect(li).not.toHaveClass('done')
    rerender(
      <TodoItem todo={makeTodo({ done: true })} onToggle={vi.fn()} onDelete={vi.fn()} />,
    )
    expect(li).toHaveClass('done')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test
```
Expected: FAIL — `expected element to have class "done"`.

- [ ] **Step 3: Update `TodoItem.tsx` to apply the class**

Replace the `<li>` line in `src/TodoItem.tsx` with:
```tsx
    <li className={todo.done ? 'done' : undefined}>
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm test
```
Expected: 5 passing.

- [ ] **Step 5: Commit**

```bash
git add src/TodoItem.tsx src/TodoItem.test.tsx
git commit -m "feat: TodoItem applies done class"
```

---

### Task 6: `App` add flow

**Files:**
- Create: `src/App.test.tsx`
- Modify: `src/App.tsx` (replace Vite scaffold contents)

- [ ] **Step 1: Write the failing test**

Replace `src/App.test.tsx` (or create it) with:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('adds a todo when typing text and clicking Add', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: /new todo/i })
    await user.type(input, 'Buy milk')
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test
```
Expected: FAIL — either `Cannot find module './App'` (after we delete the scaffold) or "no textbox with name new todo".

- [ ] **Step 3: Replace `src/App.tsx`**

Replace `src/App.tsx` with:
```tsx
import { useState } from 'react'
import { TodoItem } from './TodoItem'
import type { Todo } from './types'
import './App.css'

export function App() {
  const [text, setText] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = () => {
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, done: false }])
    setText('')
  }

  return (
    <main>
      <h1>Todos</h1>
      <div>
        <input
          aria-label="new todo"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((t) => (
          <TodoItem
            key={t.id}
            todo={t}
            onToggle={() => {}}
            onDelete={() => {}}
          />
        ))}
      </ul>
    </main>
  )
}

export default App
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm test
```
Expected: 6 passing.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: App add flow"
```

---

### Task 7: `App` empty-input guard

- [ ] **Step 1: Add the failing test**

Append to the `describe('App', ...)` block in `src/App.test.tsx`:
```tsx
  it('Add button is disabled when input is empty or whitespace only', async () => {
    const user = userEvent.setup()
    render(<App />)
    const button = screen.getByRole('button', { name: /add/i })
    expect(button).toBeDisabled()
    const input = screen.getByRole('textbox', { name: /new todo/i })
    await user.type(input, '   ')
    expect(button).toBeDisabled()
    await user.type(input, 'x')
    expect(button).toBeEnabled()
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test
```
Expected: FAIL — `expected button to be disabled`.

- [ ] **Step 3: Add the guard in `App.tsx`**

In `src/App.tsx`, change the Add button line to:
```tsx
        <button onClick={addTodo} disabled={text.trim().length === 0}>Add</button>
```

And update `addTodo` to use the trimmed text:
```tsx
  const addTodo = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: trimmed, done: false }])
    setText('')
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm test
```
Expected: 7 passing.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: App add disabled when empty"
```

---

### Task 8: `App` toggle, delete, and round-trip

- [ ] **Step 1: Add the failing tests**

Append to the `describe('App', ...)` block:
```tsx
  it('toggles a todo when its checkbox is clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    await user.type(screen.getByRole('textbox', { name: /new todo/i }), 'Buy milk')
    await user.click(screen.getByRole('button', { name: /add/i }))
    await user.click(screen.getByRole('checkbox'))
    expect(container.querySelector('li')).toHaveClass('done')
  })

  it('deletes a todo when its delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByRole('textbox', { name: /new todo/i }), 'Buy milk')
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'delete' }))
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument()
  })

  it('round-trip: add A, add B, toggle A, delete B', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    const input = screen.getByRole('textbox', { name: /new todo/i })
    const add = screen.getByRole('button', { name: /add/i })

    await user.type(input, 'A')
    await user.click(add)
    await user.type(input, 'B')
    await user.click(add)

    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])

    const deleteButtons = screen.getAllByRole('button', { name: 'delete' })
    await user.click(deleteButtons[1])

    const items = container.querySelectorAll('li')
    expect(items.length).toBe(1)
    expect(items[0]).toHaveTextContent('A')
    expect(items[0]).toHaveClass('done')
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
npm test
```
Expected: FAIL on toggle (no class change), delete (item still present), round-trip.

- [ ] **Step 3: Wire the callbacks in `App.tsx`**

In `src/App.tsx`, replace the `<TodoItem>` block with real callbacks:
```tsx
        {todos.map((t) => (
          <TodoItem
            key={t.id}
            todo={t}
            onToggle={(id) =>
              setTodos((prev) => prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))
            }
            onDelete={(id) => setTodos((prev) => prev.filter((x) => x.id !== id))}
          />
        ))}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
npm test
```
Expected: 10 passing.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: App toggle/delete/round-trip"
```

---

### Task 9: Style + browser smoke

**Files:**
- Modify: `src/App.css`, `src/main.tsx` (already wires `<App />` from scaffold), `index.html`

- [ ] **Step 1: Replace `src/App.css`**

```css
main {
  max-width: 32rem;
  margin: 2rem auto;
  font-family: system-ui, sans-serif;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
}
li label {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
li.done span {
  text-decoration: line-through;
  color: #888;
}
button {
  cursor: pointer;
}
```

- [ ] **Step 2: Confirm `src/main.tsx` mounts `<App />`**

Vite scaffold ships:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
If your scaffold differs, update to match.

- [ ] **Step 3: Run dev server**

Run (in a separate terminal — or background):
```bash
npm run dev
```
Open the URL it prints (usually `http://localhost:5173`). Add a todo, toggle, delete. Confirm strike-through on done. Stop the server when satisfied.

- [ ] **Step 4: Final test run**

Run:
```bash
npm test
```
Expected: 10 passing.

- [ ] **Step 5: Commit**

```bash
git add src/App.css src/main.tsx index.html
git commit -m "style: minimal layout + done strike-through"
```

---

## Self-Review

**1. Spec coverage:**
- Add → Task 6
- Toggle → Tasks 2, 3, 8
- Delete → Tasks 4, 8
- Empty-input guard → Task 7
- `done` class strike-through → Tasks 5, 9
- Test layers (unit + integration) → Tasks 2-5 unit, 6-8 integration
- All 10 acceptance tests covered.

**2. Placeholder scan:** No "TBD", "TODO", or "etc." in any task. Every code step has full code.

**3. Type consistency:**
- `Todo` shape `{id, text, done}` is identical across `types.ts`, `TodoItem` props, and `App` state.
- `onToggle(id: string)` / `onDelete(id: string)` signatures match between `TodoItem` and `App` callbacks.
- Test imports use named export `App` everywhere; the file also re-exports `default App` for `main.tsx` compatibility — both forms covered.

No issues to fix.
