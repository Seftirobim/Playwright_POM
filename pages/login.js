// Gunakan exports agar bisa digunakan di luar file
exports.LoginPage = class LoginPage {

    // Sebagai inisialisasi
    constructor(page){

        this.page = page
        this.username_tb = page.locator('[data-test="username"]');
        this.password_tb = page.locator('[data-test="password"]');
        this.loginButton_tb = page.locator('[data-test="login-button"]');

    }

    async gotToLP(){
        await this.page.goto('https://saucedemo.com');
    }

    async login(username , password){
        await this.username_tb.click();
        await this.username_tb.fill(username);
        await this.password_tb.click();
        await this.password_tb.fill(password);
        await this.loginButton_tb.click();
    }
    
}