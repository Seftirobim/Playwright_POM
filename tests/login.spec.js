const {test, expect } = require('@playwright/test');
import {LoginPage} from '../pages/login';

test.describe('Login page',() =>{
    
    test.beforeEach(async ({ page }, testInfo) => {
        const Login = new LoginPage(page);
        await Login.gotToLP();
        testInfo.setTimeout(testInfo.timeout + 10000);
        
    });
    
    test('Go to login page', async ({ page }) =>{

        await expect(page).toHaveTitle('Swag Labs');
    });

    const users = [
        "standard_user",
        "problem_user"
    ];
    
    const password = "secret_sauce";
    
    for (const username of users) {
        test(`I want to login with ${username}`, async ({ page }) =>{
            //Panggil class dan buat object LoginPage
            const Login = new LoginPage(page);

            await Login.login(username,password);
            
        })
    }

    test('I want to login with invalid credentials', async({page}) =>{
        
        const Login = new LoginPage(page);
        
        await Login.login('invalid','invalid');
        await expect(page.locator('[data-test="error"]')).toContainText("Username and password do not match any user in this service");
    });

    test('I want to login with locked out user', async({ page }) =>{
        
        const Login = new LoginPage(page);

        await Login.login('locked_out_user',password)
        await expect(page.locator('[data-test="error"]')).toContainText("Sorry, this user has been locked out.")


    });

    test('I want to click to the close button within the error message after i fill invalid credentials @functional', async({page}) =>{
        const Login = new LoginPage(page);
        await Login.login('invalid','invalid');
        
        await page.locator('.error-button').click();
        await expect(page.locator('[data-test="error"]')).not.toBeVisible();
        
    });

    test('I want to login with empty username and password', async({ page }) =>{
        await page.locator('[data-test="login-button"]').click();

        await expect(page.locator('[data-test="error"]')).toContainText("Epic sadface: Username and Password are required");
    });

    test('I want to login with empty username', async({page}) =>{
        const Login = new LoginPage(page)

        await Login.login("",password);

        await expect(page.locator('[data-test="error"]')).toContainText("Epic sadface: Username is required");

    });

    test('I want to login with empty password', async ({ page }) => {
        const Login = new LoginPage(page);

        await Login.login(users[0],'');
        await expect(page.locator('[data-test="error"]')).toContainText("Epic sadface: Password is required");
    })
    
    test('I want to logout webapp @functional', async ({ page }) => {
        
        const Login = new  LoginPage(page)

        await Login.login(users[0],password);
        await expect(page).toHaveURL(/.*inventory/);

        await page.locator('.bm-burger-button').click();
        await page.locator('#logout_sidebar_link').click();

        await expect(page).toHaveURL(/.*saucedemo/)



    });
    
    

});
