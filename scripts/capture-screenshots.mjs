// scripts/capture-screenshots.mjs
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('docs/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Helper to click element by text
async function clickByText(page, text, tag = 'button') {
  return page.evaluate((t, elTag) => {
    const elements = Array.from(document.querySelectorAll(elTag));
    const target = elements.find(el => el.textContent && el.textContent.includes(t));
    if (target) {
      target.click();
      return true;
    }
    return false;
  }, text, tag);
}

async function capture() {
  console.log('🚀 Launching headless browser to capture production screenshots...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();
  const baseUrl = 'https://livine-school-management.vercel.app';

  try {
    // 1. Login Screen
    console.log('📸 1. Capturing Login Portal...');
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    // Click logout if already in dashboard
    const loggedOut = await clickByText(page, 'Logout');
    if (loggedOut) {
      await new Promise(r => setTimeout(r, 1000));
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_login_portal.png') });

    // 2. Log in as Proprietor
    console.log('📸 2. Capturing Proprietor Command Center...');
    await clickByText(page, 'Proprietor (Admin)');
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_proprietor_command_center.png') });

    // 3. Students Directory
    console.log('📸 3. Capturing Student Directory...');
    await clickByText(page, 'People & Staff');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_student_directory.png') });

    // 4. Fees Manager & Debtors
    console.log('📸 4. Capturing Fee Tariffs & Debtors Ledger...');
    await clickByText(page, 'Finance & Accounts');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_fee_tariffs_and_debtors.png') });

    // 5. Official Fee Receipt Modal
    console.log('📸 5. Capturing Official Fee Receipt Voucher...');
    const clickedReceipt = await clickByText(page, 'Receipt');
    if (clickedReceipt) {
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_official_fee_receipt.png') });
      await clickByText(page, 'Close');
      await new Promise(r => setTimeout(r, 500));
    }

    // 6. WhatsApp Reminders Broadcast Center
    console.log('📸 6. Capturing WhatsApp Reminders Broadcast Center...');
    await clickByText(page, 'Broadcast WhatsApp Reminders');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_whatsapp_reminders_broadcast.png') });
    await clickByText(page, 'Close');
    await new Promise(r => setTimeout(r, 500));

    // 7. Staff Payroll & SSNIT/GRA
    console.log('📸 7. Capturing Staff Payroll & SSNIT/GRA...');
    await clickByText(page, 'Staff Payroll & SSNIT');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_staff_payroll_and_ssnit.png') });

    // 8. Official Staff Payslip Modal
    console.log('📸 8. Capturing Official Staff Payslip...');
    await clickByText(page, 'Payslip');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_official_staff_payslip.png') });
    await clickByText(page, 'Close');
    await new Promise(r => setTimeout(r, 500));

    // 9. Curriculum & Subjects
    console.log('📸 9. Capturing Curriculum & Subjects...');
    await clickByText(page, 'Academics');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_curriculum_and_subjects.png') });

    // 10. Switch to Teacher Portal
    console.log('📸 10. Capturing Teacher NaCCA Marks Entry...');
    await clickByText(page, 'Teacher');
    await new Promise(r => setTimeout(r, 1000));
    await clickByText(page, 'Marks Entry');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_teacher_nacca_marks_entry.png') });

    // 11. Teacher Lesson Schemes
    console.log('📸 11. Capturing Teacher Lesson Schemes Upload...');
    await clickByText(page, 'Lesson Content');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_teacher_schemes_of_learning.png') });

    // 12. Switch to Parent Portal
    console.log('📸 12. Capturing Parent Ward Overview...');
    await clickByText(page, 'Parent');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_parent_ward_overview.png') });

    // 13. Parent Terminal Report Card
    console.log('📸 13. Capturing Terminal Report Card...');
    await clickByText(page, 'Terminal Report');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_parent_terminal_report_card.png') });

    // 14. Parent Fee Payment (MoMo / Bank)
    console.log('📸 14. Capturing Parent Fee Payment...');
    await clickByText(page, 'Pay Fees');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_parent_momo_fee_payment.png') });

    // 15. Switch to Student Portal
    console.log('📸 15. Capturing Student Portal...');
    await clickByText(page, 'Student');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15_student_results_and_materials.png') });

    // 16. Whistleblower Safe-Reporting Desk
    console.log('📸 16. Capturing Whistleblower Safe-Reporting Desk...');
    await clickByText(page, 'Confidential Report');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16_whistleblower_safe_reporting.png') });

    console.log('🎉 All 16 production screenshots captured successfully in docs/screenshots/!');
  } catch (err) {
    console.error('❌ Error capturing screenshots:', err);
  } finally {
    await browser.close();
  }
}

capture();
