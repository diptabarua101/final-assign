const { Builder, By, until } = require('selenium-webdriver');

(async function testSauceDemo() {

  let driver = await new Builder().forBrowser('chrome').build();

  try {
    
    await driver.get('https://www.saucedemo.com/');

    
    await driver.findElement(By.id('user-name')).sendKeys('standard_user');
    await driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await driver.findElement(By.id('login-button')).click();

    await driver.findElement(By.id('react-burger-menu-btn')).click();
    await driver.wait(until.elementLocated(By.id('reset_sidebar_link')), 5000).click();
    await driver.findElement(By.id('react-burger-cross-btn')).click();

    
    const addToCartButtons = await driver.findElements(By.css('[id^="add-to-cart"]'));
    await addToCartButtons[0].click();
    await addToCartButtons[1].click();
    await addToCartButtons[2].click();
    await driver.findElement(By.className('shopping_cart_link')).click();


    await driver.findElement(By.id('checkout')).click();
    await driver.findElement(By.id('first-name')).sendKeys('Test');
    await driver.findElement(By.id('last-name')).sendKeys('User');
    await driver.findElement(By.id('postal-code')).sendKeys('12345');
    await driver.findElement(By.id('continue')).click();

    
    const productNames = await driver.findElements(By.className('inventory_item_name'));
    const productPrices = await driver.findElements(By.className('inventory_item_price'));


    let totalCalculatedPrice = 0;
    for (let i = 0; i < productNames.length; i++) {
      const name = await productNames[i].getText();
      const priceText = await productPrices[i].getText();
      const price = parseFloat(priceText.replace('$', ''));
      totalCalculatedPrice += price;
      console.log(`Product ${i + 1}: ${name} - $${price}`);
    }

    // Extract and verify total price displayed on the checkout page
    const displayedTotal = await driver.findElement(By.className('summary_total_label')).getText();
    const displayedTotalPrice = parseFloat(displayedTotal.replace('Total: $', ''));
    if (Math.abs(totalCalculatedPrice - displayedTotalPrice) < 0.01) {
      console.log("Total price verification passed.");
    } else {
      console.log("Total price verification failed.");
    }

    
    await driver.findElement(By.id('finish')).click();

    
    const successMessage = await driver.findElement(By.className('complete-header')).getText();
    if (successMessage.includes('THANK YOU FOR YOUR ORDER')) {
      console.log("Order completion test passed.");
    } else {
      console.log("Order completion test failed.");
    }

    
    await driver.findElement(By.id('react-burger-menu-btn')).click();
    await driver.wait(until.elementLocated(By.id('reset_sidebar_link')), 5000).click();
    await driver.findElement(By.id('logout_sidebar_link')).click();
    console.log("Logout successful.");

  } finally {
    
    await driver.sleep(50000);
    await driver.quit();
  }
})();
