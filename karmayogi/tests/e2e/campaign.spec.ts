import { test, expect } from '@playwright/test';

const BASE_URL = "http://localhost:3000";

test('should go to campaign and check if heading exists', async ({page}) => {
    await page.goto(BASE_URL+'/campaigns');
    await page.getByRole("heading",{name:"Campaigns"})
})


test('should go to campaign , create campaign', async ({page}) => {
    await page.goto(BASE_URL+'/campaigns');
    await page.getByRole("button",{name:"Create +"}).click();


})