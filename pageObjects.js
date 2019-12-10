const { Builder, By, Key, until } = require('selenium-webdriver');
class HomePage {
  constructor(driver) {
    this.driver = driver;
    this.profileBtnLocator = By.className('_3odNv2Dw2n');
    this.profileTitleLocator = By.className('_2I5v9t-gmG');
  }

  async locateProfileBtn() {
    try {
      let profileBtn = await this.driver.wait(
        until.elementLocated(this.profileBtnLocator),
        10000,
        'Profile button is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(profileBtn),
        10000,
        'Profile button is not visible'
      );
      return profileBtn;
    } catch (err) {
      throw err;
    }
  }
  async getProfileBtnText() {
    try {
      let profileBtn = await this.locateProfileBtn();
      console.log(profileBtn);
      return await profileBtn.getText();
    } catch (err) {
      throw err;
    }
  }

  async clickProfileButton() {
    try {
      let profileBtn = await this.locateProfileBtn();
      await profileBtn.click();
    } catch (err) {
      throw err;
    }
  }

  async getProfileName() {
    try {
      await this.clickProfileButton();
      let profileTitle = await this.driver.wait(
        until.elementLocated(this.profileTitleLocator),
        5000,
        'Profile title not found'
      );
      await this.driver.wait(
        until.elementIsVisible(profileTitle),
        5000,
        'Profile title is not visible'
      );
      return await profileTitle.getText();
    } catch (err) {
      throw err;
    }
  }
}

class AuthPage {
  constructor(driver) {
    this.driver = driver;
    this.loginFieldLocator = By.id('passp-field-login');
    this.submitLoginBtnLocator = By.className('passp-sign-in-button');
    this.passFieldLocator = By.id('passp-field-passwd');
    this.submitPasswordBtnLocator = By.className('passp-form-button');
    this.errorMessageBlockLocator = By.className('passp-form-field__error');
    this.loginPageBackBtnLocator = By.className(
      'passp-previous-step-button__icon'
    );
  }
  async locateLoginField() {
    try {
      let loginField = await this.driver.wait(
        until.elementLocated(this.loginFieldLocator),
        5000,
        'Failed to locate login field in the DOM'
      );
      await this.driver.wait(
        until.elementIsVisible(loginField),
        5000,
        'Login field is not visible'
      );
      return loginField;
    } catch (err) {
      throw err;
    }
  }

  async locatePasswordField() {
    try {
      let passField = await this.driver.wait(
        until.elementLocated(this.passFieldLocator),
        5000,
        'Failed to locate password field in the DOM'
      );
      await this.driver.wait(
        until.elementIsVisible(passField),
        5000,
        'Password field is not visible'
      );
      return passField;
    } catch (err) {
      throw err;
    }
  }

  async locateSubmitLoginBtn() {
    try {
      let submitLoginBtn = await this.driver.wait(
        until.elementLocated(this.submitLoginBtnLocator),
        5000,
        'Failed to locate login field in the DOM'
      );
      await this.driver.wait(
        until.elementIsVisible(submitLoginBtn),
        5000,
        'Login field is not visible'
      );
      return submitLoginBtn;
    } catch (err) {
      throw err;
    }
  }

  async locateSubmitPasswordBtn() {
    try {
      let submitPasswordBtn = await this.driver.wait(
        until.elementLocated(this.submitPasswordBtnLocator),
        5000,
        'Failed to locate login field in the DOM'
      );
      await this.driver.wait(
        until.elementIsVisible(submitPasswordBtn),
        5000,
        'Login field is not visible'
      );
      return submitPasswordBtn;
    } catch (err) {
      throw err;
    }
  }

  async clickSubmitLoginBtn() {
    try {
      let loginBtn = await this.locateSubmitLoginBtn();
      await loginBtn.click();
    } catch (err) {
      throw err;
    }
  }

  async clickSubmitPasswordBtn() {
    try {
      let passwordBtn = await this.locateSubmitPasswordBtn();
      await passwordBtn.click();
    } catch (err) {
      throw err;
    }
  }

  async submitLoginWithUI(login) {
    try {
      let loginField = await this.locateLoginField();
      await loginField.clear();
      await loginField.sendKeys(login);
      await this.clickSubmitLoginBtn();
    } catch (err) {
      throw err;
    }
  }

  async submitPasswordWithUI(password) {
    try {
      let passField = await this.locatePasswordField();
      await passField.sendKeys(password);
      await this.clickSubmitPasswordBtn();
    } catch (err) {
      throw err;
    }
  }

  async submitLoginWithKeyboard(login) {
    try {
      let loginField = await this.locateLoginField();
      await loginField.clear();
      await loginField.sendKeys(login, Key.RETURN);
    } catch (err) {
      throw err;
    }
  }

  async submitPasswordWithKeyboard(password) {
    try {
      let passField = await this.locatePasswordField();
      await passField.sendKeys(password, Key.RETURN);
    } catch (err) {
      throw err;
    }
  }

  async clickLoginPageBackBtn() {
    try {
      let backBtn = await this.driver.wait(
        until.elementLocated(this.loginPageBackBtnLocator),
        10000,
        'Login page back button is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(backBtn),
        10000,
        'Login page back button is not visible'
      );
      await backBtn.click();
    } catch (err) {
      throw err;
    }
  }

  async getErrorMessageText() {
    try {
      let errorBlock = await this.driver.wait(
        until.elementLocated(this.errorMessageBlockLocator),
        2000,
        'No error message in the DOM'
      );
      await this.driver.wait(
        until.elementIsVisible(errorBlock),
        2000,
        'Error message is not visible'
      );

      return await errorBlock.getText();
    } catch (err) {
      throw err;
    }
  }
}

module.exports = {
  HomePage,
  AuthPage,
};
