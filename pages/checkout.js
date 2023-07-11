const {expect } = require('@playwright/test');
const { cartPage } = require("./cart");

exports.checkoutPage = class checkoutPage extends cartPage {

    constructor(page){
        super(page);

        this.firstName = page.locator('[data-test="firstName"]');
        this.lastName = page.locator('[data-test="lastName"]');
        this.postalCode = page.locator('[data-test="postalCode"]');
        this.checkout1_url_pattern = /.*checkout-step-one.html/;
        this.checkout2_url_pattern = /.*checkout-step-two.html/;
        this.checkoutComplete_url_pattern = /.*checkout-complete.html/;
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.cartList = page.locator('.cart_list');
        this.errorMsg = page.locator('[data-test="error"]');

        // Step Two page
        this.finishButton = page.locator('[data-test="finish"]');
        this.summarrySubTotal = page.locator('.summary_subtotal_label');
        this.summarryTax = page.locator('.summary_tax_label');
        this.summarryTotalAfterTax = page.locator('.summary_info_label.summary_total_label');
        
    }


    async checkOutOrder(firstname,lastname,postal,cancel = false){
            
        await this.checkoutButton.click();

        await this.firstName.click();
        await this.firstName.fill(firstname);

        await this.lastName.click();
        await this.lastName.fill(lastname);

        await this.postalCode.click();
        await this.postalCode.fill(postal);

        //console.log(await this.lastName.inputValue());
        // if pertama jika semua field kosong
        // if kedua jika field firstname dan lastname kosong
        // if ketika jika field firtsname dan postal code kosong
        // if ke empat jika field lastname dan postal code kosong
        // if ke lima jika hanya field firstname kosong
        // if ke enam jika hanya field lastname kosong
        // if ke tujuh jika hanya field postal code kosong
        // if ke delapan mengecek apabila postalCode bukan berupa number maka tmpilkan error

        if (await this.firstName.inputValue() == "" && await this.lastName.inputValue() == "" && await this.postalCode.inputValue() == ""){
            await this.continueButton.click();
            await expect(this.errorMsg).toHaveText("Error: First Name,Last Name and Postal Code are required");

        } else if (await this.firstName.inputValue() == "" && await this.lastName.inputValue() == ""){
            await this.continueButton.click();
            await expect(this.errorMsg).toHaveText("Error: First Name and Last Name are required");

        }else if (await this.firstName.inputValue() == "" && await this.postalCode.inputValue() == ""){
            await this.continueButton.click();
            await expect(this.errorMsg).toHaveText("Error: First Name and Postal Code are required");
            
        }else if (await this.lastName.inputValue() == "" && await this.postalCode.inputValue() == ""){
            await this.continueButton.click();
            await expect(this.errorMsg).toHaveText("Error: Last Name and Postal Code are required");

        }else if (await this.firstName.inputValue() == ""){
            await this.continueButton.click();
            await expect(this.errorMsg).toHaveText("Error: First Name is required");

        }else if (await this.lastName.inputValue() == ""){
            await this.continueButton.click();
            await expect(this.errorMsg).toHaveText("Error: Last Name is required");

        }else if (await this.postalCode.inputValue() == ""){
            await this.continueButton.click();
            await expect(this.errorMsg).toHaveText("Error: Postal Code is required");

        }else if (isNaN(await this.postalCode.inputValue())){
                await this.continueButton.click();
                await expect(this.errorMsg).toHaveText("Error: Invalid Input: Postal Code must be a number");   
        }else if (cancel == true){
            await this.cancelButton.click();
        }else{
            await this.continueButton.click();
        }

        if (this.checkout2_url_pattern.test(this.page.url())){ // utk test checkout order full | Mengecek patternnya(ekpresi reguler) sesuai dengan current url

            await expect(this.page).toHaveURL(this.checkout2_url_pattern);
            
            // console.log(this.getSelectedProdCart);
            // console.log(this.getSelectedPriceCart);

            let totalBeforeTax = 0;
            for (const itemPrc of this.getSelectedPriceCart){
                const price = Number(itemPrc.replace('$',''));

                totalBeforeTax += price;
            }

            //console.log(totalBeforeTax);
            const SumBeforeTax = await this.summarrySubTotal.textContent();
            const getOnlyNumberOfSum = Number(SumBeforeTax.replace("Item total: $",""));
            //console.log(Number(getOnlyNumberOfSum));
            
            const Tax = await this.summarryTax.textContent();
            const getOnlyNumberofTax = Number(Tax.replace("Tax: $",""));
            
            const SummaryTotal = getOnlyNumberOfSum + getOnlyNumberofTax;
            const SummaryTotalTxt = await this.summarryTotalAfterTax.textContent();
            const SummaryTotalnum = Number(SummaryTotalTxt.replace('Total: $',''));
            

            // console.log(SummaryTotal);
            // console.log(SummaryTotalnum);
            
            expect(SummaryTotal).toEqual(SummaryTotalnum);
            expect(totalBeforeTax).toEqual(getOnlyNumberOfSum);
        }
       
        
    }
    
    async finishOrder(cancel = false){
        if (cancel == true){
            await this.cancelButton.click()
        }else{
            
            await this.finishButton.click();
            await expect(this.page).toHaveURL(this.checkoutComplete_url_pattern);
        }
    }

}