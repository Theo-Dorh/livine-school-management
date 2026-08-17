// scripts/capture-mobile-screenshots.mjs
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const MOBILE_DIR = path.resolve('docs/screenshots/mobile');

if (!fs.existsSync(MOBILE_DIR)) {
  fs.mkdirSync(MOBILE_DIR, { recursive: true });
}

async function captureMobile() {
  console.log('📱 Launching mobile viewport (390x844 @3x - iPhone 14)...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  });

  const page = await browser.newPage();
  const baseUrl = 'http://localhost:5173'; // or live url

  try {
    // 1. Mobile Login
    console.log('📸 1. Capturing Mobile Login...');
    await page.goto('https://livine-school-management.vercel.app', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(MOBILE_DIR, '01_mobile_login.png') });

    // 2. Mobile Admin Overview
    console.log('📸 2. Capturing Mobile Admin Overview...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const adminBtn = btns.find(b => b.textContent && b.textContent.includes('Admin'));
      if (adminBtn) adminBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(MOBILE_DIR, '02_mobile_admin_overview.png') });

    // 3. Mobile Navigation Drawer Open
    console.log('📸 3. Capturing Mobile Drawer Open...');
    await page.click('.mobile-menu-toggle');
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(MOBILE_DIR, '03_mobile_drawer_menu.png') });

    // Close drawer
    await page.click('.sidebar-mobile-close-btn');
    await new Promise(r => setTimeout(r, 500));

    // 4. Mobile Parent Portal
    console.log('📸 4. Capturing Mobile Parent Portal...');
    await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('.role-pill'));
      const parentPill = pills.find(p => p.textContent && p.textContent.includes('Parent'));
      if (parentPill) parentPill.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(MOBILE_DIR, '04_mobile_parent_portal.png') });

    // 5. Mobile Pay Fees MoMo
    console.log('📸 5. Capturing Mobile Pay Fees (MoMo)...');
    await page.click('.mobile-menu-toggle');
    await new Promise(r => setTimeout(r, 500));
    await page.evaluate(() => {
      const navs = Array.from(document.querySelectorAll('.sidebar-nav-item'));
      const feeNav = navs.find(n => n.textContent && n.textContent.includes('Pay Fees'));
      if (feeNav) feeNav.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(MOBILE_DIR, '05_mobile_parent_momo_payment.png') });

    console.log('🎉 Mobile screenshots captured successfully in docs/screenshots/mobile/ !');
  } catch (err) {
    console.error('❌ Error capturing mobile screenshots:', err);
  } finally {
    await browser.close();
  }
}

captureMobile();
