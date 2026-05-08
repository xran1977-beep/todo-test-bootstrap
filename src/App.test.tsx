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
