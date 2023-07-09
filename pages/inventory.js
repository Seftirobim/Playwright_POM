exports.inventoryPage = class inventoryPage {

    constructor(page){
        this.page = page;
        this.inventoryContainer = page.locator('.inventory_container');

        this.prodNameElement = page.locator('.inventory_item_name');
        // mengambil id dengan text awal ditandai dengan simbol [ ^ ]
        this.addTocartButton = page.locator('button[id^="add-to-cart"]');
        this.removeButton = page.locator('button[id^="remove"]');

        this.cartButton = page.locator('.shopping_cart_container');
        this.cartBadge = page.locator('.shopping_cart_badge');
        
    }

    // Add to cart by loop
    async addTocart(amount){
        // Add product sebanyak ammount
        for(let i=1; i<= amount; i++){

            // Untuk mengatsai Error: locator.click: Error: strict mode violation
            // Karena playwright mengidentifikasi addTocartButton dengan banyak jdi ambigu mau pilih locator yg mana
            // Maka gunakan first() untuk menseleksi element pertama dari addTocartButton
            await this.addTocartButton.first().click();
        }
    }

    // Fungsi untuk mengeluarkan karakter-karakter pada string yang tidak valid
    escapeString(str) {
        return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    }

    // Add to cart by product name
    async addTocartByName(prodNames){
        // loop sesuai array nama yang ada pada test spec
        for (const prodname of prodNames){
            // Untuk menghindari error Error: locator.click: Unexpected token
            // Karena ada karakter yang tidak valid dalam nama seperti "( )"
            // Maka harus di escape dulu 
            const replace = prodname.replace(/ /g,"-").toLowerCase(); // replace ke, contoh : prod-name-a
            const idBtn = '#add-to-cart-' + replace;
            const escape = this.escapeString(idBtn);
            await this.page.locator(`${escape}`).click();
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



}