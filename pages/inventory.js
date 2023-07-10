const { expect } = require("@playwright/test");

exports.inventoryPage = class inventoryPage {

    constructor(page){
        this.page = page;
        this.inventoryContainer = page.locator('.inventory_container');
        this.inventory_url_pattern = /.*inventory/;
        this.prodNameElement = page.locator('.inventory_item_name');
        // mengambil id dengan text awal ditandai dengan simbol [ ^ ]
        this.addTocartButton = page.locator('button[id^="add-to-cart"]');
        this.removeButton = page.locator('button[id^="remove"]');

        this.cartButton = page.locator('.shopping_cart_container');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.getSelectedProdInv = []; // Menampung product yang di pilih oleh user, untuk assertion di fitur cart page
        
        // Sort Products
        this.selectOptions = '[data-test="product_sort_container"]';
       
       
    }   


    // Add to cart by loop
    async addTocart(amount){
        // Add product sebanyak ammount
        for(let i=1; i<= amount; i++){

            // Untuk mengatsai Error: locator.click: Error: strict mode violation
            // Karena mengidentifikasi addTocartButton dengan banyak jdi ambigu mau pilih locator yg mana
            // Maka gunakan first() untuk menseleksi element pertama dari addTocartButton
            await this.addTocartButton.first().click();
            
        }
    }

    // Fungsi untuk mengeluarkan karakter-karakter yang tidak valid pada string
    escapeString(str) {
        return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    }

    // Add to cart by product name
    async addTocartByName(prodNames){
        // loop sesuai array nama yang ada pada spec
        for (const prodname of prodNames){
            // Untuk menghindari error Error: locator.click: Unexpected token
            // Karena ada karakter yang tidak valid dalam nama seperti "( )"
            // Maka harus di escape dulu 
            const replace = prodname.replace(/ /g,"-").toLowerCase(); // replace ke, contoh : prod-name-a
            const idBtn = '#add-to-cart-' + replace;
            const escape = this.escapeString(idBtn);
            await this.page.locator(`${escape}`).click();

            this.getSelectedProdInv.push(prodname); //Menampung product yang di pilih oleh user
             
        }
    }

    async removeProdByName(removeProds){
        for (const prodname of removeProds){

            const replace = prodname.replace(/ /g,"-").toLowerCase(); // replace ke, contoh : prod-name-a
            const idBtn = '#remove-' + replace;
            const escape = this.escapeString(idBtn);
            await this.page.locator(`${escape}`).click();
        }
    }

    async removeAllProducts(){
        
        const length = await this.removeButton.count();
        for (let i = 1; i<= length; i++){
            
            await this.removeButton.first().click();
        }
    }


    async sortProdByName(label){
        await this.page.selectOption(this.selectOptions, {label: label});
        
        // PRODUCTS NAME
        let arrAllProductsName = []; //Menampung semua product name element
        let arrCompareName = []; //Menampung semua product name element untuk di compare
      
        const getProductsName = await this.page.$$('.inventory_item_name'); //array element
        for (const productName of getProductsName){
            const name = await productName.textContent(); // get the text
            arrAllProductsName.push(name); 
            arrCompareName.push(name); 
        }

        const defaultSortName = arrCompareName.sort(); // variable compare di jadikan sort default dulu 

        if(label == 'Name (Z to A)'){
            defaultSortName.sort().reverse();
            // console.log(arrAllProductsName);
            // console.log(defaultSortName);
            expect(arrAllProductsName).toEqual(defaultSortName);

        }else if (label == 'Name (A to Z)'){
            // console.log(arrAllProductsName)
            // console.log(defaultSortName);

            expect(arrAllProductsName).toEqual(defaultSortName);
        }
        // END PRODUCTS NAME

        // PRODUCTS PRICE
        let arrAllProductsPrices = [];
        let arrComparePrices = [];

        const getProductsPrices = await this.page.$$('.inventory_item_price');

        for (const productPrice of getProductsPrices){
            const price = await productPrice.textContent();
            const makeNumber = Number(price.replace('$',''));
            arrAllProductsPrices.push(makeNumber);
            arrComparePrices.push(makeNumber);
        }

        const defaultSortPrice = arrComparePrices.sort((a, b) => a - b);

        if (label == 'Price (high to low)'){
            defaultSortPrice.sort((a, b) => b - a);
            // console.log(arrAllProductsPrices);
            // console.log(defaultSortPrice);
            expect(arrAllProductsPrices).toEqual(defaultSortPrice);
        }else if(label == 'Price (low to high)'){
            // console.log(arrAllProductsPrices);
            // console.log(defaultSortPrice);
            expect(arrAllProductsPrices).toEqual(defaultSortPrice);
        }
        
    }
  



}