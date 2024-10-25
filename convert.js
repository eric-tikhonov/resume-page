const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let htmlContent = fs.readFileSync('index.html', 'utf8');

  // Remove headshot container and download button
  htmlContent = htmlContent.replace(/<div class="headshot-container">.*?<\/div>/s, '');
  htmlContent = htmlContent.replace(/<div class="download-button-container">.*?<\/div>/s, '');

  await page.setContent(htmlContent, { waitUntil: 'load' });

  const cssContent = fs.readFileSync('styles.css', 'utf8');
  await page.addStyleTag({ content: cssContent });

  const scriptContent = fs.readFileSync('scripts.js', 'utf8');
  await page.addScriptTag({ content: scriptContent });

  await page.pdf({
    path: 'resume.pdf',
    format: 'A4',
    printBackground: true
  });

  await browser.close();
})();
