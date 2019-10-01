const {Builder, By, Key, until} = require('selenium-webdriver');
const mocha = require('mocha');
const chai = require('chai'); 

const expect = chai.expect;

(async function() {
  let driver = await new Builder().forBrowser('chrome').build();
  describe('Beru.ru authorization', function () {
    this.timeout(0);
    it('Check the page opens', async function () {
      await driver.get('https://beru.ru/');
    });

    it('Find and click the Log In button', async () => {
      await driver.findElement(By.className('_3odNv2Dw2n')).click();
    });

    it('Enter the credentials and try to log in', async () => {
      let loginField = await driver.wait(until.elementLocated(By.id('passp-field-login')), 10000);
      await driver.wait(until.elementIsVisible(loginField), 10000);
      await loginField.sendKeys('testmalakhov2019@yandex.ru', Key.RETURN);
      
      let passField = await driver.wait(until.elementLocated(By.id('passp-field-passwd')), 10000);
      await driver.wait(until.elementIsVisible(passField), 10000);
      await passField.sendKeys('38tnrWW!QiNRqJv', Key.RETURN);

      try {
        await driver.wait(until.urlContains('https://beru.ru/'), 3000);
      } catch(err) {
        await driver.wait(until.elementLocated(By.className('passp-form passp-enter-phone-form')), 10000);
        await driver.sleep(1500);
        await driver.findElement(By.xpath('//*[text()="Не${nbsp}сейчас"]')).click();
      }
    });
    
    it('Find and click the Log In button', async () => {
      let profileButton = await driver.wait(until.elementLocated(By.className('_3odNv2Dw2n')), 10000);
      await profileButton.click();
    });

  });
  run();
})();
