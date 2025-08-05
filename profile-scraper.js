const puppeteer = require('puppeteer');

const numero = process.argv[2];

if (!numero) {
  console.error("Número não fornecido.");
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    userDataDir: './session'
  });

  const page = await browser.newPage();
  await page.goto('https://web.whatsapp.com');

  console.log("Aguardando login via QR Code...");

  await page.waitForSelector('._3Nsgw', { timeout: 0 });
  console.log("Logado!");

  await page.click('div[title="Caixa de texto de pesquisa"]');
  await page.keyboard.type(numero);
  await page.waitForTimeout(3000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  await page.click('header span[title="Ver perfil"]');
  await page.waitForSelector('img[data-testid="contact-photo"]');
  const fotoURL = await page.$eval('img[data-testid="contact-photo"]', el => el.src);

  console.log("FOTO_URL::" + fotoURL);

  await browser.close();
})();
