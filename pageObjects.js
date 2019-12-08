const { Builder, By, Key, until } = require('selenium-webdriver');
class HomePage {
  constructor(driver) {
    this.driver = driver;
    profileBtn = By.className('_3odNv2Dw2n');
    profileTitle = By.className('_2I5v9t-gmG');
  }

  async getProfileBtnText() {
    let text = await this.driver.findElement(this.profileBtn).getText();
    return text;
  }

  async clickProfileButton() {
    await this.driver.findElement(this.profileBtn).click();
  }

  async getProfileName() {
    await clickProfileButton();
    let profileTitle = await this.driver.wait(
      until.elementLocated(this.profileTitle),
      5000,
      'Profile title not found'
    );
    await this.driver.wait(
      until.elementIsVisible(profileTitle),
      5000,
      'Profile title is not visible'
    );
    return await profileTitle.getText();
  }
}

class AuthPage {
  constructor(driver) {
    this.driver = driver;
    this.loginField = By.id('passp-field-login');
    this.submitLoginBtn = By.className('passp-sign-in-button');
    this.passField = By.id('passp-field-passwd');
    this.submitPasswordBtn = By.className('passp-form-button');
    this.errorMessageBlock = By.className('passp-form-field__error');
    this.loginPageBackBtn = By.className('passp-previous-step-button__icon');
  }

  async clickSubmitLoginBtn() {
    await driver.findElement(this.submitLoginBtn).click();
  }

  async clickSubmitPasswordBtn() {
    await driver.findElement(this.submitPasswordBtn).click();
  }
  async submitLoginWithUI(login) {
    let loginField = await this.driver.wait(
      until.elementLocated(this.loginField),
      5000,
      'Failed to locate login field in the DOM'
    );
    await driver.wait(
      until.elementIsVisible(loginField),
      5000,
      'Login field is not visible'
    );
    await loginField.clear();
    await loginField.sendKeys(login);
    clickSubmitLoginBtn();
  }

  async submitPasswordWithUI(password) {
    let passField = await driver.wait(
      until.elementLocated(this.passField),
      5000,
      'Failed to locate password field in the DOM'
    );
    await driver.wait(
      until.elementIsVisible(passField),
      5000,
      'Password field is not visible'
    );

    await passField.sendKeys(password);
    clickSubmitPasswordBtn();
  }

  async submitLoginWithKeyboard(login) {
    let loginField = await this.driver.wait(
      until.elementLocated(this.loginField),
      10000,
      'Failed to locate login field in the DOM'
    );
    await driver.wait(
      until.elementIsVisible(loginField),
      10000,
      'Login field is not visible'
    );
    await loginField.clear();
    await loginField.sendKeys(login, Key.RETURN);
  }

  async submitPasswordWithKeyboard(password) {
    let passField = await driver.wait(
      until.elementLocated(this.passField),
      5000,
      'Failed to locate password field in the DOM'
    );
    await driver.wait(
      until.elementIsVisible(passField),
      5000,
      'Password field is not visible'
    );

    await passField.sendKeys(password, Key.RETURN);
  }

  async clickLoginPageBackBtn() {
    await driver.findElement(this.loginPageBackBtn).click();
  }
  async getErrorMessageText() {
    let errorBlock = await this.driver.wait(
      until.elementLocated(this.errorMessageBlock),
      2000,
      'No error message in the DOM'
    );
    await driver.wait(
      until.elementIsVisible(errorBlock),
      2000,
      'Error message is not visible'
    );

    return await errorBlock.getText();
  }
}

module.exports = {
  HomePage,
  AuthPage,
};
