import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

// Shared test data
let blog, user
beforeEach(() => {
  blog = {
    title: 'Blog title',
    author: 'Blog author',
    url: 'Blog url',
    likes: 5,
    user: { id: 'user1', name: 'Test User' }
  }
  user = { id: 'user1', name: 'Test User' }
})

// Tests:
test('5.13: renders the blog\'s title and author, but does not render its URL or number of likes by default', () => {
  render(<Blog blog={blog} user={user}/>)

  const titleElement = screen.getByText('Blog title', { exact: false })
  const authorElement = screen.getByText('Blog author', { exact: false })
  const urlElement = screen.queryByText('Blog url')
  const likesElement = screen.queryByText('5')

  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('5.14: blog\'s URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
  render(<Blog blog={blog} user={user}/>)

  // Press view button
  const session = userEvent.setup()
  const button = screen.getByText('view')
  await session.click(button)

  expect(screen.getByText('Blog url', { exact: false })).toBeDefined()
  expect(screen.getByText('Blog url', { exact: false })).toBeDefined()
})

test('5.15: if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={user} updateBlog={mockHandler} />)

  // Press view button
  const session = userEvent.setup()
  await session.click(screen.getByText('view')) // Show details first
  await session.click(screen.getByText('like'))
  await session.click(screen.getByText('like'))

  expect(mockHandler.mock.calls).toHaveLength(2)
})

