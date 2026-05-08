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
