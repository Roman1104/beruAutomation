const { Builder, By, Key, until } = require('selenium-webdriver');
const { HomePage, AuthPage } = require('../pageObjects');
const mocha = require('mocha');
const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;

describe('Beru.ru authorization flow', function() {
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
});

describe('City selection flow', function() {
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
    await driver.get('https://beru.ru/');

    try {
      let city = await driver.findElement(
        By.xpath(
          '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
        )
      );
      await city.click();

      let inputFields = await driver.findElements(
        By.xpath('//div[@class="_1U2ErCeoqP"]//input[@class="_2JDvXzYsUI"]')
      );
      should.equal(
        inputFields.length,
        1,
        'Zero or more than one city input field is found'
      );
      let cityInput = inputFields[0];
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
    await driver.get('https://beru.ru/');
    try {
      let city = await driver.findElement(
        By.xpath(
          '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
        )
      );
      await city.click();

      let inputField = await driver.findElement(
        By.xpath('//div[@class="_1U2ErCeoqP"]//input[@class="_2JDvXzYsUI"]')
      );
      await inputField.sendKeys(Key.CONTROL, 'a', Key.NULL, Key.BACK_SPACE);

      let query = ['х', 'в', 'а', 'л', 'ы', 'н', 'с', 'к'];
      for (i = 0; i < query.length; i++) {
        await inputField.sendKeys(query[i]);
        await driver.sleep(30);
      }

      let suggest = await driver.wait(
        until.elementLocated(
          By.xpath('//div[@class="_229JDbp_Z8" and text()="Хвалынск"]')
        ),
        2000,
        "Quick suggests aren't found"
      );
      await driver.wait(
        until.elementIsVisible(suggest),
        3000,
        'Cities suggests list is not visible'
      );
      await suggest.click();

      let okBtn = await driver.wait(
        until.elementLocated(
          By.xpath('//span[@class="_2w0qPDYwej" and text()="Хорошо"]')
        ),
        4000,
        'OK button is not found'
      );
      await driver.wait(
        until.elementIsVisible(okBtn),
        4000,
        'OK button is not visible'
      );
      await okBtn.click();

      await driver.sleep(500);
      city = await driver.wait(
        until.elementLocated(
          By.xpath(
            '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
          )
        ),
        5000,
        'Failed to locate new city value'
      );
      await driver.wait(
        until.elementIsVisible(city),
        3000,
        'City is not visible'
      );

      let cityName = await city.getText();
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
    await driver.get('https://beru.ru/');
    try {
      let city = await driver.findElement(
        By.xpath(
          '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
        )
      );
      await city.click();

      let inputField = await driver.findElement(
        By.xpath('//div[@class="_1U2ErCeoqP"]//input[@class="_2JDvXzYsUI"]')
      );
      await inputField.sendKeys(Key.CONTROL, 'a', Key.NULL, Key.BACK_SPACE);

      let query = ['й', 'ц', 'у', 'к', 'е', 'н'];
      for (i = 0; i < query.length; i++) {
        await inputField.sendKeys(query[i]);
        await driver.sleep(30);
      }

      let suggests = await driver.findElements(By.className('_229JDbp_Z8'));
      suggests.length.should.equal(0, 'Unexpected suggests are displayed');
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get('https://beru.ru/');
  });

  it('Check "Delete" button erases input field', async function() {
    await driver.get('https://beru.ru/');
    try {
      let city = await driver.findElement(
        By.xpath(
          '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
        )
      );
      await city.click();
      let inputField = await driver.findElement(
        By.xpath('//div[@class="_1U2ErCeoqP"]//input[@class="_2JDvXzYsUI"]')
      );
      await inputField.sendKeys(
        Key.CONTROL,
        'a',
        Key.NULL,
        Key.BACK_SPACE,
        'тест'
      );

      let inputContainer = await driver.findElement(
        By.className('_8iW7gwBP58')
      );
      let cssWidth = await inputContainer.getCssValue('width');
      let containerWidth = cssWidth.match(/\d+/)[0];
      const actions = driver.actions({ bridge: true });
      await actions
        .move({
          x: Math.floor(containerWidth / 2 - 22),
          y: 0,
          duration: 500,
          origin: inputContainer,
        })
        .click()
        .perform();
      let fieldValue = await inputField.getAttribute('value');
      fieldValue.should.equal('', 'The input field is not cleared');
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get('https://beru.ru/');
  });

  it('Check the delivery city persists after refreshing', async function() {
    await driver.get('https://beru.ru/');
    try {
      let city = await driver.findElement(
        By.xpath(
          '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
        )
      );
      await city.click();

      let inputField = await driver.findElement(
        By.xpath('//div[@class="_1U2ErCeoqP"]//input[@class="_2JDvXzYsUI"]')
      );
      await inputField.sendKeys(Key.CONTROL, 'a', Key.NULL, Key.BACK_SPACE);

      let query = ['х', 'в', 'а', 'л', 'ы', 'н', 'с', 'к'];
      for (i = 0; i < query.length; i++) {
        await inputField.sendKeys(query[i]);
        await driver.sleep(30);
      }

      let suggest = await driver.wait(
        until.elementLocated(
          By.xpath('//div[@class="_229JDbp_Z8" and text()="Хвалынск"]')
        ),
        2000,
        "Quick suggests aren't found"
      );
      await driver.wait(
        until.elementIsVisible(suggest),
        3000,
        'Cities suggests list is not visible'
      );
      await suggest.click();

      let okBtn = await driver.wait(
        until.elementLocated(
          By.xpath('//span[@class="_2w0qPDYwej" and text()="Хорошо"]')
        ),
        4000,
        'OK button is not found'
      );
      await driver.wait(
        until.elementIsVisible(okBtn),
        4000,
        'OK button is not visible'
      );
      okBtn.click();
      await driver.sleep(500);
      await driver.get('https://beru.ru/');
      city = await driver.findElement(
        By.xpath(
          '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
        )
      );

      let cityName = await city.getText();
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
    await driver.get('https://beru.ru/');
    try {
      let city = await driver.findElement(
        By.xpath(
          '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
        )
      );
      await city.click();

      let inputField = await driver.findElement(
        By.xpath('//div[@class="_1U2ErCeoqP"]//input[@class="_2JDvXzYsUI"]')
      );
      await inputField.sendKeys(Key.CONTROL, 'a', Key.NULL, Key.BACK_SPACE);

      let query = ['х', 'в', 'а', 'л', 'ы', 'н', 'с', 'к'];
      for (i = 0; i < query.length; i++) {
        await inputField.sendKeys(query[i]);
        await driver.sleep(30);
      }

      let suggest = await driver.wait(
        until.elementLocated(
          By.xpath('//div[@class="_229JDbp_Z8" and text()="Хвалынск"]')
        ),
        2000,
        "Quick suggests aren't found"
      );
      await driver.wait(
        until.elementIsVisible(suggest),
        3000,
        'Cities suggests list is not visible'
      );
      await suggest.click();

      let backBtn = await driver.wait(
        until.elementLocated(
          By.xpath('//span[@class="_2w0qPDYwej" and text()="Назад"]')
        ),
        4000,
        'Back button is not found'
      );
      await driver.wait(
        until.elementIsVisible(backBtn),
        4000,
        'Back button is not visible'
      );
      await backBtn.click();
      inputField = await driver.findElement(
        By.xpath('//div[@class="_1U2ErCeoqP"]//input[@class="_2JDvXzYsUI"]')
      );
      await inputField.sendKeys(Key.CONTROL, 'a', Key.NULL, Key.BACK_SPACE);

      query = ['э', 'н', 'г', 'е', 'л'];
      for (i = 0; i < query.length; i++) {
        await inputField.sendKeys(query[i]);
        await driver.sleep(30);
      }

      suggest = await driver.wait(
        until.elementLocated(
          By.xpath('//div[@class="_229JDbp_Z8" and text()="Энгельс"]')
        ),
        2000,
        "Quick suggests aren't found"
      );
      await driver.wait(
        until.elementIsVisible(suggest),
        3000,
        'Cities suggests list is not visible'
      );
      await suggest.click();

      let okBtn = await driver.wait(
        until.elementLocated(
          By.xpath('//span[@class="_2w0qPDYwej" and text()="Хорошо"]')
        ),
        4000,
        'OK button is not found'
      );
      await driver.wait(
        until.elementIsVisible(okBtn),
        4000,
        'OK button is not visible'
      );
      await okBtn.click();
      await driver.sleep(500);
      city = await driver.findElement(
        By.xpath(
          '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
        )
      );

      let cityName = await city.getText();
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
    await driver.get('https://beru.ru/');
    try {
      let city = await driver.findElement(
        By.xpath(
          '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
        )
      );
      let prevCity = await city.getText();
      await city.click();

      let inputField = await driver.findElement(
        By.xpath('//div[@class="_1U2ErCeoqP"]//input[@class="_2JDvXzYsUI"]')
      );
      await inputField.sendKeys(Key.CONTROL, 'a', Key.NULL, Key.BACK_SPACE);

      let query = ['х', 'в', 'а', 'л', 'ы', 'н', 'с', 'к'];
      for (i = 0; i < query.length; i++) {
        await inputField.sendKeys(query[i]);
        await driver.sleep(30);
      }

      let suggest = await driver.wait(
        until.elementLocated(
          By.xpath('//div[@class="_229JDbp_Z8" and text()="Хвалынск"]')
        ),
        2000,
        "Quick suggests aren't found"
      );
      await driver.wait(
        until.elementIsVisible(suggest),
        3000,
        'Cities suggests list is not visible'
      );
      await suggest.click();
      await driver.actions().sendKeys(Key.ESCAPE);
      await driver.sleep(500);
      city = await driver.wait(
        until.elementLocated(
          By.xpath(
            '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
          )
        ),
        5000,
        'Failed to locate new city value'
      );
      await driver.wait(
        until.elementIsVisible(city),
        3000,
        'City is not visible'
      );

      let cityName = await city.getText();
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
    await driver.get('https://beru.ru/');
    try {
      //Change delivery city
      let city = await driver.findElement(
        By.xpath(
          '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
        )
      );
      await city.click();

      let inputField = await driver.findElement(
        By.xpath('//div[@class="_1U2ErCeoqP"]//input[@class="_2JDvXzYsUI"]')
      );
      await inputField.sendKeys(Key.CONTROL, 'a', Key.NULL, Key.BACK_SPACE);

      let query = ['х', 'в', 'а', 'л', 'ы', 'н', 'с', 'к'];
      for (i = 0; i < query.length; i++) {
        await inputField.sendKeys(query[i]);
        await driver.sleep(30);
      }

      let suggest = await driver.wait(
        until.elementLocated(
          By.xpath('//div[@class="_229JDbp_Z8" and text()="Хвалынск"]')
        ),
        2000,
        "Quick suggests aren't found"
      );
      await driver.wait(
        until.elementIsVisible(suggest),
        3000,
        'Cities suggests list is not visible'
      );
      await suggest.click();

      let okBtn = await driver.wait(
        until.elementLocated(
          By.xpath('//span[@class="_2w0qPDYwej" and text()="Хорошо"]')
        ),
        4000,
        'OK button is not found'
      );
      await driver.wait(
        until.elementIsVisible(okBtn),
        4000,
        'OK button is not visible'
      );
      okBtn.click();
      await driver.sleep(2000);

      //Authentification flow
      await driver.findElement(By.className('_3odNv2Dw2n')).click();
      let loginField = await driver.wait(
        until.elementLocated(By.id('passp-field-login')),
        10000,
        'Failed to locate login field in the DOM'
      );
      await driver.wait(
        until.elementIsVisible(loginField),
        10000,
        'Login field is not visible'
      );
      await loginField.sendKeys('testmalakhov2019@yandex.ru', Key.RETURN);

      let passField = await driver.wait(
        until.elementLocated(By.id('passp-field-passwd')),
        10000,
        'Failed to locate password field in the DOM'
      );
      await driver.wait(
        until.elementIsVisible(passField),
        10000,
        'Password field is not visible'
      );
      await passField.sendKeys('38tnrWW!QiNRqJv', Key.RETURN);

      await driver.sleep(2000);
      await driver.get('https://beru.ru/my/settings?track=menu');

      //Validate city
      let profileCity = await driver
        .findElement(
          By.xpath(
            '//div[@id="region"]//span[contains(@class,"_3ioN70chUh")]/span[contains(@class,"_3l-uEDOaBN")]'
          )
        )
        .getText();

      let cityName = await driver
        .findElement(
          By.xpath(
            '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
          )
        )
        .getText();

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
    await driver.get('https://beru.ru/');
    try {
      //Change delivery city
      let city = await driver.findElement(
        By.xpath(
          '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
        )
      );
      await city.click();

      let inputField = await driver.findElement(
        By.xpath('//div[@class="_1U2ErCeoqP"]//input[@class="_2JDvXzYsUI"]')
      );
      await inputField.sendKeys(Key.CONTROL, 'a', Key.NULL, Key.BACK_SPACE);

      let query = ['х', 'в', 'а', 'л', 'ы', 'н', 'с', 'к'];
      for (i = 0; i < query.length; i++) {
        await inputField.sendKeys(query[i]);
        await driver.sleep(30);
      }

      let suggest = await driver.wait(
        until.elementLocated(
          By.xpath('//div[@class="_229JDbp_Z8" and text()="Хвалынск"]')
        ),
        2000,
        "Quick suggests aren't found"
      );
      await driver.wait(
        until.elementIsVisible(suggest),
        3000,
        'Cities suggests list is not visible'
      );
      await suggest.click();

      let okBtn = await driver.wait(
        until.elementLocated(
          By.xpath('//span[@class="_2w0qPDYwej" and text()="Хорошо"]')
        ),
        4000,
        'OK button is not found'
      );
      await driver.wait(
        until.elementIsVisible(okBtn),
        4000,
        'OK button is not visible'
      );
      okBtn.click();
      await driver.sleep(2000);

      //Authentification flow
      await driver.findElement(By.className('_3odNv2Dw2n')).click();
      let loginField = await driver.wait(
        until.elementLocated(By.id('passp-field-login')),
        10000,
        'Failed to locate login field in the DOM'
      );
      await driver.wait(
        until.elementIsVisible(loginField),
        10000,
        'Login field is not visible'
      );
      await driver
        .findElement(By.className('passp-previous-step-button__icon'))
        .click();

      //Validate city
      let cityName = await driver
        .wait(
          until.elementLocated(
            By.xpath(
              '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
            )
          ),
          10000,
          'The delivery city is not visible'
        )
        .getText();
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
    await driver.get('https://beru.ru/');
    try {
      //Change delivery city
      let city = await driver.findElement(
        By.xpath(
          '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
        )
      );
      await city.click();

      let inputField = await driver.findElement(
        By.xpath('//div[@class="_1U2ErCeoqP"]//input[@class="_2JDvXzYsUI"]')
      );
      await inputField.sendKeys(Key.CONTROL, 'a', Key.NULL, Key.BACK_SPACE);

      let query = ['х', 'в', 'а', 'л', 'ы', 'н', 'с', 'к'];
      for (i = 0; i < query.length; i++) {
        await inputField.sendKeys(query[i]);
        await driver.sleep(30);
      }

      let suggest = await driver.wait(
        until.elementLocated(
          By.xpath('//div[@class="_229JDbp_Z8" and text()="Хвалынск"]')
        ),
        2000,
        "Quick suggests aren't found"
      );
      await driver.wait(
        until.elementIsVisible(suggest),
        3000,
        'Cities suggests list is not visible'
      );
      await suggest.click();

      let okBtn = await driver.wait(
        until.elementLocated(
          By.xpath('//span[@class="_2w0qPDYwej" and text()="Хорошо"]')
        ),
        4000,
        'OK button is not found'
      );
      await driver.wait(
        until.elementIsVisible(okBtn),
        4000,
        'OK button is not visible'
      );
      okBtn.click();
      await driver.sleep(2000);

      //Authentification flow
      await driver.findElement(By.className('_3odNv2Dw2n')).click();
      let loginField = await driver.wait(
        until.elementLocated(By.id('passp-field-login')),
        10000,
        'Failed to locate login field in the DOM'
      );
      await driver.wait(
        until.elementIsVisible(loginField),
        10000,
        'Login field is not visible'
      );
      await loginField.sendKeys('testmalakhov2019@yandex.ru', Key.RETURN);

      let passField = await driver.wait(
        until.elementLocated(By.id('passp-field-passwd')),
        10000,
        'Failed to locate password field in the DOM'
      );
      await driver.wait(
        until.elementIsVisible(passField),
        10000,
        'Password field is not visible'
      );
      await passField.sendKeys('38tnrWW!QiNRqJv', Key.RETURN);

      await driver.sleep(2000);
      await driver.get('https://beru.ru/');

      //Validate city
      let cityName = await driver
        .findElement(
          By.xpath(
            '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
          )
        )
        .getText();

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
    await driver.get('https://beru.ru/');
    try {
      //Change delivery city
      let city = await driver.findElement(
        By.xpath(
          '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
        )
      );
      await city.click();

      let inputField = await driver.findElement(
        By.xpath('//div[@class="_1U2ErCeoqP"]//input[@class="_2JDvXzYsUI"]')
      );
      await inputField.sendKeys(Key.CONTROL, 'a', Key.NULL, Key.BACK_SPACE);

      let query = ['х', 'в', 'а', 'л', 'ы', 'н', 'с', 'к'];
      for (i = 0; i < query.length; i++) {
        await inputField.sendKeys(query[i]);
        await driver.sleep(30);
      }

      let suggest = await driver.wait(
        until.elementLocated(
          By.xpath('//div[@class="_229JDbp_Z8" and text()="Хвалынск"]')
        ),
        2000,
        "Quick suggests aren't found"
      );
      await driver.wait(
        until.elementIsVisible(suggest),
        3000,
        'Cities suggests list is not visible'
      );
      await suggest.click();

      let okBtn = await driver.wait(
        until.elementLocated(
          By.xpath('//span[@class="_2w0qPDYwej" and text()="Хорошо"]')
        ),
        4000,
        'OK button is not found'
      );
      await driver.wait(
        until.elementIsVisible(okBtn),
        4000,
        'OK button is not visible'
      );
      okBtn.click();
      await driver.sleep(2000);

      //Authentification flow
      await driver.findElement(By.className('_3odNv2Dw2n')).click();
      let loginField = await driver.wait(
        until.elementLocated(By.id('passp-field-login')),
        10000,
        'Failed to locate login field in the DOM'
      );
      await driver.wait(
        until.elementIsVisible(loginField),
        10000,
        'Login field is not visible'
      );
      await loginField.sendKeys('testmalakhov2019@yandex.ru', Key.RETURN);

      let passField = await driver.wait(
        until.elementLocated(By.id('passp-field-passwd')),
        10000,
        'Failed to locate password field in the DOM'
      );
      await driver.wait(
        until.elementIsVisible(passField),
        10000,
        'Password field is not visible'
      );
      await passField.sendKeys('38tnrWW!QiNRqJv', Key.RETURN);

      await driver.sleep(2000);
      await driver.get(
        'https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1'
      );

      //Validate city
      let cityName = await driver
        .findElement(
          By.xpath(
            '//div[@class="EsYwYP7LNa"]/span[@class="-soJAyMJBd"]/span[@class="_2XJ6yiRp5w"]'
          )
        )
        .getText();

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
});

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
    await driver.close();
  });

  it('Check the electric toothbrushes section contains items', async function() {
    await driver.get('https://beru.ru/');
    try {
      await driver.findElement(By.className('_301_b-LBxR')).click();
      let hygieneSection = await driver.findElement(
        By.xpath(
          '//li//span[@class="_19FPGVzRi9" and text()="Красота и гигиена"]'
        )
      );
      let listItemPos = await hygieneSection.getRect();
      const actions = driver.actions({ bridge: true });
      await actions
        .move({
          x: Math.floor(listItemPos.x),
          y: Math.floor(listItemPos.y),
          duration: 500,
        })
        .perform();
      await driver
        .findElement(
          By.xpath(
            '//span[@class="_27Pcf7STDj" and text() = "Электрические зубные щетки"]'
          )
        )
        .click();
      await driver.sleep(2000);
      let items = await driver.findElements(
        By.xpath('//div[@class="_3rWYRsam78"]//div[@class="_1gDHxFdZ7E"]')
      );
      items.length.should.be.above(0, 'There is no items on the page');
    } catch (err) {
      await driver.get('https://beru.ru/');
      assert.fail(err);
    }

    //return to initial state
    await driver.get('https://beru.ru/');
  });

  it('Check the price range filter works properly', async function() {
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
  });
});
