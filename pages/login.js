const { expect } = require("@playwright/test");

// Gunakan exports agar bisa digunakan di luar file
exports.LoginPage = class LoginPage {

    // Sebagai inisialisasi
    constructor(page){

        this.page = page
        this.username_tb = page.locator('[data-test="username"]');
        this.password_tb = page.locator('[data-test="password"]');
        this.loginButton_tb = page.locator('[data-test="login-button"]');
        this.loginUrl = 'https://saucedemo.com';
        this.invUrlPatt = /.*inventory/;
    }

    async gotToLP(){
        await this.page.goto(this.loginUrl);
    }

    async login(username , password){
        await this.username_tb.click();
        await this.username_tb.fill(username);
        await this.password_tb.click();
        await this.password_tb.fill(password);
        await this.loginButton_tb.click();

        // const itemNameObj = await this.page.$$('.inventory_item_name');
        // let itemNames = [];

        // for (const itemName of itemNameObj){
        //     const text = await itemName.textContent();
        //     const rplcTxt = text.replace(/\s+/g,"-").toLowerCase();
        //     itemNames.push(rplcTxt);
        // }

        // To ensure that products have valid image
        const srcCompare = [
            '/static/media/sauce-backpack-1200x1500.0a0b85a3.jpg',
            '/static/media/bike-light-1200x1500.37c843b0.jpg',
            '/static/media/bolt-shirt-1200x1500.c2599ac5.jpg',
            '/static/media/sauce-pullover-1200x1500.51d7ffaf.jpg',
            '/static/media/red-onesie-1200x1500.2ec615b2.jpg',
            '/static/media/red-tatt-1200x1500.30dadef4.jpg'
          ];

        const imgAltObj = await this.page.$$('img[class="inventory_item_img"]')
        let altNames = [];

        for (const altName of imgAltObj){
            // const imgEl   = await altName.$('img');
            const altText = await altName.getAttribute('src');
            altNames.push(altText);
        }
        
        if(this.invUrlPatt.test(this.page.url())){

            expect(altNames).toEqual(expect.arrayContaining(srcCompare));
            await expect(this.page).toHaveURL(this.invUrlPatt);
        }

        // console.log(srcCompare);
        // console.log("--------");
        // console.log(altNames);
    }
    
}