import puppeteer from 'puppeteer'; // changed from puppeteer-core
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:4173';

const ROUTES = [
  '/',
  '/about',
  '/services',
  '/companies',
  '/why-choose-us',
  '/talent',
  '/contact',
];

async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  const url = `${BASE_URL}${route}`;

  console.log(`🌐 Rendering ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  const html = await page.content();

  let outputPath;
  if (route === '/') {
    outputPath = path.resolve('dist/index.html');
  } else {
    const dir = path.resolve(`dist${route}`);
    fs.mkdirSync(dir, { recursive: true });
    outputPath = path.join(dir, 'index.html');
  }

  fs.writeFileSync(outputPath, html);
  console.log(`✅ Saved ${outputPath}`);

  await page.close();
}

async function prerender() {
  const browser = await puppeteer.launch({
    headless: true,
    // Netlify's build containers need this flag — sandboxing requires
    // permissions CI environments usually don't grant
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const route of ROUTES) {
    await prerenderRoute(browser, route);
  }

  await browser.close();
  console.log('🎉 All routes prerendered');
}

prerender().catch((err) => {
  console.error('❌ Prerender failed:', err);
  process.exit(1);
});