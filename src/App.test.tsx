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
})
