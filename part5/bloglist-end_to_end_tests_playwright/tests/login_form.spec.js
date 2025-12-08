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

      // test('that blog can be deleted', async ({ page }) => {

      // })      
    }) 


  })  
  
})