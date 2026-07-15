import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('5.16: the form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog}/>)

  const inputTitle = screen.getByPlaceholderText('write title here')
  const inputAuthor = screen.getByPlaceholderText('write author name here')
  const inputUrl = screen.getByPlaceholderText('write url here')
  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'inputting title')
  await user.type(inputAuthor, 'inputting author')
  await user.type(inputUrl, 'inputting url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].author).toBe('inputting author')
})