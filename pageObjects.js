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
    this.catalogueMenuBtnLocator = By.className('_301_b-LBxR');
    this.catalogueSectionLocator = sectionName => {
      return By.xpath(
        `//li//span[@class="_19FPGVzRi9" and text()="${sectionName}"]`
      );
    };
    this.catalogueSubsectionLocator = subsectionName => {
      return By.xpath(
        `//span[@class="_27Pcf7STDj" and text() = "${subsectionName}"]`
      );
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
        until.elementLocated(this.catalogueMenuBtnLocator),
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

  async locateCatalogueButton() {
    try {
      let catalogueBtn = await this.driver.wait(
        until.elementLocated(this.catalogueMenuBtnLocator),
        10000,
        'Back button is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(catalogueBtn),
        10000,
        'Back button is not visible'
      );
      return catalogueBtn;
    } catch (err) {
      throw err;
    }
  }

  async locateCatalogueSection(sectionName) {
    try {
      let catalogueSection = await this.driver.wait(
        until.elementLocated(this.catalogueSectionLocator(sectionName)),
        3000,
        'Catalogue section is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(catalogueSection),
        3000,
        'Catalogue section is not visible'
      );
      return catalogueSection;
    } catch (err) {
      throw err;
    }
  }

  async locateCatalogueSubsection(subsectionName) {
    try {
      let catalogueSubsection = await this.driver.wait(
        until.elementLocated(this.catalogueSubsectionLocator(subsectionName)),
        3000,
        'Catalogue subsection is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(catalogueSubsection),
        3000,
        'Catalogue subsection is not visible'
      );
      return catalogueSubsection;
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
    await this.driver.get('https://beru.ru/my/settings?track=menu');
  }

  async getProfileCityValue() {
    try {
      await this.goToSettings();
      let profileCity = await this.locateProfileCity();
      return await profileCity.getText();
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

  async getAllCitySuggestsList() {
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

  async openCatalogueItem(section, subsection) {
    try {
      let catalogueBtn = await this.locateCatalogueButton();
      await catalogueBtn.click();
      let selectedSection = await this.locateCatalogueSection(section);
      let listItemPos = await selectedSection.getRect();
      const actions = this.driver.actions({ bridge: true });
      await actions
        .move({
          x: 1,
          y: 1,
          duration: 500,
          origin: selectedSection,
        })
        .perform();
      let selectedSubsection = await this.locateCatalogueSubsection(subsection);
      await selectedSubsection.click();
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
        10000,
        'Failed to locate login field in the DOM'
      );
      await this.driver.wait(
        until.elementIsVisible(loginField),
        10000,
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
        10000,
        'Failed to locate submit login button in the DOM'
      );
      await this.driver.wait(
        until.elementIsVisible(submitLoginBtn),
        10000,
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
      await this.driver.sleep(500);
      let curUrl = await this.driver.getCurrentUrl();
      if (!curUrl.includes('https://beru.ru/')) {
        let errorText = await this.getErrorMessageText();
        throw errorText;
      }
    } catch (err) {
      throw err;
    }
  }

  async logOut() {
    await this.driver.get(
      'https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1'
    );
  }
}

class CataloguePage {
  constructor(driver) {
    this.driver = driver;
    this.itemContainerLocator = By.xpath(
      '//div[@class="_3rWYRsam78"]//div[@class="_1gDHxFdZ7E"]'
    );
    this.itemPriceLocator = By.xpath(
      '/div//*[@data-auto="price"]/span/span[1]'
    );
    this.priceFilterMinValueInputLoc = By.xpath(
      '//div[@data-auto="filter-range-glprice"]/span[@data-auto="filter-range-min"]//input'
    );
    this.priceFilterMaxValueInputLoc = By.xpath(
      '//div[@data-auto="filter-range-glprice"]/span[@data-auto="filter-range-max"]//input'
    );
    this.noItemsMessageLocator = By.xpath(
      '//div[@class="_2QyTfBZosp _26mXJDBxtH" and text() = "Нет подходящих товаров"]'
    );
    this.nextPageBtnLocator = By.xpath(
      '//div[@data-auto="pagination-next"]/span'
    );
    this.itemAddToCartBtnLocator = By.className('_2w0qPDYwej');
    this.cartButtonLocator = By.xpath(
      '//span[@class="_1LEwf9X1Gy" and text()="Корзина"]'
    );
  }

  async locateItems() {
    try {
      let items = await this.driver.wait(
        until.elementsLocated(this.itemContainerLocator),
        10000,
        'No catalogue items found'
      );
      await this.driver.wait(
        until.elementIsVisible(items[0]),
        5000,
        'Catalogue items are not visible'
      );
      return items;
    } catch (err) {
      throw err;
    }
  }

  async locatePriceFilterMinValueInput() {
    try {
      let priceFilterMinValueInput = await this.driver.wait(
        until.elementLocated(this.priceFilterMinValueInputLoc),
        10000,
        'Price filter min value input is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(priceFilterMinValueInput),
        5000,
        'Price filter min value input is not visible'
      );
      return priceFilterMinValueInput;
    } catch (err) {
      throw err;
    }
  }

  async locatePriceFilterMaxValueInput() {
    try {
      let priceFilterMaxValueInput = await this.driver.wait(
        until.elementLocated(this.priceFilterMaxValueInputLoc),
        10000,
        'Price filter max value input is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(priceFilterMaxValueInput),
        5000,
        'Price filter max value input is not visible'
      );
      return priceFilterMaxValueInput;
    } catch (err) {
      throw err;
    }
  }

  async locateNextPageButton() {
    try {
      await this.locateItems();
      let nextPageBtn = await this.driver.findElements(this.nextPageBtnLocator);
      return nextPageBtn;
    } catch (err) {
      throw err;
    }
  }

  async locateNoItemsMessage() {
    try {
      let noItemsMessage = await this.driver.wait(
        until.elementLocated(this.noItemsMessageLocator),
        10000,
        '"No items" message is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(noItemsMessage),
        5000,
        '"No items" message is not visible'
      );
      return noItemsMessage;
    } catch (err) {
      throw err;
    }
  }

  async locateCartButton() {
    try {
      let cartButton = await this.driver.wait(
        until.elementLocated(this.cartButtonLocator),
        10000,
        'Cart button is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(cartButton),
        5000,
        'PCart button is not visible'
      );
      return cartButton;
    } catch (err) {
      throw err;
    }
  }

  async setPriceFilterMinValue(amount) {
    try {
      let oldItems = await this.locateItems();
      let priceMinFilter = await this.locatePriceFilterMinValueInput();
      await priceMinFilter.clear().sendKeys(amount);
      await this.driver.wait(
        until.stalenessOf(oldItems[0]),
        10000,
        'Failed to refresh items list'
      );
    } catch (err) {
      throw err;
    }
  }

  async setPriceFilterMaxValue(amount) {
    try {
      let oldItems = await this.locateItems();
      let priceMaxFilter = await this.locatePriceFilterMaxValueInput();
      await priceMaxFilter.clear().sendKeys(amount);
      await this.driver.wait(
        until.stalenessOf(oldItems[0]),
        10000,
        'Failed to refresh items list'
      );
    } catch (err) {
      throw err;
    }
  }

  async getItemPrice(item) {
    try {
      let priceText = await item.findElement(itemPriceLocator).getText();
      let price = Number(priceText.replace(/[^\d]/g, ''));
      return price;
    } catch (err) {
      throw err;
    }
  }

  async goToNextPage(nextBtn) {
    try {
      let oldItems = await this.locateItems();
      await nextBtn.click();
      await this.driver.wait(
        until.stalenessOf(oldItems[0]),
        10000,
        'The items of the previous page remain visible'
      );
    } catch (err) {
      throw err;
    }
  }

  async addItemToCart(item) {
    try {
      await item.findElement(this.itemAddToCartBtnLocator).click();
      await this.driver.wait(
        async function() {
          let btnText;
          try {
            btnText = await item
              .findElement(this.itemAddToCartBtnLocator)
              .getText();
          } catch {
            return false;
          }
          return btnText == 'В корзине';
        },
        10000,
        "The Add to cart button state wasn't changed"
      );
      await this.driver.sleep(2000);
    } catch (err) {
      throw err;
    }
  }

  async goToCart() {
    try {
      let cartButton = await this.locateCartButton();
      await cartButton.click();
    } catch (err) {
      throw err;
    }
  }
}

class CartPage {
  constructor(driver) {
    this.driver = driver;
    this.freeDeliveryRemainderLocator = By.className('voCFmXKfcL');
    this.checkoutButtonLocator = By.xpath(
      '//span[@class="_2w0qPDYwej" and text()="Перейти к оформлению"]'
    );
  }

  async locateFreeDeliveryRemainder() {
    try {
      let remainder = await this.driver.wait(
        until.elementLocated(this.freeDeliveryRemainderLocator),
        10000,
        'Free delivery remainder is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(remainder),
        5000,
        'Free delivery remainder is not visible'
      );
      return remainder;
    } catch (err) {
      throw err;
    }
  }

  async locateCheckoutButton() {
    try {
      let checkoutBtn = await this.driver.wait(
        until.elementLocated(this.checkoutButtonLocator),
        10000,
        'Checkout button is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(checkoutButtonLocator),
        5000,
        'Checkout button is not visible'
      );
      return checkoutBtn;
    } catch (err) {
      throw err;
    }
  }

  async getFreeDeliveryRemainderValue() {
    try {
      let remainder = await this.locateFreeDeliveryRemainder();
      let remainderText = await remainder.getText();
      return Number(remainderText.replace(/[^\d]/g, ''));
    } catch (err) {
      throw err;
    }
  }

  async clickCheckoutButton() {
    try {
      let checkoutBtn = await this.locateCheckoutButton();
      await checkoutBtn.click();
    } catch (err) {
      throw err;
    }
  }
}

class CheckoutPage {
  constructor(driver) {
    this.driver = driver;
    this.deliveryOptionLocator = By.xpath(
      '//*[@class="s5wsZMKoea" and @data-auto="DELIVERY"]'
    );
    this.selectedOptionCostLocator = By.xpath(
      '//label[@class="_32Rl_SqO9- checked"]//div[@class="_1IG4X84z4y"]/span[2]'
    );
    this.totalCostLocator = By.className('_1oBlNqVHPq');
  }

  async locateDeliveryOption() {
    try {
      let option = await this.driver.wait(
        until.elementLocated(deliveryOptionLocator),
        10000,
        'The delivery option is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(option),
        5000,
        'Delivery option is not visible'
      );
      return option;
    } catch (err) {
      throw err;
    }
  }

  async locateTotalCost() {
    try {
      let total = await this.driver.wait(
        until.elementLocated(totalCostLocator),
        10000,
        'Total cost is not found'
      );
      await this.driver.wait(
        until.elementIsVisible(total),
        5000,
        'Total cost is not visible'
      );
      return total;
    } catch (err) {
      throw err;
    }
  }

  async clickDeliveryOption() {
    try {
      let option = await this.locateDeliveryOption();
      await option.click();
    } catch (err) {
      throw err;
    }
  }

  async getDeliveryOptionCost() {
    try {
      let deliveryCostText = await this.driver
        .findElement(selectedOptionCostLocator)
        .getText();
      return Number(deliveryCostText.replace(/[^\d]/g, ''));
    } catch (err) {
      throw err;
    }
  }

  async getTotalCostValue() {
    try {
      let totalCost = await this.locateTotalCost();
      return Number(totalCost.replace(/[^\d]/g, ''));
    } catch (err) {
      throw err;
    }
  }
}

module.exports = {
  HomePage,
  AuthPage,
  CataloguePage,
  CartPage,
  CheckoutPage,
};
