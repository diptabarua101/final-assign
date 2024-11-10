const { Builder, By, until } = require('selenium-webdriver');

(async function testSauceDemo() {
  // Initialize WebDriver
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Open the Sauce Demo site
    await driver.get('https://www.saucedemo.com/');

    // Login with performance_glitch_user
    await driver.findElement(By.id('user-name')).sendKeys('performance_glitch_user');
    await driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await driver.findElement(By.id('login-button')).click();

    // Reset App State
    await driver.findElement(By.id('react-burger-menu-btn')).click();
    await driver.wait(until.elementLocated(By.id('reset_sidebar_link')), 5000).click();
    await driver.findElement(By.id('react-burger-cross-btn')).click();

    // Sort products by name (Z to A)
    await driver.findElement(By.className('product_sort_container')).click();
    await driver.findElement(By.css('option[value="za"]')).click();

    // Add the first product to the cart
    const firstProduct = await driver.findElement(By.css('[id^="add-to-cart"]'));
    const firstProductName = await driver.findElement(By.className('inventory_item_name')).getText();
    const firstProductPriceText = await driver.findElement(By.className('inventory_item_price')).getText();
    const firstProductPrice = parseFloat(firstProductPriceText.replace('$', ''));
    await firstProduct.click();

    // Go to cart
    await driver.findElement(By.className('shopping_cart_link')).click();

    // Proceed to checkout
    await driver.findElement(By.id('checkout')).click();

    // Fill in checkout information
    await driver.findElement(By.id('first-name')).sendKeys('Test');
    await driver.findElement(By.id('last-name')).sendKeys('User');
    await driver.findElement(By.id('postal-code')).sendKeys('12345');
    await driver.findElement(By.id('continue')).click();

    // Verify the product name and total price on the final checkout page
    const checkoutProductName = await driver.findElement(By.className('inventory_item_name')).getText();
    const checkoutProductPriceText = await driver.findElement(By.className('inventory_item_price')).getText();
    const checkoutProductPrice = parseFloat(checkoutProductPriceText.replace('$', ''));

    if (checkoutProductName === firstProductName && checkoutProductPrice === firstProductPrice) {
      console.log("Product name and price verification passed.");
    } else {
      console.log("Product name and price verification failed.");
    }

    // Extract and verify the total price displayed on the checkout page
    const displayedTotalText = await driver.findElement(By.className('summary_total_label')).getText();
    const displayedTotalPrice = parseFloat(displayedTotalText.replace('Total: $', ''));

    if (Math.abs(firstProductPrice - displayedTotalPrice) < 0.01) {
      console.log("Total price verification passed.");
    } else {
      console.log("Total price verification failed.");
    }

    // Finish the purchase journey
    await driver.findElement(By.id('finish')).click();

    // Verify the successful order message
    const successMessage = await driver.findElement(By.className('complete-header')).getText();
    if (successMessage.includes('THANK YOU FOR YOUR ORDER')) {
      console.log("Order completion test passed.");
    } else {
      console.log("Order completion test failed.");
    }

    // Reset App State again and log out
    await driver.findElement(By.id('react-burger-menu-btn')).click();
    await driver.wait(until.elementLocated(By.id('reset_sidebar_link')), 5000).click();
    await driver.findElement(By.id('logout_sidebar_link')).click();
    console.log("Logout successful.");

  } finally {
    // Close the browser after a short delay
    await driver.sleep(15000);
    await driver.quit();
  }
})();
