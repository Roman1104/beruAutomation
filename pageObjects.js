const { Builder, By, Key, until } = require('selenium-webdriver');
class HomePage {
  constructor(driver) {
    this.driver = driver;
    this.profileBtnLocator = By.className('_3odNv2Dw2n');
    this.profileTitleLocator = By.className('_2I5v9t-gmG');
    this.profileCityLocator = By.xpath(
      '//div[@id="region"]//span[contains(@class,"_3ioN70chUh")]/span[contains(@class,"_3l-uEDOaBN")]'
    );
    this.deliveryCityLocator = By.xpath(
      '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
    );
    this.cityInputLocator = By.xpath(
      '//div[@class="_1U2ErCeoqP"]//input[@class="_2JDvXzYsUI"]'
    );
    this.citySuggestLocator = cityName => {
      return By.xpath(`//div[@class="_229JDbp_Z8" and text()="${cityName}"]`);
    };
    this.confirmCityChangeBtnLocator = By.xpath(
      '//span[@class="_2w0qPDYwej" and text()="Хорошо"]'
    );
    this.cityChangeBackBtnLocator = By.xpath(
      '//span[@class="_2w0qPDYwej" and text()="Назад"]'
    );
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

  async locateProfileCity() {
    try {
      let profileCity = await this.driver.wait(
        until.elementLocated(this.profileCityLocator),
        10000,
        'Profile (settings) city is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(profileCity),
        10000,
        'Profile city is not visible'
      );
      return profileCity;
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
        3000,
        'Delivery city input is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(deliveryCityInput),
        3000,
        'Delivery city input is not visible'
      );
      return deliveryCityInput;
    } catch (err) {
      throw err;
    }
  }

  async locateConfirmCityChangeBtn() {
    try {
      let okBtn = await this.driver.wait(
        until.elementLocated(this.confirmCityChangeBtnLocator),
        3000,
        'OK button is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(okBtn),
        3000,
        'OK button is not visible'
      );
      return okBtn;
    } catch (err) {
      throw err;
    }
  }

  async locateCityChangeBackBtn() {
    try {
      let backBtn = await this.driver.wait(
        until.elementLocated(this.cityChangeBackBtnLocator),
        3000,
        'Back button is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(backBtn),
        3000,
        'Back button is not visible'
      );
      return backBtn;
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

  async goToSettings() {
    try {
      await this.driver.get('https://beru.ru/my/settings?track=menu');
    } catch (err) {
      throw err;
    }
  }

  async getProfileCityValue() {
    await this.goToSettings();
    let profileCity = await this.locateProfileCity();
    return await profileCity.getText();
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
    try {
      let cityInput = await this.locateCityInput();
      await cityInput.sendKeys(Key.CONTROL, 'a', Key.NULL, Key.BACK_SPACE);
      for (let i = 0; i < cityName.length; i++) {
        await cityInput.sendKeys(cityName[i]);
        await this.driver.sleep(30);
      }
      await this.driver.sleep(200);
    } catch (err) {
      throw err;
    }
  }

  async getAllSuggestsList() {
    try {
      return await this.driver.findElements(By.className('_229JDbp_Z8'));
    } catch (err) {
      throw err;
    }
  }

  async enterCityAndClickSuggest(cityName) {
    try {
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
    } catch (err) {
      throw err;
    }
  }

  async changeDeliveryCity(cityName) {
    try {
      await this.clickDeliveryCity();
      await this.enterCityAndClickSuggest(cityName);
      await this.clickConfirmCityChangeBtn();
    } catch (err) {
      throw err;
    }
  }

  async getCityInputValue() {
    try {
      let inputField = await this.locateCityInput();
      return await inputField.getAttribute('value');
    } catch (err) {
      throw err;
    }
  }

  async clickEraseCityInput() {
    try {
      let inputContainer = await this.driver.wait(
        until.elementLocated(By.className('_8iW7gwBP58')),
        10000,
        'City input container not found'
      );
      await this.driver.wait(
        until.elementIsVisible(inputContainer),
        10000,
        'City input container is not visible'
      );
      await inputContainer.click();
      let cssWidth = await inputContainer.getCssValue('width');
      let containerWidth = cssWidth.match(/\d+/)[0];
      const actions = this.driver.actions({ bridge: true });
      await actions
        .move({
          x: Math.floor(containerWidth / 2 - 22),
          y: 0,
          duration: 500,
          origin: inputContainer,
        })
        .click()
        .perform();
    } catch (err) {
      throw err;
    }
  }

  async clickConfirmCityChangeBtn() {
    try {
      let okBtn = await this.locateConfirmCityChangeBtn();
      await okBtn.click();
      await this.driver.sleep(300);
    } catch (err) {
      throw err;
    }
  }

  async clickCityChangeBackBtn() {
    try {
      let backBtn = await this.locateCityChangeBackBtn();
      await backBtn.click();
    } catch (err) {
      throw err;
    }
  }

  async closePopupWindow() {
    try {
      await this.driver.actions().sendKeys(Key.ESCAPE);
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

  async authentificateUser(login, password) {
    try {
      await this.submitLoginWithKeyboard(login);
      await this.submitPasswordWithKeyboard(password);
      let curUrl = await this.driver.getCurrentUrl();
      if (!curUrl.includes('https://beru.ru/')) {
        let errorText = await this.getErrorMessageText();
        throw errorText;
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = {
  HomePage,
  AuthPage,
};
