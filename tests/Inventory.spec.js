const {test, expect } = require('@playwright/test');
import {LoginPage} from '../pages/login';
import {inventoryPage} from '../pages/inventory';


test.beforeEach(async ({ page }, testInfo) => {
    const Login = new LoginPage(page);
    await Login.gotToLP();
    await Login.login("standard_user","secret_sauce");
    testInfo.setTimeout(testInfo.timeout + 10000);
    
});

// test.afterEach(async ({ page }) => {
//     await page.close();
    
// });

test.describe('Cart Feature',() =>{

    const prodNames = [
        "Sauce Labs Bike Light",
        "Sauce Labs Onesie",
        "Test.allTheThings() T-Shirt (Red)"
    ];

    test('I want to add products to cart', async({ page }) =>{
        const inventory = new inventoryPage(page);
        // tambahkan product
        await inventory.addTocart(3);
        
        // Hitung element tombol remove
        const length = await inventory.removeButton.count();

        // tampilkan text pada cartBade
        const amountOfcart = await inventory.cartBadge.textContent();

        // assert apakah hasilnya sama
        await expect(amountOfcart).toEqual(length.toString());
    });

    test('I want to add product(s) based on the product name', async ({ page }) => {
        const inventory = new inventoryPage(page);
        
        await inventory.addTocartByName(prodNames);
        const amountOfcart = await inventory.cartBadge.textContent();
        const length = await inventory.removeButton.count();
        await expect(amountOfcart).toEqual(length.toString());
    });

    test('I want to remove product(s) based on the product name at inventory page', async ({ page }) => {
        const inventory = new inventoryPage(page);

        const removeProds = [
            "Sauce Labs Onesie",
            "Test.allTheThings() T-Shirt (Red)"
        ];

        await inventory.addTocartByName(prodNames)
        await inventory.removeProdByName(removeProds);

        const amountOfcart = await inventory.cartBadge.textContent();
        const length = await inventory.removeButton.count();
        await expect(amountOfcart).toEqual(length.toString());
        
    });

    test('I want to removes all product at inventory page', async ({ page }) => {
        const inventory = new inventoryPage(page);
        
        await inventory.addTocart(4);
        await inventory.removeAllProducts();

        await expect(inventory.cartBadge).not.toBeVisible();
    })
    
    
        
    
});