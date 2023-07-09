const { cartPage } = require("./cart");

exports.checkoutPage = class checkoutPage extends cartPage {

    constructor(page){
        super(page);

        this.firstName = page.locator('[data-test="firstName"]');
        this.lastName = page.locator('[data-test="lastName"]');
        this.postalCode = page.locator('[data-test="postalCode"]');
        this.checkout_url_pattern = /.*checkout-step-one.html/
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.continueButton = page.locator('[data-test="continue"]');
    }


    async checkOutOrder(firstname,lastname,postal){
            
        await this.checkoutButton.click();

        await this.firstName.click();
        await this.firstName.fill(firstname);

        await this.lastName.click();
        await this.lastName.fill(lastname);

        await this.postalCode.click();
        await this.postalCode.fill(postal);

        await this.continueButton.click()

        // Lanjut besok
    }
}