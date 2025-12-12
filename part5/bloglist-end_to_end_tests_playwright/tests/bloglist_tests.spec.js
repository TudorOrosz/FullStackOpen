const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'test_user',
        password: 'test_pass'
      }
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User 2',
        username: 'test_user2',
        password: 'test_pass2'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('Login to application')
    await expect(locator).toBeVisible()

    const locatorUsername = page.getByText('username')
    await expect(locator).toBeVisible()

    const locatorPassword = page.getByText('password')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('test_user')
      await page.getByLabel('password').fill('test_pass')
      await page.getByRole('button', { name: 'login' }).click()
      
      const locator = page.getByText('Test User is logged in')
      await expect(locator).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('test_user')
      await page.getByLabel('password').fill('wrong_password')
      await page.getByRole('button', { name: 'login' }).click()
      
      const locator = page.getByText('wrong credentials')
      await expect(locator).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('test_user')
      await page.getByLabel('password').fill('test_pass')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill('Test title')
      await textboxes[1].fill('Test author')
      await textboxes[2].fill('Test url')
      await page.getByRole('button', { name: 'create' }).click()

      const blogsList = page.locator('ul')
      await expect(blogsList.getByText('Test title')).toBeVisible()
      await expect(blogsList.getByText('Test author')).toBeVisible()
    })

    describe('And when a blog is already created', () =>{
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        const textboxes = await page.getByRole('textbox').all()
        await textboxes[0].fill('Test title')
        await textboxes[1].fill('Test author')
        await textboxes[2].fill('Test url')
        await page.getByRole('button', { name: 'create' }).click()
      })

      test('that blog can be liked', async ({ page }) => {
        const blogsList = page.locator('ul')

        await page.getByRole('button', { name: 'view' }).click()
        
        await page.getByRole('button', { name: 'like' }).click()
        await expect(blogsList.getByText('1')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(blogsList.getByText('2')).toBeVisible()
      })

      test('that blog can be deleted', async ({ page }) => {
        const blog = page.locator('ul').locator('div', { hasText: 'Test title' })
        await blog.getByRole('button', { name: 'view' }).click()
        
        // Attaching listener before we click delete
        page.once('dialog', async (dialog) => {
          await dialog.accept(); // click "Yes"
        });

        await blog.getByRole('button', { name: 'delete' }).click()
        await expect(blog).toHaveCount(0, { timeout: 5000 })
      })

      test('only the user who added the blog sees the blog_s delete button', async ({ page }) => {
        // Logout current user
        await page.getByRole('button', { name: 'logout' }).click()

        // Login with 2nd user
        await page.getByLabel('username').fill('test_user2')
        await page.getByLabel('password').fill('test_pass2')
        await page.getByRole('button', { name: 'login' }).click()

        // Open the test blog and check that it can't be deleted
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'delete' })).toHaveCount(0)
      })
      
      test('blogs are arranged in the order according to the likes, the blog with the most likes first', async ({ page }) => {
        test.setTimeout(10000)
        // like the 1st blog 3 times
        const blog1 = page.locator('ul').locator('div', { hasText: 'Test title' })
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(blog1.getByText('1')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(blog1.getByText('2')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(blog1.getByText('3')).toBeVisible()
        
        // create 2nd blog, like it 1 time
        await page.getByRole('button', { name: 'create new blog' }).click()
        const textboxes2 = await page.getByRole('textbox').all()
        await textboxes2[0].fill('title2')
        await textboxes2[1].fill('Test author2')
        await textboxes2[2].fill('Test url2')
        await page.getByRole('button', { name: 'create' }).click()

        const blog2 = page.locator('ul').locator('div', { hasText: 'title2' })

        await blog2.getByRole('button', { name: 'view' }).click()
        await blog2.getByRole('button', { name: 'like' }).click()
        await expect(blog2.getByText('1')).toBeVisible()
        
        // create 3rd blog, like it 5 times
        await page.getByRole('button', { name: 'create new blog' }).click()
        const textboxes3 = await page.getByRole('textbox').all()
        await textboxes3[0].fill('title3')
        await textboxes3[1].fill('Test author3')
        await textboxes3[2].fill('Test url3')
        await page.getByRole('button', { name: 'create' }).click()

        const blog3 = page.locator('ul').locator('div', { hasText: 'title3' })

        // Here we have to go directly and check inside the likes div for the count since otherwise it might interfere with the naming of title/author/url elements. e.g: value 3 is found multiple times
        const likeButton3 = blog3.getByRole('button', { name: 'like' })
        const likesDiv3 = likeButton3.locator('..') // parent element of the like button
        const timesToLike3 = 5
        await blog3.getByRole('button', { name: 'view' }).click()

        for (let i = 1; i <= timesToLike3; i++) {
          await likeButton3.click()
          await expect(likesDiv3).toContainText(String(i), { timeout: 5000 })
        }

        // test that they are in order from top to bottom: 3rd - 1st - 2nd
        const blogs = page.locator('ul > div')

        // wait that we indeed have 3 blog elements
        await expect(blogs).toHaveCount(3, { timeout: 5000 })
        
        // final order check
        await expect(blogs.nth(0).getByText('title3')).toBeVisible()
        await expect(blogs.nth(1).getByText('Test title')).toBeVisible()
        await expect(blogs.nth(2).getByText('title2')).toBeVisible()
      })      
    })
  })
})