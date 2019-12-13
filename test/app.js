const { Builder, By, Key, until } = require('selenium-webdriver');
const {
  HomePage,
  AuthPage,
  CataloguePage,
  CartPage,
  CheckoutPage,
} = require('../pageObjects');
const mocha = require('mocha');
const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;

/* describe('Beru.ru authorization flow', function() {
  this.timeout(0); //отключаем таймауты (2 секунды) для тестов
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    await driver
      .manage()
      .window()
      .maximize();
  });

  after(async function() {
    await driver.close();
  });

  it('Check the page opens successfully.', async function() {
    try {
      await driver.get('https://beru.ru/');
      let title = await driver.getTitle();
      title.should.contain('Беру', "The page title doesn't match the expected");
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }
  });

  it('Check login button name is "Войти в аккаунт" for unauthentificated user', async function() {
    try {
      await driver.get('https://beru.ru/');
      let homePage = new HomePage(driver);
      //profileBtn = await driver.findElement(By.className('_3odNv2Dw2n'));
      let btnText = await homePage.getProfileBtnText();
      btnText.should.equal('Войти в аккаунт', "Button title doesn't match:");
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }
  });

  it('Check the "Войти в аккаунт" button leads to authentification page', async function() {
    try {
      await driver.get('https://beru.ru/');
      let homePage = new HomePage(driver);
      await homePage.clickProfileButton();
      //await driver.findElement(By.className('_3odNv2Dw2n')).click();
      let curUrl = await driver.getCurrentUrl();
      curUrl.should.contain(
        'passport.yandex.ru',
        'Failed to redirect to passport.yandex.ru'
      );
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get('https://beru.ru/');
  });

  it('Authentificate user via UI elements', async function() {
    try {
      await driver.get(
        'https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255'
      );
      let authPage = new AuthPage(driver);
      await authPage.submitLoginWithUI('testmalakhov2019@yandex.ru');
      await authPage.submitPasswordWithUI('38tnrWW!QiNRqJv');
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    try {
      let curUrl = await driver.getCurrentUrl();
      curUrl.should.contain('beru.ru', 'Failed to redirect back to the site');
      let homePage = new HomePage(driver);
      let btnText = await homePage.getProfileBtnText();
      btnText.should.equal('Мой профиль', "Button title doesn't match:");

      let profileName = await homePage.getProfileName();
      profileName.should.equal(
        'Automation Test Malakhov 2019',
        "Profile name doesn't match:"
      );
    } catch (err) {
      await driver.get(
        'https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1'
      );
      await driver.get('https://passport.yandex.ru/');
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get(
      'https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1'
    );
    await driver.get('https://passport.yandex.ru/');
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
  });

  it('Authentificate user via keyboard', async function() {
    try {
      await driver.get(
        'https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255'
      );
      let authPage = new AuthPage(driver);
      await authPage.submitLoginWithKeyboard('testmalakhov2019@yandex.ru');
      await authPage.submitPasswordWithKeyboard('38tnrWW!QiNRqJv');
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    try {
      let curUrl = await driver.getCurrentUrl();
      curUrl.should.contain('beru.ru', 'Failed to redirect back to the site');
      let homePage = new HomePage(driver);
      let btnText = await homePage.getProfileBtnText();
      btnText.should.equal('Мой профиль', "Button title doesn't match:");

      let profileName = await homePage.getProfileName();
      profileName.should.equal(
        'Automation Test Malakhov 2019',
        "Profile name doesn't match:"
      );
    } catch (err) {
      await driver.get(
        'https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1'
      );
      await driver.get('https://passport.yandex.ru/');
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get(
      'https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1'
    );
    await driver.get('https://passport.yandex.ru/');
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
  });

  it('Check the error returns when unexisting login is submitted', async function() {
    try {
      await driver.get(
        'https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255'
      );
      let authPage = new AuthPage(driver);

      await authPage.submitLoginWithKeyboard('bkcglkhlcvb');

      let errorText = await authPage.getErrorMessageText();
      errorText.should.equal(
        'Такого аккаунта нет',
        'Incorrect error message text'
      );
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get('https://beru.ru/');
  });

  it('Check the error returns when incorrect login is submitted', async function() {
    try {
      await driver.get(
        'https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255'
      );
      let authPage = new AuthPage(driver);

      await authPage.submitLoginWithKeyboard('1111');

      let errorText = await authPage.getErrorMessageText();
      errorText.should.equal(
        'Такой логин не подойдет',
        'Incorrect error message text'
      );
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get('https://beru.ru/');
  });

  it('Check the error returns when no login is submitted', async function() {
    try {
      await driver.get(
        'https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255'
      );
      let authPage = new AuthPage(driver);

      await authPage.clickSubmitLoginBtn();

      let errorText = await authPage.getErrorMessageText();
      errorText.should.equal('Логин не указан', 'Incorrect error message text');
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get('https://beru.ru/');
  });

  it('Check the back button on auth page stops the flow and returns to site', async function() {
    try {
      await driver.get(
        'https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255'
      );
      let authPage = new AuthPage(driver);
      await authPage.clickLoginPageBackBtn;
      let curUrl = await driver.getCurrentUrl();
      curUrl.should.contain(
        'beru.ru',
        'Failed to redirect to passport.yandex.ru'
      );

      let homePage = new HomePage(driver);
      let btnText = homePage.getProfileBtnText();
      btnText.should.equal('Войти в аккаунт', "Button title doesn't match:");
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }
  });

  it('Check the error returns when incorreсt password is submitted', async function() {
    try {
      await driver.get(
        'https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255'
      );
      let authPage = new AuthPage(driver);

      await authPage.submitLoginWithKeyboard('testmalakhov2019@yandex.ru');
      await authPage.submitPasswordWithKeyboard('38tnrWW');
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    try {
      let curUrl = await driver.getCurrentUrl();
      curUrl.should.contain(
        'passport.yandex.ru',
        'Unexpected redirect occured'
      );
      let authPage = new AuthPage(driver);
      let errorText = await authPage.getErrorMessageText();
      errorText.should.equal('Неверный пароль', 'Incorrect error message text');
    } catch (err) {
      await driver.get(
        'https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1'
      );
      await driver.get('https://passport.yandex.ru/');
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
  });

  it('Check the error returns when no password is submitted', async function() {
    try {
      await driver.get(
        'https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255'
      );
      let authPage = new AuthPage(driver);

      await authPage.submitLoginWithKeyboard('testmalakhov2019@yandex.ru');
      await authPage.clickSubmitPasswordBtn();
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    try {
      let curUrl = await driver.getCurrentUrl();
      curUrl.should.contain(
        'passport.yandex.ru',
        'Unexpected redirect occured'
      );
      let authPage = new AuthPage(driver);
      let errorText = await authPage.getErrorMessageText();
      errorText.should.equal(
        'Пароль не указан',
        'Incorrect error message text'
      );
    } catch (err) {
      await driver.get(
        'https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1'
      );
      await driver.get('https://passport.yandex.ru/');
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
  });
}); */

/* describe('City selection flow', function() {
  this.timeout(0); //отключаем таймауты (2 секунды) для тестов
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    await driver
      .manage()
      .window()
      .maximize();
  });

  after(async function() {
    await driver.close();
  });

  it('Check the city input field appears', async function() {
    try {
      await driver.get('https://beru.ru/');
      let homePage = new HomePage(driver);
      await homePage.clickDeliveryCity();

      let cityInput = await homePage.locateCityInput();
      let isVisible = await cityInput.isDisplayed();
      let isEditable = await cityInput.isEnabled();
      isVisible.should.equal(true, 'The city input field is invisible');
      isEditable.should.equal(true, "The city input field can't be edited");
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get('https://beru.ru/');
  });

  it('Check the city is changed when user clicks the suggested option', async function() {
    try {
      await driver.get('https://beru.ru/');
      let homePage = new HomePage(driver);
      await homePage.changeDeliveryCity('хвалынск');
      let cityName = await homePage.getDeliveryCityName();
      cityName.should.equal(
        'Хвалынск',
        'The delivery city was changed incorrectly'
      );
    } catch (err) {
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
  });

  it('Check there are no suggests when incorrect city is entered', async function() {
    try {
      await driver.get('https://beru.ru/');
      let homePage = new HomePage(driver);
      await homePage.clickDeliveryCity();
      await homePage.enterNewDeliveryCity('йцкуе');
      let suggests = await homePage.getAllCitySuggestsList();
      suggests.length.should.equal(0, 'Unexpected suggests are displayed');
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get('https://beru.ru/');
  });

  it('Check "Delete" button erases input field', async function() {
    try {
      await driver.get('https://beru.ru/');
      let homePage = new HomePage(driver);
      await homePage.clickDeliveryCity();
      await homePage.enterNewDeliveryCity('тест');
      await homePage.clickEraseCityInput();
      let fieldValue = await homePage.getCityInputValue();
      fieldValue.should.equal('', 'The input field is not cleared');
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get('https://beru.ru/');
  });

  it('Check the delivery city persists after refreshing', async function() {
    try {
      await driver.get('https://beru.ru/');
      let homePage = new HomePage(driver);
      await homePage.changeDeliveryCity('хвалынск');
      await driver.get('https://beru.ru/');
      let cityName = await homePage.getDeliveryCityName();
      cityName.should.equal('Хвалынск', 'The delivery city has been reset');
    } catch (err) {
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
  });

  it('Check the city changed correctly when "Назад" was pressed', async function() {
    try {
      await driver.get('https://beru.ru/');
      let homePage = new HomePage(driver);
      await homePage.clickDeliveryCity();
      await homePage.enterCityAndClickSuggest('хвалынск');
      await homePage.clickCityChangeBackBtn();
      await homePage.enterCityAndClickSuggest('энгельс');
      await homePage.clickConfirmCityChangeBtn();
      let cityName = await homePage.getDeliveryCityName();
      console.log(cityName);
      cityName.should.equal('Энгельс', 'The delivery city has been reset');
    } catch (err) {
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
  });

  it('Check the city is not changed if the flow was interrupted', async function() {
    try {
      await driver.get('https://beru.ru/');
      let homePage = new HomePage(driver);
      let prevCity = await homePage.getDeliveryCityName();
      await homePage.clickDeliveryCity();
      await homePage.enterCityAndClickSuggest('хвалынск');
      await homePage.closePopupWindow();
      let cityName = await homePage.getDeliveryCityName();
      cityName.should.equal(
        prevCity,
        'The city has been changed despite cancellation'
      );
    } catch (err) {
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
  });

  it('Check the delivery city is correct after authentification', async function() {
    try {
      await driver.get('https://beru.ru/');
      let homePage = new HomePage(driver);
      await homePage.changeDeliveryCity('хвалынск');

      //Authentification flow
      await homePage.clickProfileButton();
      let authPage = new AuthPage(driver);
      await authPage.authentificateUser(
        'testmalakhov2019@yandex.ru',
        '38tnrWW!QiNRqJv'
      );
      await homePage.goToSettings();

      //Validate city
      let profileCity = await homePage.getProfileCityValue();
      let cityName = await homePage.getDeliveryCityName();
      profileCity.should.equal(
        cityName,
        "Profile and selected city don't match"
      );
    } catch (err) {
      await driver.get(
        'https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1'
      );
      await driver.get('https://passport.yandex.ru/');
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get(
      'https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1'
    );
    await driver.get('https://passport.yandex.ru/');
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
  });

  it('Check the city change persists when user interrupts authentification', async function() {
    try {
      await driver.get('https://beru.ru/');
      let homePage = new HomePage(driver);
      await homePage.changeDeliveryCity('хвалынск');
      await homePage.clickProfileButton();
      let authPage = new AuthPage(driver);
      await authPage.locateLoginField();
      await authPage.clickLoginPageBackBtn();

      //Validate city
      let cityName = await homePage.getDeliveryCityName();
      cityName.should.equal('Хвалынск', 'The city changing has been lost');
    } catch (err) {
      await driver.get('https://beru.ru/');
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
  });

  it('Check the city persists after reloading the site', async function() {
    try {
      await driver.get('https://beru.ru/');
      let homePage = new HomePage(driver);
      await homePage.changeDeliveryCity('хвалынск');

      //Authentification flow
      await homePage.clickProfileButton();
      let authPage = new AuthPage(driver);
      await authPage.authentificateUser(
        'testmalakhov2019@yandex.ru',
        '38tnrWW!QiNRqJv'
      );
      await homePage.locateProfileBtn();
      await driver.get('https://beru.ru/');

      //Validate city
      let cityName = await homePage.getDeliveryCityName();
      cityName.should.equal(
        'Хвалынск',
        "Profile and selected city don't match"
      );
    } catch (err) {
      await driver.get(
        'https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1'
      );
      await driver.get('https://passport.yandex.ru/');
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get(
      'https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1'
    );
    await driver.get('https://passport.yandex.ru/');
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
  });

  it('Check the city persists when user logs out', async function() {
    try {
      await driver.get('https://beru.ru/');
      let homePage = new HomePage(driver);
      await homePage.changeDeliveryCity('хвалынск');

      //Authentification flow
      await homePage.clickProfileButton();
      let authPage = new AuthPage(driver);
      await authPage.authentificateUser(
        'testmalakhov2019@yandex.ru',
        '38tnrWW!QiNRqJv'
      );
      await homePage.locateProfileBtn();
      await homePage.logOut();

      //Validate city
      let cityName = await homePage.getDeliveryCityName();
      cityName.should.equal(
        'Хвалынск',
        "Profile and selected city don't match"
      );
    } catch (err) {
      await driver.get(
        'https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1'
      );
      await driver.get('https://passport.yandex.ru/');
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.manage().deleteAllCookies();
    await driver.get('https://passport.yandex.ru/');
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
  });
}); */

describe('Order management flow', function() {
  this.timeout(0); //отключаем таймауты (2 секунды) для тестов
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    await driver
      .manage()
      .window()
      .maximize();
  });

  after(async function() {
    //await driver.close();
  });

  it('Check the electric toothbrushes section contains items', async function() {
    try {
      await driver.get('https://beru.ru/');
      let homePage = new HomePage(driver);
      await homePage.openCatalogueItem(
        'Красота и гигиена',
        'Электрические зубные щетки'
      );
      /* let items = await driver.findElements(
        By.xpath('//div[@class="_3rWYRsam78"]//div[@class="_1gDHxFdZ7E"]')
      );
      items.length.should.be.above(0, 'There is no items on the page'); */
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get('https://beru.ru/');
  });

  /* it('Check the price range filter works properly', async function() {
    await driver.get(
      'https://beru.ru/catalog/elektricheskie-zubnye-shchetki/80961/list?hid=278374&track=pieces'
    );

    try {
      //fill the filter values and wait till filtered items load
      let oldItem = await driver.findElement(
        By.xpath('//*[@data-auto="price"]/span/span[1]')
      );
      await driver
        .findElement(
          By.xpath(
            '//div[@data-auto="filter-range-glprice"]/span[@data-auto="filter-range-min"]//input'
          )
        )
        .sendKeys('999');

      await driver
        .findElement(
          By.xpath(
            '//div[@data-auto="filter-range-glprice"]/span[@data-auto="filter-range-max"]//input'
          )
        )
        .sendKeys('1999');

      await driver.wait(
        until.stalenessOf(oldItem),
        10000,
        'Failed to refresh items list'
      );

      let items = await driver.wait(
        until.elementsLocated(By.xpath('//*[@data-auto="price"]/span/span[1]')),
        4000,
        'New items are not located'
      );
      let nextBtn;
      //loop through all items and check the filter is applied
      if (items.length > 0) {
        do {
          for (i = 0; i < items.length; i++) {
            let price = Number((await items[i].getText()).replace(/ /g, ''));
            price.should.be.within(
              999,
              1999,
              'Items with price below min value were found'
            );
          }
          //if there is more than one page find and click Next button
          nextBtn = await driver.findElements(
            By.xpath('//div[@data-auto="pagination-next"]/span')
          );
          if (nextBtn.length == 1) {
            await nextBtn[0].click();
            await driver.wait(
              until.stalenessOf(items[0]),
              10000,
              'The items of the previous page remain visible'
            );
            items = await driver.wait(
              until.elementsLocated(
                By.xpath('//*[@data-auto="price"]/span/span[1]')
              ),
              4000,
              'Next page items are not located'
            );
          }
        } while (nextBtn.length == 1);
      } else {
        //if no matches found check that appropriate message is displayed
        await driver.findElement(
          By.xpath(
            '//div[@class="_2QyTfBZosp _26mXJDBxtH" and text() = "Нет подходящих товаров"]'
          )
        );
      }
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get('https://beru.ru/');
  });

  it('Check the error message is displayed when filter is set incorrectly', async function() {
    await driver.get(
      'https://beru.ru/catalog/elektricheskie-zubnye-shchetki/80961/list?hid=278374&track=pieces'
    );

    try {
      //fill the filter values and wait till filtered items load
      let oldItem = await driver.findElement(
        By.xpath('//*[@data-auto="price"]/span/span[1]')
      );
      await driver
        .findElement(
          By.xpath(
            '//div[@data-auto="filter-range-glprice"]/span[@data-auto="filter-range-min"]//input'
          )
        )
        .sendKeys('1999');

      await driver
        .findElement(
          By.xpath(
            '//div[@data-auto="filter-range-glprice"]/span[@data-auto="filter-range-max"]//input'
          )
        )
        .sendKeys('999');

      await driver.wait(
        until.stalenessOf(oldItem),
        10000,
        'Failed to refresh items list'
      );

      await driver.wait(
        until.elementLocated(
          By.xpath(
            '//div[@class="_2QyTfBZosp _26mXJDBxtH" and text() = "Нет подходящих товаров"]'
          )
        ),
        10000,
        'Error message is not displayed'
      );
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get('https://beru.ru/');
  });

  it('Check the item can be successfully added to cart from items list', async function() {
    await driver.get(
      'https://beru.ru/catalog/elektricheskie-zubnye-shchetki/80961/list?hid=278374&track=pieces'
    );

    try {
      //set the filter and wait until the items list is refreshed
      let oldItem = await driver.wait(
        until.elementLocated(By.xpath('//*[@data-auto="price"]/span/span[1]')),
        15000,
        'Items list is not loading'
      );
      await driver
        .findElement(
          By.xpath(
            '//div[@data-auto="filter-range-glprice"]/span[@data-auto="filter-range-min"]//input'
          )
        )
        .sendKeys('999');
      await driver
        .findElement(
          By.xpath(
            '//div[@data-auto="filter-range-glprice"]/span[@data-auto="filter-range-max"]//input'
          )
        )
        .sendKeys('1999');
      await driver.wait(
        until.stalenessOf(oldItem),
        10000,
        'Failed to refresh items list'
      );

      //add the penultimate brush to cart
      let nextBtn;
      do {
        nextBtn = await driver.findElements(
          By.xpath('//div[@data-auto="pagination-next"]/span')
        );
        if (nextBtn.length == 1) {
          await nextBtn[0].click();
          await driver.wait(
            until.stalenessOf(nextBtn[0]),
            10000,
            'The items of the previous page remain visible'
          );
        }
      } while (nextBtn.length == 1);

      let itemsList = await driver.findElements(
        By.xpath('//div[@class="_3rWYRsam78"]//div[@class="_1gDHxFdZ7E"]')
      );
      let curItem = itemsList[itemsList.length - 2];
      await driver.wait(
        until.elementIsVisible(curItem),
        10000,
        'Item is not visible'
      );
      let priceText = await curItem
        .findElement(By.className('_1pTV0mQZJz _3LMhEMfZeH'))
        .getText();
      let price = Number(priceText.replace(/[^\d]/g, ''));
      let oldPriceText = await curItem
        .findElements(By.xpath('//span[@data-auto="old-price"]/span[1]'))
        .getText();
      let oldPrice = Number(oldPriceText.replace(/ /g, ''));
      await curItem.findElement(By.className('_2w0qPDYwej')).click();
      await driver.wait(
        async function() {
          let btnText;
          try {
            btnText = await curItem
              .findElement(By.className('_2w0qPDYwej'))
              .getText();
          } catch {
            return false;
          }
          return btnText == 'В корзине';
        },
        10000,
        "The Add to cart button state wasn't changed"
      );

      //go to Cart
      await driver.sleep(2000);
      await driver
        .findElement(
          By.xpath('//span[@class="_1LEwf9X1Gy" and text()="Корзина"]')
        )
        .click();

      let remainderText = await driver.wait(
        until.elementLocated(By.className('voCFmXKfcL')),
        10000,
        'Failed to locate free delivery threshold'
      );
      await driver.sleep(1000);
      remainderText = await remainderText.getText();
      let remainderValue = Number(remainderText.replace(/[^\d]/g, ''));
      remainderValue.should.equal(
        2499 - price,
        'The amount left for free delivery is calculated incorrectly'
      );
    } catch (err) {
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
  });

  it('Check the delivery is included in total price', async function() {
    await driver.get(
      'https://beru.ru/catalog/elektricheskie-zubnye-shchetki/80961/list?hid=278374&track=pieces'
    );

    try {
      //set the filter and wait until the items list is refreshed
      let oldItem = await driver.wait(
        until.elementLocated(By.xpath('//*[@data-auto="price"]/span/span[1]')),
        15000,
        'Items list is not loading'
      );
      await driver
        .findElement(
          By.xpath(
            '//div[@data-auto="filter-range-glprice"]/span[@data-auto="filter-range-min"]//input'
          )
        )
        .sendKeys('999');
      await driver
        .findElement(
          By.xpath(
            '//div[@data-auto="filter-range-glprice"]/span[@data-auto="filter-range-max"]//input'
          )
        )
        .sendKeys('1999');
      await driver.wait(
        until.stalenessOf(oldItem),
        10000,
        'Failed to refresh items list'
      );

      //add the penultimate brush to cart
      let nextBtn;
      do {
        nextBtn = await driver.findElements(
          By.xpath('//div[@data-auto="pagination-next"]/span')
        );
        if (nextBtn.length == 1) {
          await nextBtn[0].click();
          await driver.wait(
            until.stalenessOf(nextBtn[0]),
            10000,
            'The items of the previous page remain visible'
          );
        }
      } while (nextBtn.length == 1);

      let itemsList = await driver.findElements(
        By.xpath('//div[@class="_3rWYRsam78"]//div[@class="_1gDHxFdZ7E"]')
      );
      let curItem = itemsList[itemsList.length - 2];
      await driver.wait(
        until.elementIsVisible(curItem),
        10000,
        'Item is not visible'
      );
      let priceText = await curItem
        .findElement(By.className('_1pTV0mQZJz _3LMhEMfZeH'))
        .getText();
      let price = Number(priceText.replace(/[^\d]/g, ''));
      let oldPriceText = await curItem
        .findElements(By.xpath('//span[@data-auto="old-price"]/span[1]'))
        .getText();
      let oldPrice = Number(oldPriceText.replace(/ /g, ''));
      await curItem.findElement(By.className('_2w0qPDYwej')).click();
      await driver.wait(
        async function() {
          let btnText;
          try {
            btnText = await curItem
              .findElement(By.className('_2w0qPDYwej'))
              .getText();
          } catch {
            return false;
          }
          return btnText == 'В корзине';
        },
        10000,
        "The Add to cart button state wasn't changed"
      );

      //go to Cart
      await driver.sleep(2000);
      await driver
        .findElement(
          By.xpath('//span[@class="_1LEwf9X1Gy" and text()="Корзина"]')
        )
        .click();

      await driver
        .wait(
          until.elementLocated(
            By.xpath(
              '//span[@class="_2w0qPDYwej" and text()="Перейти к оформлению"]'
            )
          ),
          10000,
          'The checkout button is not found'
        )
        .click();
      let delivery = await driver.wait(
        until.elementLocated(
          By.xpath('//*[@class="s5wsZMKoea" and @data-auto="DELIVERY"]')
        ),
        10000,
        'The delivery options are not found'
      );
      await driver.wait(
        until.elementIsVisible(delivery),
        5000,
        'Delivery options are not visible'
      );
      await delivery.click();
      let deliveryCostText = await driver
        .findElement(
          By.xpath(
            '//label[@class="_32Rl_SqO9- checked"]//div[@class="_1IG4X84z4y"]/span[2]'
          )
        )
        .getText();
      let deliveryCost = Number(deliveryCostText.replace(/[^\d]/g, ''));
      let totalText = await driver
        .findElement(By.className('_1oBlNqVHPq'))
        .getText();
      let total = Number(totalText.replace(/[^\d]/g, ''));
      total.should.equal(
        price + deliveryCost,
        'Total sum is calculated incorrectly'
      );
    } catch (err) {
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.manage().deleteAllCookies();
    await driver.get('https://beru.ru/');
  }); */
});
