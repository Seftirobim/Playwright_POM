const {test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 30000);
    await page.goto('https://saucedemo.com');
});

test.describe('Login page',() =>{
    
    const users = [
        "standard_user",
        "problem_user"
    ];
    
    const password = "secret_sauce";
    
    test('Go to login page', async ({ page }) =>{

        await expect(page).toHaveTitle('Swag Labs');
    });
    
    for (const username of users) {
        test(`I want to login with ${username}`, async ({ page }) =>{

            await page.locator('[data-test="username"]').click();
            await page.locator('[data-test="username"]').fill(username);
            await page.locator('[data-test="password"]').click();
            await page.locator('[data-test="password"]').fill(password);

            await page.locator('[data-test="login-button"]').click();

            await expect(page).toHaveURL(/.*inventory/);
        })
    }

    test('I want to login with invalid credentials', async({page}) =>{
        
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('invalid');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('invalid');
        
        await page.locator('[data-test="login-button"]').click();

        await expect(page.locator('[data-test="error"]')).toContainText("Username and password do not match any user in this service");
    });

    test('I want to login with locked out user', async({ page }) =>{
        
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('locked_out_user');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill(password);

        await page.locator('[data-test="login-button"]').click();

        await expect(page.locator('[data-test="error"]')).toContainText("Sorry, this user has been locked out.")


    });

    test('I want to click to the close button within the error message after i fill invalid credentials', async({page}) =>{
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('invalid');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('invalid');
        
        await page.locator('[data-test="login-button"]').click();
        await page.locator('.error-button').click();

        await expect(page.locator('[data-test="error"]')).not.toBeVisible();
        
    });

    test('I want to login with empty username and password', async({ page }) =>{
        await page.locator('[data-test="login-button"]').click();

        await expect(page.locator('[data-test="error"]')).toContainText("Epic sadface: Username and Password are required");
    });

    test('I want to login with empty username', async({page}) =>{
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill(password);

        await page.locator('[data-test="login-button"]').click();

        await expect(page.locator('[data-test="error"]')).toContainText("Epic sadface: Username is required");

    });

    test('I want to login with empty password', async ({ page }) => {
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill(users[0]);

        await page.locator('[data-test="login-button"]').click();

        await expect(page.locator('[data-test="error"]')).toContainText("Epic sadface: Password is required");
    })
    
    test('I want to logout webapp', async ({ page }) => {
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill(users[0]);
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill(password);
        
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/.*inventory/)

        await page.locator('.bm-burger-button').click();
        await page.locator('#logout_sidebar_link').click();

        await expect(page).toHaveURL(/.*saucedemo/)



    });
    
    

});
