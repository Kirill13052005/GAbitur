const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const baseUrl = 'https://g-abitur.vercel.app';
  
  if (!fs.existsSync('./deliverables')) fs.mkdirSync('./deliverables');

  for (const variant of ['a', 'b']) {
    console.log(`Генерація для Варіанту ${variant.toUpperCase()}...`);
    const page = await browser.newPage();
    
    // Desktop
    await page.setViewportSize({ width: 1440, height: 1080 });
    await page.goto(`${baseUrl}/?v=${variant}`, { waitUntil: 'networkidle' });
    
    // Скрол до кінця для lazy load
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    
    // Скриншот Hero для порівняння (тільки перший екран)
    await page.screenshot({ path: `./deliverables/hero_v${variant}.png` });
    
    // Повний скриншот Desktop (емуляція PDF)
    await page.pdf({ path: `./deliverables/variant_${variant.toUpperCase()}_desktop.pdf`, printBackground: true, fullPage: true });

    // Mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseUrl}/?v=${variant}`, { waitUntil: 'networkidle' });
    await page.pdf({ path: `./deliverables/variant_${variant.toUpperCase()}_mobile.pdf`, printBackground: true, fullPage: true });

    await page.close();
  }
  
  await browser.close();
  console.log('✅ Готово! Файли у папці /deliverables. Об\'єднайте PNG у графічному редакторі для ab_hero.png та PDF через pdf-lib (або онлайн-сервіс).');
})();