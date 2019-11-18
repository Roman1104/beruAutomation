const {Builder, By, Key, until} = require('selenium-webdriver');
const mocha = require('mocha');
const chai = require('chai'); 
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;

describe('Beru.ru authorization flow', function () {
    this.timeout(0);  //отключаем таймауты (2 секунды) для тестов
    let driver; 
    let profileBtn;
    let loginField;
    let passField;
    let profileName;

    before(async function () {
      driver = await new Builder().forBrowser('chrome').build();
      await driver.manage().window().maximize();
    });

    after(async function () {
      await driver.close();
    });

    it('Check the page opens successfully.', async function () {
      await driver.get('https://beru.ru/');
      let title = await driver.getTitle();
      title.should.contain('Беру', 'The page title doesn\'t match the expected');
    });

    it('Check the profile/login button name is "Войти в аккаунт" for unauthentificated user', async function () {
      await driver.get('https://beru.ru/');
      profileBtn = await driver.findElement(By.className('_3odNv2Dw2n'));
      let btnText = await profileBtn.getText();
      btnText.should.equal('Войти в аккаунт', 'Button title doesn\'t match:');
    });

    it('Check the "Войти в аккаунт" button leads to authentification page', async function () {
        await driver.get('https://beru.ru/');
        await driver.findElement(By.className('_3odNv2Dw2n')).click();
        let curUrl = await driver.getCurrentUrl();
        try {
          curUrl.should.contain('passport.yandex.ru','Failed to redirect to passport.yandex.ru');
        }
        catch(err) {
          await driver.get('https://beru.ru/');
          assert.fail(err);
        }

        //return to initial state
        await driver.get('https://beru.ru/');
    });

    it('Authentificate user via UI elements', async function () {
      await driver.get('https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255');
      
      try {
        loginField = await driver.wait(until.elementLocated(By.id('passp-field-login')), 10000, 'Failed to locate login field in the DOM');
        await driver.wait(until.elementIsVisible(loginField), 10000, 'Login field is not visible');
        await loginField.sendKeys('testmalakhov2019@yandex.ru');
        await driver.findElement(By.className('passp-sign-in-button')).click();
      
        passField = await driver.wait(until.elementLocated(By.id('passp-field-passwd')), 10000, 'Failed to locate password field in the DOM');
        await driver.wait(until.elementIsVisible(passField), 10000, 'Password field is not visible');
        await passField.sendKeys('38tnrWW!QiNRqJv');
        await driver.findElement(By.className('passp-form-button')).click();
      } catch(err) {
        await driver.get('https://beru.ru/');
        assert.fail(err);
      }

      try {
        let curUrl = await driver.getCurrentUrl();
        curUrl.should.contain('beru.ru','Failed to redirect back to the site');
        profileBtn = await driver.wait(until.elementLocated(By.className('_3odNv2Dw2n')), 10000, 'Profile buttun not found');
        let btnText = await profileBtn.getText();
        btnText.should.equal('Мой профиль', 'Button title doesn\'t match:');
        await profileBtn.click();
        let profileTitle = await driver.wait(until.elementLocated(By.className('_2I5v9t-gmG')), 10000, 'Profile title not found');
        await driver.wait(until.elementIsVisible(profileTitle), 10000, 'Profile title is not visible');
        profileName = await profileTitle.getText();
        profileName.should.equal('Automation Test Malakhov 2019', 'Profile name doesn\'t match:');
      }
      catch(err) {
        await driver.get('https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1');
        await driver.get('https://passport.yandex.ru/');
        await driver.manage().deleteAllCookies();
        await driver.get('https://beru.ru/');
        assert.fail(err);
      }
      
      //return to initial state
      await driver.get('https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1');
      await driver.get('https://passport.yandex.ru/');
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');

    });

    it('Authentificate user via keyboard', async function () {
      await driver.get('https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255');
      
      try {
        loginField = await driver.wait(until.elementLocated(By.id('passp-field-login')), 10000, 'Failed to locate login field in the DOM');
        await driver.wait(until.elementIsVisible(loginField), 10000, 'Login field is not visible');
        await loginField.sendKeys('testmalakhov2019@yandex.ru', Key.RETURN);
      
        passField = await driver.wait(until.elementLocated(By.id('passp-field-passwd')), 10000, 'Failed to locate password field in the DOM');
        await driver.wait(until.elementIsVisible(passField), 10000, 'Password field is not visible');
        await passField.sendKeys('38tnrWW!QiNRqJv', Key.RETURN);
      } catch(err) {
        await driver.get('https://beru.ru/');
        assert.fail(err);
      }

      try {
        let curUrl = await driver.getCurrentUrl();
        curUrl.should.contain('beru.ru','Failed to redirect back to the site');
        profileBtn = await driver.wait(until.elementLocated(By.className('_3odNv2Dw2n')), 10000, 'Profile buttun not found');
        let btnText = await profileBtn.getText();
        btnText.should.equal('Мой профиль', 'Button title doesn\'t match:');
        await profileBtn.click();
        let profileTitle = await driver.wait(until.elementLocated(By.className('_2I5v9t-gmG')), 10000, 'Profile title not found');
        await driver.wait(until.elementIsVisible(profileTitle), 10000, 'Profile title is not visible');
        profileName = await profileTitle.getText();
        profileName.should.equal('Automation Test Malakhov 2019', 'Profile name doesn\'t match:');
      }
      catch(err) {
        await driver.get('https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1');
        await driver.get('https://passport.yandex.ru/');
        await driver.manage().deleteAllCookies();
        await driver.get('https://beru.ru/');
        assert.fail(err);
      }
      
      //return to initial state
      await driver.get('https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1');
      await driver.get('https://passport.yandex.ru/');
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      
    });

    it('Check the error returns when unexisting login is submitted', async function () {
      await driver.get('https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255');
      
      try {
        loginField = await driver.wait(until.elementLocated(By.id('passp-field-login')), 10000, 'Failed to locate login field in the DOM');
        await driver.wait(until.elementIsVisible(loginField), 10000, 'Login field is not visible');
        await loginField.sendKeys('bkcglkhlcvb', Key.RETURN);
        let errorBlock = await driver.wait(until.elementLocated(By.className('passp-form-field__error')), 2000, 'No error message in the DOM');
        await driver.wait(until.elementIsVisible(errorBlock), 2000, 'Error message is not visible');
        let errorText = await errorBlock.getText();
        errorText.should.equal('Такого аккаунта нет', 'Incorrect error message text');
      } catch(err) {
        await driver.get('https://beru.ru/');
        assert.fail(err);
      }

      //return to initial state
      await driver.get('https://beru.ru/');

    });

    it('Check the error returns when incorrect login is submitted', async function () {
      await driver.get('https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255');
      
      try {
        loginField = await driver.wait(until.elementLocated(By.id('passp-field-login')), 10000, 'Failed to locate login field in the DOM');
        await driver.wait(until.elementIsVisible(loginField), 10000, 'Login field is not visible');
        await loginField.sendKeys('1111', Key.RETURN);
        let errorBlock = await driver.wait(until.elementLocated(By.className('passp-form-field__error')), 2000, 'No error message in the DOM');
        await driver.wait(until.elementIsVisible(errorBlock), 2000, 'Error message is not visible');
        let errorText = await errorBlock.getText();
        errorText.should.equal('Такой логин не подойдет', 'Incorrect error message text');
      } catch(err) {
        await driver.get('https://beru.ru/');
        assert.fail(err);
      }

      //return to initial state
      await driver.get('https://beru.ru/');

    });

    it('Check the error returns when no login is submitted', async function () {
      await driver.get('https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255');
      
      try {
        loginField = await driver.wait(until.elementLocated(By.id('passp-field-login')), 10000, 'Failed to locate login field in the DOM');
        await driver.wait(until.elementIsVisible(loginField), 10000, 'Login field is not visible');
        await loginField.sendKeys(Key.RETURN);
        let errorBlock = await driver.wait(until.elementLocated(By.className('passp-form-field__error')), 2000, 'No error message in the DOM');
        await driver.wait(until.elementIsVisible(errorBlock), 2000, 'Error message is not visible');
        let errorText = await errorBlock.getText();
        errorText.should.equal('Логин не указан', 'Incorrect error message text');
      } catch(err) {
        await driver.get('https://beru.ru/');
        assert.fail(err);
      }

      //return to initial state
      await driver.get('https://beru.ru/');

    }); 
    
    it('Check the back button on the login page returns to the site without authetification', async function () {
      await driver.get('https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255');
      
      try {
        await driver.findElement(By.className('passp-previous-step-button__icon')).click();
        let curUrl = await driver.getCurrentUrl();
        curUrl.should.contain('beru.ru','Failed to redirect to passport.yandex.ru');
        profileBtn = await driver.wait(until.elementLocated(By.className('_3odNv2Dw2n')), 10000, 'Profile button is missing on the page');
        let btnText = await profileBtn.getText();
        btnText.should.equal('Войти в аккаунт', 'Button title doesn\'t match:');
      }
      catch(err) {
        await driver.get('https://beru.ru/');
        assert.fail(err);
      }
    });


    it('Check the error returns when incorreсt password is submitted', async function () {
      await driver.get('https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255');
      
      try {
        loginField = await driver.wait(until.elementLocated(By.id('passp-field-login')), 10000, 'Failed to locate login field in the DOM');
        await driver.wait(until.elementIsVisible(loginField), 10000, 'Login field is not visible');
        await loginField.sendKeys('testmalakhov2019@yandex.ru', Key.RETURN);

        passField = await driver.wait(until.elementLocated(By.id('passp-field-passwd')), 10000, 'Failed to locate password field in the DOM');
        await driver.wait(until.elementIsVisible(passField), 10000, 'Password field is not visible');
        await passField.sendKeys('38tnrWW!qiNRqJv', Key.RETURN);
      } catch(err) {
        await driver.get('https://beru.ru/');
        assert.fail(err);
      }

      try {
        let curUrl = await driver.getCurrentUrl();
        curUrl.should.contain('passport.yandex.ru','Unexpected redirect occured');
        let errorBlock = await driver.wait(until.elementLocated(By.className('passp-form-field__error')), 2000, 'No error message in the DOM');
        await driver.wait(until.elementIsVisible(errorBlock), 2000, 'Error message is not visible');
        let errorText = await errorBlock.getText();
        errorText.should.equal('Неверный пароль', 'Incorrect error message text');
      }
      catch(err) {
        await driver.get('https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1');
        await driver.get('https://passport.yandex.ru/');
        await driver.manage().deleteAllCookies();
        await driver.get('https://beru.ru/');
        assert.fail(err);
      }
      
      //return to initial state
      await driver.manage().deleteAllCookies();
      await driver.get('https://beru.ru/');
      
    });
    
    it('Check the error returns when no password is submitted', async function () {
      await driver.get('https://beru.ru/login?retpath=https%3A%2F%2Fberu.ru%2F%3Fncrnd%3D8255');
      
      try {
        loginField = await driver.wait(until.elementLocated(By.id('passp-field-login')), 10000, 'Failed to locate login field in the DOM');
        await driver.wait(until.elementIsVisible(loginField), 10000, 'Login field is not visible');
        await loginField.sendKeys('testmalakhov2019@yandex.ru', Key.RETURN);

        passField = await driver.wait(until.elementLocated(By.id('passp-field-passwd')), 10000, 'Failed to locate password field in the DOM');
        await driver.wait(until.elementIsVisible(passField), 10000, 'Password field is not visible');
        await passField.sendKeys(Key.RETURN);
      } catch(err) {
        await driver.get('https://beru.ru/');
        assert.fail(err);
      }

      try {
        let curUrl = await driver.getCurrentUrl();
        curUrl.should.contain('passport.yandex.ru','Unexpected redirect occured');
        let errorBlock = await driver.wait(until.elementLocated(By.className('passp-form-field__error')), 2000, 'No error message in the DOM');
        await driver.wait(until.elementIsVisible(errorBlock), 2000, 'Error message is not visible');
        let errorText = await errorBlock.getText();
        errorText.should.equal('Пароль не указан', 'Incorrect error message text');
      }
      catch(err) {
        await driver.get('https://beru.ru/logout?retpath=https%3A%2F%2Fberu.ru%2F%3Floggedin%3D1');
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
