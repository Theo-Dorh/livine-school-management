/**
 * Format numbers as Ghanaian Cedis (GH₵)
 */
export function formatGHS(amount: number): string {
  return 'GH₵ ' + Number(amount || 0).toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Approximate Ghanaian GRA PAYE tax calculation for monthly basic earnings
 */
export function calculateGhanaPayeTax(taxableIncome: number): number {
  let income = Math.max(0, taxableIncome);
  let tax = 0;

  // 2024/2025 GRA Monthly Income Tax Rates:
  // First GH₵ 490 -> 0%
  // Next GH₵ 110 -> 5%
  // Next GH₵ 130 -> 10%
  // Next GH₵ 3,166.67 -> 17.5%
  // Next GH₵ 16,000 -> 25%
  // Next GH₵ 30,520 -> 30%
  // Exceeding GH₵ 50,416.67 -> 35%

  if (income <= 490) return 0;
  income -= 490;

  if (income <= 110) {
    tax += income * 0.05;
    return Math.round(tax * 100) / 100;
  }
  tax += 110 * 0.05;
  income -= 110;

  if (income <= 130) {
    tax += income * 0.10;
    return Math.round(tax * 100) / 100;
  }
  tax += 130 * 0.10;
  income -= 130;

  if (income <= 3166.67) {
    tax += income * 0.175;
    return Math.round(tax * 100) / 100;
  }
  tax += 3166.67 * 0.175;
  income -= 3166.67;

  if (income <= 16000) {
    tax += income * 0.25;
    return Math.round(tax * 100) / 100;
  }
  tax += 16000 * 0.25;
  income -= 16000;

  tax += income * 0.30;
  return Math.round(tax * 100) / 100;
}

/**
 * Full Ghanaian Payroll Breakdown computation
 */
export function computeGhanaPayroll(basic: number, allowances: number = 0) {
  const grossSalary = basic + allowances;
  const ssnitEmployee = Math.round(basic * 0.055 * 100) / 100; // 5.5% Tier 1 SSNIT
  const ssnitEmployer = Math.round(basic * 0.135 * 100) / 100; // 13.5% Employer SSNIT
  const staffWelfare = 50.00; // Standard school welfare levy

  // Taxable income = Gross salary minus employee SSNIT
  const taxableIncome = Math.max(0, grossSalary - ssnitEmployee);
  const graPayeTax = calculateGhanaPayeTax(taxableIncome);

  const totalDeductions = ssnitEmployee + graPayeTax + staffWelfare;
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    grossSalary,
    ssnitEmployee,
    ssnitEmployer,
    graPayeTax,
    staffWelfare,
    totalDeductions,
    netSalary
  };
}
