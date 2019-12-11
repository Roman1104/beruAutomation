const { Builder, By, Key, until } = require('selenium-webdriver');
class HomePage {
  constructor(driver) {
    this.driver = driver;
    this.profileBtnLocator = By.className('_3odNv2Dw2n');
    this.profileTitleLocator = By.className('_2I5v9t-gmG');
    this.deliveryCityLocator = By.xpath(
      '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
    );
    this.cityInputLocator = By.xpath(
      '//div[@class="_1U2ErCeoqP"]//input[@class="_2JDvXzYsUI"]'
    );
    this.citySuggestLocator = cityName => {
      return By.xpath(`//div[@class="_229JDbp_Z8" and text()="${cityName}"]`);
    };
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

  async locateDeliveryCity() {
    try {
      let deliveryCity = await this.driver.wait(
        until.elementLocated(this.deliveryCityLocator),
        10000,
        'Delivery city is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(deliveryCity),
        10000,
        'Delivery city is not visible'
      );
      return deliveryCity;
    } catch (err) {
      throw err;
    }
  }

  async locateCityInput() {
    try {
      let deliveryCityInput = await this.driver.wait(
        until.elementLocated(this.cityInputLocator),
        10000,
        'Delivery city input is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(deliveryCityInput),
        10000,
        'Delivery city input is not visible'
      );
      return deliveryCityInput;
    } catch (err) {
      throw err;
    }
  }

  async getProfileBtnText() {
    try {
      let profileBtn = await this.locateProfileBtn();
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

  async getDeliveryCityName() {
    try {
      let deliveryCity = await this.locateDeliveryCity();
      return await deliveryCity.getText();
    } catch (err) {
      throw err;
    }
  }

  async clickDeliveryCity() {
    try {
      let deliveryCity = await this.locateDeliveryCity();
      await deliveryCity.click();
    } catch (err) {
      throw err;
    }
  }

  async enterNewDeliveryCity(cityName) {
    await this.clickDeliveryCity();
    let cityInput = await this.locateCityInput();
    await cityInput.sendKeys(Key.CONTROL, 'a', Key.NULL, Key.BACK_SPACE);
    for (let i = 0; i < cityName.length; i++) {
      await cityInput.sendKeys(cityName[i]);
      await this.driver.sleep(30);
    }
    await this.driver.sleep(200);
  }

  async getAllSuggestsList() {
    return await this.driver.findElements(By.className('_229JDbp_Z8'));
  }

  async changeDeliveryCity(cityName) {
    await this.enterNewDeliveryCity(cityName);
    //capitalize city argument for searching suggests
    let city =
      cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
    let citySuggest = await this.driver.wait(
      until.elementLocated(this.citySuggestLocator(city)),
      10000,
      'City suggest is not found'
    );
    await this.driver.wait(
      until.elementIsVisible(citySuggest),
      10000,
      'City suggest is not visible'
    );
    await citySuggest.click();
    let okBtn = await this.driver.wait(
      until.elementLocated(
        By.xpath('//span[@class="_2w0qPDYwej" and text()="Хорошо"]')
      ),
      4000,
      'OK button is not found'
    );
    await this.driver.wait(
      until.elementIsVisible(okBtn),
      4000,
      'OK button is not visible'
    );
    await okBtn.click();
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
        'Failed to locate submit login button in the DOM'
      );
      await this.driver.wait(
        until.elementIsVisible(submitLoginBtn),
        5000,
        'Submit login button is not visible'
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
        'Failed to locate submit password button in the DOM'
      );
      await this.driver.wait(
        until.elementIsVisible(submitPasswordBtn),
        5000,
        'submit password button is not visible'
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
