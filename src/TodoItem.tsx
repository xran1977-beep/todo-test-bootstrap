import type { Todo } from './types'

type Props = {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li className={todo.done ? 'done' : undefined}>
      <label>
        <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
        <span>{todo.text}</span>
      </label>
      <button aria-label="delete" onClick={() => onDelete(todo.id)}>×</button>
    </li>
  )
}
