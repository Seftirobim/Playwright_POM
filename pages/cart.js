const { expect } = require("@playwright/test");
const { inventoryPage } = require("./inventory");

exports.cartPage = class cartPage extends inventoryPage {

        constructor(page){
            super(page) // Karena mengekstensi dari inventory maka panggil constructor page dari induknya
            this.cart_url_pattern = /.*cart/;    
            this.cartItemLabel = page.locator('.cart_item_label');
            this.continueShopButton = page.locator('[data-test="continue-shopping"]');
            this.checkoutButton = page.locator('[data-test="checkout"]');
            // this.prodNameElement = page.locator('.inventory_item_name');
            // this.removeButton = page.locator('button[id^="remove"]');
            // this.cartButton = page.locator('.shopping_cart_container');
            // this.cartBadge = page.locator('.shopping_cart_badge');

            this.getSelectedProdCart = []; // menampung nama product dari cart page untuk assertion
        }


        async goToCartPage(){
            await this.cartButton.click()
        
            // this.page.$$('.inventory_item_name') = Mengembalikan sebagai array dari element
            // this.page.locator('.inventory_item_name') = Mengembalikan object locator
            
            const prodNames = await this.page.$$('.inventory_item_name') 
            for (let prodname of prodNames){
                const text = await prodname.textContent();
                this.getSelectedProdCart.push(text);
            }

            await expect(this.page).toHaveURL(this.cart_url_pattern);
        }

        async backToInvPage(){
            await this.continueShopButton.click();
        }

        

    


}