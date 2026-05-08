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

  it('calls onToggle with the todo id when checkbox is clicked', async () => {
    const userEvent = (await import('@testing-library/user-event')).default
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<TodoItem todo={makeTodo()} onToggle={onToggle} onDelete={vi.fn()} />)
    await user.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith('id-1')
  })

  it('calls onDelete with the todo id when delete button is clicked', async () => {
    const userEvent = (await import('@testing-library/user-event')).default
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<TodoItem todo={makeTodo()} onToggle={vi.fn()} onDelete={onDelete} />)
    await user.click(screen.getByRole('button', { name: 'delete' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith('id-1')
  })
})
