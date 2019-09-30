const {Builder, By, Key, until} = require('selenium-webdriver');
 
(async () => {
  for (i = 1; i < 2; i++) {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
      await driver.get('https://beru.ru/');

      await driver.findElement(By.className('_3odNv2Dw2n')).click();

      let loginField = await driver.wait(until.elementLocated(By.id('passp-field-login')), 10000);
      await driver.wait(until.elementIsVisible(loginField), 10000);
      await loginField.sendKeys('testmalakhov2019@yandex.ru', Key.RETURN);
      let passField = await driver.wait(until.elementLocated(By.id('passp-field-passwd')), 10000);
      await driver.wait(until.elementIsVisible(passField), 10000);
      await passField.sendKeys('At9632147', Key.RETURN);
      
      try {
        await driver.wait(until.urlContains('https://beru.ru/'), 3000);
      } catch(err) {
        await driver.wait(until.elementLocated(By.className('passp-form passp-enter-phone-form')), 10000);
        await driver.sleep(1500);
        await driver.findElement(By.xpath('//*[text()="Не${nbsp}сейчас"]')).click();
      }
      
      let profileButton = await driver.wait(until.elementLocated(By.className('_3odNv2Dw2n')), 10000);
      await profileButton.click();
      

    } finally {
      await driver.quit();
    }
  }
})();