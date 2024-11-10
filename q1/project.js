const { Builder, By, until } = require('selenium-webdriver');

(async function testSauceDemo() {

  let driver = await new Builder().forBrowser('chrome').build();
  try {

    await driver.get('https://www.saucedemo.com/');
    
    
    await driver.findElement(By.id('user-name')).sendKeys('locked_out_user');
    await driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await driver.findElement(By.id('login-button')).click();


    let errorMessage = await driver.findElement(By.css('[data-test="error"]')).getText();
    if (errorMessage.includes('Sorry, this user has been locked out.')) {
      console.log("Locked-out user test passed.");
    } else {
      console.log("Locked-out user test failed.");
    }

    
    await driver.navigate().refresh();
    await driver.sleep(2000);  

    
    await driver.findElement(By.id('user-name')).sendKeys('standard_user');
    await driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await driver.findElement(By.id('login-button')).click();

    
    await driver.findElement(By.css('[id^="add-to-cart"]')).click();

    
    await driver.findElement(By.className('shopping_cart_link')).click();

    
    await driver.findElement(By.id('checkout')).click();

    
    await driver.findElement(By.id('first-name')).sendKeys('Test');
    await driver.findElement(By.id('last-name')).sendKeys('User');
    await driver.findElement(By.id('postal-code')).sendKeys('12345');
    await driver.findElement(By.id('continue')).click();

    
    await driver.findElement(By.id('finish')).click();

    
    let successMessage = await driver.findElement(By.className('complete-header')).getText();
    if (successMessage.includes('THANK YOU FOR YOUR ORDER')) {
      console.log("Order completion test passed.");
    } else {
      console.log("Order completion test failed.");
    }

  } finally {
    
    await driver.sleep(3000);
    await driver.quit();
  }
})();