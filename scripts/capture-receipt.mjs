// scripts/capture-receipt.mjs
import puppeteer from 'puppeteer';
import path from 'path';

async function captureReceipt() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();
  await page.goto('https://livine-school-management.vercel.app', { waitUntil: 'networkidle2' });
  
  // Login as Proprietor
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const adminBtn = btns.find(b => b.textContent && b.textContent.includes('Proprietor (Admin)'));
    if (adminBtn) adminBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Navigate to Finance
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const finBtn = btns.find(b => b.textContent && b.textContent.includes('Finance & Accounts'));
    if (finBtn) finBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Click Receipt Button
  await page.evaluate(() => {
    const receiptBtn = document.querySelector('button[title="View Official Receipt"]');
    if (receiptBtn) receiptBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.resolve('docs/screenshots/05_official_fee_receipt.png') });
  console.log('✅ Captured 05_official_fee_receipt.png');
  await browser.close();
}

captureReceipt();
