const {test, expect } = require('@playwright/test');
import {LoginPage} from '../pages/login';
import {inventoryPage} from '../pages/inventory';
import {cartPage} from '../pages/cart';
import { checkoutPage } from '../pages/checkout';




// test.afterEach(async ({ page }) => {
//     await page.close();
    
// });
const prodNames = [
    "Sauce Labs Bike Light",
    "Sauce Labs Onesie",
    "Test.allTheThings() T-Shirt (Red)"
];

test.describe('Sort Product', () => {

    test.beforeEach(async ({ page }, testInfo) => {
        const Login = new LoginPage(page);
        await Login.gotToLP();
        
        //testInfo.setTimeout(testInfo.timeout + 10000);
        
    });

    // USER DAN LABEL STATIC
    // test.only('I want to sort product', async ({ page }) => {
    //     const label = [
    //         "Name (A to Z)",
    //         "Name (Z to A)",
    //         "Price (low to high)",
    //         "Price (high to low)",
    //     ];
    //     const Login = new LoginPage(page);

    //     await Login.login("standard_user","secret_sauce");

    //     const inventory = new inventoryPage(page);

    //     await expect(page).toHaveURL(inventory.inventory_url_pattern);

    //     await inventory.sortProdByName(label[3]);
    //     // await page.pause()
        
    // });

    // TEST USER DAN LABEL SESUAI ARRAY
    const datas = [
        ['standard_user','problem_user'],

        ["Name (A to Z)",
        "Name (Z to A)",
        "Price (low to high)",
        "Price (high to low)"]
    ];

    const [users,labels] = datas; // definisikan datas[0] adalah users, datas[1] adalah labels
    for (const user of users){ // looping dulu sebanyak user yaitu 2 user

        // lalu looping lagi sebanyak label. kalo di panggil valuenya akan menjadi:

        // | standard_user | standard_user | standard_user       | standard_user |
        // | Name (A to Z) | Name (Z to A) | Price (low to high) | Price (high to low) | 

        // | problem_user  | problem_user  | problem_user        | problem_user        |
        // | Name (A to Z) | Name (Z to A) | Price (low to high) | Price (high to low) |
        
        // 8 kali eksekusi

        for (const label of labels){ 
            test(`I want to sort product with user ${user} & label ${label}`, async ({ page }) => {
            
                const Login = new LoginPage(page);
        
                await Login.login(user,"secret_sauce");
        
                const inventory = new inventoryPage(page);
        
                await expect(page).toHaveURL(inventory.inventory_url_pattern);
        
                await inventory.sortProdByName(label);
                // await page.pause()
                
            })
        }
    }

    

});

test.describe('Cart Feature',() =>{

    test.beforeEach(async ({ page }, testInfo) => {
        const Login = new LoginPage(page);
        await Login.gotToLP();
        await Login.login("standard_user","secret_sauce");
        //testInfo.setTimeout(testInfo.timeout + 10000);
        
    });
    
    test('I want to add products to cart', async({ page }) =>{
        const inventory = new inventoryPage(page);
        // tambahkan product
        await inventory.addTocart(3);
        
        // Hitung element tombol remove
        const length = await inventory.removeButton.count();

        // dapatkan text pada cartBade
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
    
    
    test('I want to check cart page', async ({ page }) => {
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

    test('I want to return to the inventory page after clicking the "continue shopping" button. @functional', async ({ page }) => {
        const cart = new cartPage(page);

        await cart.addTocartByName(prodNames);
        await cart.goToCartPage();
        await cart.backToInvPage();
        await expect(page).toHaveURL(cart.inventory_url_pattern);
    });

    
     
});

test.describe('Checkout Order', () => {
    
    test.beforeEach(async ({ page }, testInfo) => {
        const Login = new LoginPage(page);
        await Login.gotToLP();
        await Login.login("standard_user","secret_sauce");
        //testInfo.setTimeout(testInfo.timeout + 10000);
        
    });

    test('I want to checkout order', async ({ page }) => {
        
        const checkout = new checkoutPage(page);
        //await page.pause();
        await checkout.addTocartByName(prodNames);
        await checkout.goToCartPage();
        const data = [
            "Nama saya",
            "saya nama",
            "23404"
        ]
        
        await checkout.checkOutOrder(data[0],data[1],data[2])
        await checkout.finishOrder();
        
    });

    test('I want to checkout with empty form order', async ({ page }) => {
        
        const checkout = new checkoutPage(page);

        await checkout.addTocart(3);
        await checkout.goToCartPage();
        await checkout.checkOutOrder('','','');
    });
    
    test('I want to checkout with empty First Name', async ({ page }) => {
        
        const checkout = new checkoutPage(page);

        await checkout.addTocart(3);
        await checkout.goToCartPage();
        await checkout.checkOutOrder("","Example","40235");
    });

    test('I want to checkout with empty Last Name', async ({ page }) => {
        
        const checkout = new checkoutPage(page);

        await checkout.addTocart(3);
        await checkout.goToCartPage();
        await checkout.checkOutOrder("Example","","40235");
    });

    test('I want to checkout with empty Postal Code', async ({ page }) => {
        
        const checkout = new checkoutPage(page);

        await checkout.addTocart(3);
        await checkout.goToCartPage();
        await checkout.checkOutOrder("Example","Example","");
    });

    test('I want to checkout with empty First Name and Last Name', async ({ page }) => {
        
        const checkout = new checkoutPage(page);

        await checkout.addTocart(3);
        await checkout.goToCartPage();
        await checkout.checkOutOrder("","","40567");
    });

    test('I want to checkout with empty First Name and Postal Code', async ({ page }) => {
        
        const checkout = new checkoutPage(page);

        await checkout.addTocart(3);
        await checkout.goToCartPage();
        await checkout.checkOutOrder("","Example","");
    });

    test('I want to checkout with empty Last Name and Postal Code', async ({ page }) => {
        
        const checkout = new checkoutPage(page);

        await checkout.addTocart(3);
        await checkout.goToCartPage();
        await checkout.checkOutOrder("Example","","");
    });

    test('I want to checkout with invalid input format at Postal Code', async ({ page }) => {
        
        const checkout = new checkoutPage(page);
        //await page.pause();
        await checkout.addTocart(3);
        await checkout.goToCartPage();
        await checkout.checkOutOrder("Example","caoms","String");
    });

    test('II want to return to the cart page after clicking the "cancel" button. @functional', async ({ page }) => {
        
        const checkout = new checkoutPage(page);
        
        await checkout.addTocart(3);
        await checkout.goToCartPage();
        await checkout.checkOutOrder("Example","Example","43212",true); // True for cancel, default false
        

        await expect(page).toHaveURL(checkout.cart_url_pattern)
    });

    test('I want to cancel order and return to the inventory page @functional', async ({ page }) =>{
        const checkout = new checkoutPage(page);
        
        await checkout.addTocart(3);
        await checkout.goToCartPage();
        await checkout.checkOutOrder("Example","Example","43212");
        await checkout.finishOrder(true); // True for cancel, default false

        await expect(page).toHaveURL(checkout.inventory_url_pattern);

        

    });

    test('I want to checkout empty product', async ({ page }) => {
        
        const checkout = new checkoutPage(page);

        await checkout.goToCartPage();
        
        await expect(checkout.checkoutButton).toBeHidden();
        //await checkout.checkoutButton.click();

        // await expect(checkout.errorMsg).toHaveText("Error: Add the product(s) first");

    });

});



