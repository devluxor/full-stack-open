import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddBlogForm from './AddBlogForm'

test('blog is created correctly', async () => {
  const testTitle = 'testTitle'
  const testAuthor = 'testAuthor'
  const testURL = 'testRL'

  const mockHandler = jest.fn()

  const { container } = render(<AddBlogForm addBlog={mockHandler}/>)
  const titleInput = container.querySelector('[name*="title"]')
  const titleAuthor = container.querySelector('[name*="author"]')
  const titleURL = container.querySelector('[name*="url"]')

  const user = userEvent.setup()
  await user.type(titleInput, testTitle)
  await user.type(titleAuthor, testAuthor)
  await user.type(titleURL, testURL)

  const addBlogButton = container.querySelector('button.add-blog')
  await user.click(addBlogButton)
})