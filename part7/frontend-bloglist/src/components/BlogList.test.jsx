import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogList from './BlogList'

test('renders content', () => {
  const testTitle = 'testTitle'
  const testAuthor = 'testAuthor'
  const testURL = 'testRL'
  const testLikes = 1234567890
  const blogs = [
    {
      title: testTitle,
      author: testAuthor,
      url: testURL,
      testLikes: testLikes,
      user: '0',
    },
  ]

  render(<BlogList blogs={blogs} user={{ id: '0' }} />)

  const titleAndAuthor = screen.getByText(`${testTitle} by ${testAuthor}`, {
    exact: false,
  })
  const elementURL = screen.queryByText(testURL)
  const elementLikes = screen.queryByText(testLikes)

  expect(titleAndAuthor).toBeDefined()
  expect(elementURL).toBeNull()
  expect(elementLikes).toBeNull()
})

test('clicking shows details', async () => {
  const testTitle = 'testTitle'
  const testAuthor = 'testAuthor'
  const testURL = 'testRL'
  const testLikes = 1234567890
  const blogs = [
    {
      title: testTitle,
      author: testAuthor,
      url: testURL,
      testLikes: testLikes,
      user: '0',
    },
  ]

  render(<BlogList blogs={blogs} user={{ id: '0' }} />)

  const elementURL = screen.queryByText(testURL)
  const elementLikes = screen.queryByText(testLikes)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(elementURL).toBeDefined()
  expect(elementLikes).toBeDefined()
})

test('clicking like button calls like handler', async () => {
  const testTitle = 'testTitle'
  const testAuthor = 'testAuthor'
  const testURL = 'testRL'
  const testLikes = 1234567890
  const blogs = [
    {
      title: testTitle,
      author: testAuthor,
      url: testURL,
      testLikes: testLikes,
      user: '0',
    },
  ]

  const mockHandler = jest.fn()

  const { container } = render(
    <BlogList blogs={blogs} user={{ id: '0' }} likeBlog={mockHandler} />,
  )

  const elementURL = screen.queryByText(testURL)
  const elementLikes = screen.queryByText(testLikes)

  const user = userEvent.setup()
  const detailsButton = screen.getByText('view')
  await user.click(detailsButton)
  const likeButton = container.querySelector('button.like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
