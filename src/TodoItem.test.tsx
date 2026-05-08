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
