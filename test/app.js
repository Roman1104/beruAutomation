const {Builder, By, Key, until} = require('selenium-webdriver');
const mocha = require('mocha');
const chai = require('chai'); 
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;

(async function() {
  let driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().maximize();
  var profileBtn;
  var loginField;
  var passField;
  var profileName;
  describe('Beru.ru authorization', function () {
    this.timeout(0);
    it('Check the page opens successfully.', async function () {
      await driver.get('https://beru.ru/');
      let title = await driver.getTitle();
      title.should.contain('Беру', 'The page title doesn\'t match the expected');
    });

    it('Check the profile/login button name is "Войти в аккаунт"', async () => {
      profileBtn = await driver.findElement(By.className('_3odNv2Dw2n'));
      let btnText = await profileBtn.getText();
      btnText.should.equal('Войти в аккаунт', 'Button title doesn\'t match:');
    });

    it('Click the profile/login button', async () => {
      try {
        await profileBtn.click();
        await driver.wait(until.urlContains('https://passport.yandex.ru/'), 10000);
        loginField = await driver.wait(until.elementLocated(By.id('passp-field-login')), 10000);
        await driver.wait(until.elementIsVisible(loginField), 10000);
      } catch {
        assert.fail('Failed to proceed user authorization');
      }
    });

    it('Enter the login and press Enter', async () => {
      try {
        await loginField.sendKeys('testmalakhov2019@yandex.ru', Key.RETURN);
      
        passField = await driver.wait(until.elementLocated(By.id('passp-field-passwd')), 10000);
        await driver.wait(until.elementIsVisible(passField), 10000);
      } catch {
        assert.fail('Failed to proceed user authorization');
      }
    });

    it('Enter the password and press Enter', async () => {
      try {
        await passField.sendKeys('38tnrWW!QiNRqJv', Key.RETURN);      
        await driver.wait(until.urlContains('https://beru.ru/'), 10000);
      } catch {
        assert.fail('Failed to authorize user');
      }
    });
    
    it('Check the profile button name is "Мой профиль"', async () => {
      profileBtn = await driver.wait(until.elementLocated(By.className('_3odNv2Dw2n')), 10000);
      let btnText = await profileBtn.getText();
      btnText.should.equal('Мой профиль', 'Button title doesn\'t match:');
    });
    
    it('Click profile button and verify profile name', async () => {
      try {
        await profileBtn.click();
        let profileTitle = await driver.wait(until.elementLocated(By.className('_2I5v9t-gmG')), 10000);
        await driver.wait(until.elementIsVisible(profileTitle), 10000);
        profileName = await profileTitle.getText();
      } catch {
        assert.fail('Failed to open profile menu');
      }
      profileName.should.equal('Automation Test Malakhov 2019', 'Profile name doesn\'t match:');
    });
    
    after(async function () {
      await driver.close();
    });
  });
  run();
})();
