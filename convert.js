const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path"); // Ensure path module is included

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let htmlContent = fs.readFileSync("assets/index.html", "utf8");

  // Remove headshot container and download button
  htmlContent = htmlContent.replace(
    /<div class="headshot-container">.*?<\/div>/s,
    ""
  );
  htmlContent = htmlContent.replace(
    /<div class="download-button-container">.*?<\/div>/s,
    ""
  );

  await page.setContent(htmlContent, { waitUntil: "load" });

  const cssContent = fs.readFileSync("assets/styles.css", "utf8");
  await page.addStyleTag({ content: cssContent });

  // Ensure scripts are evaluated correctly
  const scriptPath = path.resolve(__dirname, "assets/scripts.js");
  await page.addScriptTag({ path: scriptPath });

  // Set the PDF options to scale content
  const pdfOptions = {
    path: "assets/resume.pdf",
    format: "A4",
    printBackground: true,
    scale: 0.9, // Adjust the scale to fit content better
  };

  await page.pdf(pdfOptions);

  await browser.close();
})();
