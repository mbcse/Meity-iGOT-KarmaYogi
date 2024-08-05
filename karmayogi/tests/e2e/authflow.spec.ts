import { test, expect } from '@playwright/test';

test('signup flow', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('test@mail.in');
  await page.getByPlaceholder('Email').press('Tab');
  await page.getByPlaceholder('Password').fill('mailtest');
  await page.getByRole('checkbox').click();
  await page.getByLabel('signup button').click();
  await page.waitForURL('http://localhost:3000');
});



test('login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByPlaceholder('email').click();
  await page.getByPlaceholder('email').fill('test@mail.in');
  await page.getByPlaceholder('email').press('Tab');
  await page.getByPlaceholder('Password').fill('mailtest');
  await page.getByLabel('login button').click();
  await page.waitForURL('http://localhost:3000');
});