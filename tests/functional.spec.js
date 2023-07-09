const {test, expect } = require('@playwright/test');
import {LoginPage} from '../pages/login';
import {inventoryPage} from '../pages/inventory';
import {cartPage} from '../pages/cart';
import { checkoutPage } from '../pages/checkout';


test.beforeEach(async ({ page }, testInfo) => {
    const Login = new LoginPage(page);
    await Login.gotToLP();
    await Login.login("standard_user","secret_sauce");
    testInfo.setTimeout(testInfo.timeout + 10000);
    
});

// test.afterEach(async ({ page }) => {
//     await page.close();
    
// });
const prodNames = [
    "Sauce Labs Bike Light",
    "Sauce Labs Onesie",
    "Test.allTheThings() T-Shirt (Red)"
];

test.describe('Cart Feature',() =>{

    

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
    });
    
    
    test('I want to check cart', async ({ page }) => {
        const cart = new cartPage(page);
        // const inventory = new inventoryPage(page);
        // await page.pause();

        await cart.addTocartByName(prodNames);
        await cart.goToCartPage();

        expect(cart.getSelectedProdInv).toEqual(cart.getSelectedProdCart);

        console.log(cart.getSelectedProdInv);
        console.log(cart.getSelectedProdCart);
    });

    test('I want to remove products based on the product name at "cart page"', async ({ page }) => {
        
        const cart = new cartPage(page);
        // const inventory = new inventoryPage(page);

        const rmvProd = [
            "Sauce Labs Bike Light",
            "Test.allTheThings() T-Shirt (Red)"
        ];

        await cart.addTocartByName(prodNames);
        await cart.goToCartPage();

        await cart.removeProdByName(rmvProd);

        const amountOfcart = await cart.cartBadge.textContent();
        const length = await cart.removeButton.count();
        await expect(amountOfcart).toEqual(length.toString());
    });

    test('I want to go back to the inventory page after clicking continue shopping', async ({ page }) => {
        const cart = new cartPage(page);

        await cart.addTocartByName(prodNames);
        await cart.goToCartPage();
        await cart.backToInvPage();
        await expect(page).toHaveURL(cart.inventory_url_pattern);
    });

    
     
});

test.describe('Checkout Order', () => {
    
    test('I want to checkout order', async ({ page }) => {
        
        const checkout = new checkoutPage(page);

        await checkout.addTocartByName(prodNames);
        await checkout.goToCartPage();
        const data = [
            "Nama saya",
            "saya nama",
            "23404"
        ]
        await checkout.checkOutOrder(data[0],data[1],data[2])

    })
    

});
