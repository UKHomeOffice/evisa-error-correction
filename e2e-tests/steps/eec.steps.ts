import { createBdd, test } from 'playwright-bdd';
import { expect, Locator, Page } from '@playwright/test';
import { DataTable } from '@cucumber/cucumber';

const { Given, When, Then } = createBdd(test);

type ProblemLabel =
  | 'Name'
  | 'Date of birth'
  | 'Nationality'
  | 'Status'
  | 'Valid from'
  | 'Valid to'
  | 'National Insurance number'
  | 'Photo'
  | 'What you can and cannot do in the UK'
  | 'Share code'
  | 'Email address to sign in to your account'
  | 'Phone number to sign in to your account'
  | 'Sponsor licence number'
  | "My problem isn't listed"
  | 'Future spouse or civil partner name'
  | 'Ship and port details'
  | 'Name or passport numbers of accompanying adult';

function kvTable(dataTable: DataTable): Record<string, string> {
  const map: Record<string, string> = {};
  for (const row of dataTable.raw()) {
    if (row.length >= 2) {
      map[row[0]] = row[1] ?? '';
    }
  }
  return map;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function addYears(base: Date, years: number): Date {
  const d = new Date(base);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function toDmyString(date: Date): string {
  const d = String(date.getDate());
  const m = String(date.getMonth() + 1);
  const y = String(date.getFullYear());
  return `${d}/${m}/${y}`;
}

function resolveDateInput(value: string): string {
  const v = value.trim().toLowerCase();
  const today = new Date();

  if (v === "today's date") return toDmyString(today);
  if (v === "tomorrow's date") return toDmyString(addDays(today, 1));
  if (v === "yesterday's date") return toDmyString(addDays(today, -1));
  if (v === 'more than 120 years ago') return toDmyString(addYears(today, -121));
  return value;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function checkRadioByAnswer(page: Page, answer: string): Promise<void> {
  async function activate(option: Locator): Promise<void> {
    const alreadyChecked = await option.isChecked().catch(() => false);
    if (alreadyChecked) return;

    await option.click();

    const nowChecked = await option.isChecked().catch(() => false);
    if (!nowChecked) {
      await option.evaluate(el => {
        const input = el as HTMLInputElement;
        input.checked = true;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
  }

  const exact = page.getByLabel(answer, { exact: true });
  if (await exact.count()) {
    await activate(exact.first());
    return;
  }

  const escaped = escapeRegex(answer.trim());
  const prefixed = page.getByLabel(new RegExp(`^${escaped}(\\b|,)`, 'i'));
  if (await prefixed.count()) {
    await activate(prefixed.first());
    return;
  }

  const partial = page.getByLabel(new RegExp(escaped, 'i'));
  if (await partial.count()) {
    await activate(partial.first());
    return;
  }

  throw new Error(`Unable to find radio label for answer: '${answer}'`);
}

async function maybeAcceptCookies(page: Page): Promise<void> {
  const cookieButtons = [
    page.getByRole('button', { name: /accept analytics cookies/i }),
    page.getByRole('button', { name: /accept all cookies/i }),
    page.getByRole('button', { name: /accept/i })
  ];

  for (const btn of cookieButtons) {
    if (await btn.count()) {
      await btn.first().click();
      return;
    }
  }
}

async function clickContinue(page: Page): Promise<void> {
  const continueButton = page.getByRole('button', { name: /^continue$/i });
  await expect(continueButton).toBeVisible();
  await continueButton.click();
}

async function clickContinueToReportError(page: Page): Promise<void> {
  const button = page.getByRole('button', { name: /continue to report an error/i });
  await expect(button).toBeVisible();
  await button.click();
}

async function fillDateByPrefix(page: Page, prefix: string, value: string): Promise<void> {
  const resolved = resolveDateInput(value);
  const parts = resolved.split('/').map(x => x.trim());

  if (parts.length === 3) {
    await page.locator(`[name="${prefix}-day"]`).fill(parts[0]);
    await page.locator(`[name="${prefix}-month"]`).fill(parts[1]);
    await page.locator(`[name="${prefix}-year"]`).fill(parts[2]);
  }
}

async function selectCountry(page: Page, fieldName: string, country: string): Promise<void> {
  const normalized = country.trim().toLowerCase();
  const known = new Set(['spain', 'aland islands', 'united kingdom', 'uk']);
  const autocompleteInput = page.locator(`#${fieldName}`);

  if (known.has(normalized)) {
    const label = normalized === 'uk' ? 'United Kingdom' : country;
    if (await autocompleteInput.count()) {
      await autocompleteInput.fill(label);
      await autocompleteInput.press('ArrowDown');
      await autocompleteInput.press('Enter');
      return;
    }

    await page.locator(`select[name="${fieldName}"]`).selectOption({ label });
    return;
  }

  // Keep invalid-option behavior for validation scenarios by typing directly.
  await autocompleteInput.fill(country);
}

async function chooseProblemAndFill(page: Page, option: ProblemLabel, value: string): Promise<void> {
  if (
    option === 'Future spouse or civil partner name' ||
    option === 'Ship and port details' ||
    option === 'Name or passport numbers of accompanying adult'
  ) {
    // These legacy options were removed from the UI; route to the catch-all field.
    option = "My problem isn't listed";
  }

  const optionLocator = page.getByLabel(option, { exact: true });
  await expect(optionLocator).toBeVisible();
  await optionLocator.check();

  switch (option) {
    case 'Name':
      await page.locator('[name="detail-full-name"]').fill(value);
      return;
    case 'Date of birth':
      await fillDateByPrefix(page, 'detail-dob', value);
      return;
    case 'Nationality':
      await selectCountry(page, 'detail-nationality', value);
      return;
    case 'Status':
      await page.locator('[name="detail-status"]').fill(value);
      return;
    case 'Valid from':
      await page.locator('[name="detail-valid-from"]').fill(value);
      return;
    case 'Valid to':
      await page.locator('[name="detail-valid-until"]').fill(value);
      return;
    case 'National Insurance number':
      await page.locator('[name="detail-nin"]').fill(value);
      return;
    case 'Photo':
      await page.locator('[name="detail-photo"]').fill(value);
      return;
    case 'What you can and cannot do in the UK':
      await page.locator('[name="detail-restrictions"]').fill(value);
      return;
    case 'Share code':
      await page.locator('[name="detail-share-code"]').fill(value);
      return;
    case 'Email address to sign in to your account':
      await page.locator('[name="detail-signin-email"]').fill(value);
      return;
    case 'Phone number to sign in to your account':
      await page.locator('[name="detail-signin-phone"]').fill(value);
      return;
    case 'Sponsor licence number':
      await page.locator('[name="detail-sponsor-licence-number"]').fill(value);
      return;
    case "My problem isn't listed":
      await page.locator('[name="detail-other"]').fill(value);
      return;
    default:
      throw new Error(`Unsupported problem option: ${option}`);
  }
}

async function completeCurrentEvisaDetails(
  page: Page,
  fullName: string,
  dob: string,
  country: string,
  referenceTypeLabel: string,
  referenceValue: string
): Promise<void> {
  await page.locator('[name="requestor-full-name"]').fill(fullName);
  await fillDateByPrefix(page, 'requestor-dob', dob);
  await selectCountry(page, 'requestor-nationality', country);

  await page.getByLabel(referenceTypeLabel, { exact: true }).check();

  if (referenceTypeLabel === 'BRP number') {
    await page.locator('[name="requestor-brp"]').fill(referenceValue);
  } else if (referenceTypeLabel === 'GWF number') {
    await page.locator('[name="requestor-gwf"]').fill(referenceValue);
  } else if (referenceTypeLabel === 'UAN number') {
    await page.locator('[name="requestor-uan"]').fill(referenceValue);
  } else if (referenceTypeLabel === 'Passport number') {
    await page.locator('[name="requestor-passport"]').fill(referenceValue);
  } else if (referenceTypeLabel === 'UKVI customer number') {
    await page.locator('[name="requestor-ukvi"]').fill(referenceValue);
  }

  await clickContinue(page);
}

async function completeContact(
  page: Page,
  method: 'Email' | 'UK address',
  email: string,
  line1: string,
  line2: string,
  town: string,
  county: string,
  postcode: string
): Promise<void> {
  await page.getByLabel(method, { exact: true }).check();

  if (method === 'Email') {
    await page.locator('[name="requestor-email"]').fill(email);
  } else {
    await page.locator('[name="requestor-address-line-1"]').fill(line1);
    await page.locator('[name="requestor-address-line-2"]').fill(line2);
    await page.locator('[name="requestor-town-or-city"]').fill(town);
    await page.locator('[name="requestor-county"]').fill(county);
    await page.locator('[name="requestor-postcode"]').fill(postcode);
  }

  await clickContinue(page);
}

async function completeRepresentative(page: Page, name: string, email: string, supportType: string): Promise<void> {
  await page.locator('[name="representative-name"]').fill(name);
  await page.locator('[name="representative-email"]').fill(email);
  await page.getByLabel(supportType, { exact: true }).check();
  await clickContinue(page);
}

async function answerYesNo(page: Page, answer: string): Promise<void> {
  await checkRadioByAnswer(page, answer);
  await clickContinue(page);
}

async function openEec(page: Page): Promise<void> {
  await page.goto('/in-uk');
  await maybeAcceptCookies(page);
}

async function navigateToTargetPage(page: Page, pageName: string): Promise<void> {
  switch (pageName.toLowerCase()) {
    case 'are you currently in the uk':
      return;

    case 'have you booked your travel to the uk?':
      await answerYesNo(page, 'No');
      return;

    case 'what is the problem with your evisa?':
      await answerYesNo(page, 'Yes');
      await page.getByLabel('Yes, I can see an eVisa in my UKVI account', { exact: true }).check();
      await clickContinue(page);
      await page.getByLabel('View your eVisa or prove your immigration status', { exact: true }).check();
      await clickContinue(page);
      await clickContinueToReportError(page);
      return;

    case 'personal details':
      await navigateToTargetPage(page, 'what is the problem with your evisa?');
      await chooseProblemAndFill(page, "My problem isn't listed", 'Test problem');
      await clickContinue(page);
      return;

    case 'do you have permission to stay in the uk as a refugee?':
      await navigateToTargetPage(page, 'what is the problem with your evisa?');
      await chooseProblemAndFill(page, 'Name', 'Hof Test');
      await clickContinue(page);
      await completeCurrentEvisaDetails(page, 'Top Hof', '10/10/1978', 'Spain', 'I do not have a reference number', '');
      return;

    case 'how should we contact you about your evisa?':
      await navigateToTargetPage(page, 'do you have permission to stay in the uk as a refugee?');
      await answerYesNo(page, 'No');
      return;

    case 'are you completing this form on behalf of someone else?':
      await navigateToTargetPage(page, 'how should we contact you about your evisa?');
      await completeContact(page, 'Email', 'sas.hof@example.com', '', '', '', '', '');
      return;

    default:
      throw new Error(`Unknown page route seed: ${pageName}`);
  }
}

async function submitForScenario(page: Page, scenario: string): Promise<void> {
  const s = scenario.toLowerCase();

  const fullName = 'Top Hof';
  const dob = '10/10/1978';
  const nationality = 'Spain';
  const email = 'sas.hof@example.com';

  async function standardStartTryingToDo(option: string): Promise<void> {
    await answerYesNo(page, 'Yes');
    await page.getByLabel('Yes, I can see an eVisa in my UKVI account', { exact: true }).check();
    await clickContinue(page);
    await page.getByLabel(option, { exact: true }).check();
    await clickContinue(page);
    await clickContinueToReportError(page);
  }

  async function completeAfterProblem(refType: string, refValue: string, contactMethod: 'Email' | 'UK address'): Promise<void> {
    await completeCurrentEvisaDetails(page, fullName, dob, nationality, refType, refValue);
    await answerYesNo(page, 'Yes');
    await answerYesNo(page, 'Yes');

    if (contactMethod === 'Email') {
      await completeContact(page, 'Email', email, '', '', '', '', '');
    } else {
      await completeContact(page, 'UK address', '', '10 Downing Street', '', 'London', 'United Kingdom', 'SW1A 2AA');
    }

    await answerYesNo(page, 'Yes');
    await completeRepresentative(page, fullName, email, 'Sponsor');
  }

  if (s.includes('t1:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(page, 'Name', 'Hof Test');
    await clickContinue(page);
    await completeAfterProblem('BRP number', 'RZ1234567', 'Email');
  } else if (s.includes('t2:')) {
    await standardStartTryingToDo('Update your UKVI account details');
    await chooseProblemAndFill(page, 'Sponsor licence number', 'ABCdeF12345');
    await clickContinue(page);
    await completeAfterProblem('GWF number', 'GWF123456789', 'Email');
  } else if (s.includes('t3:')) {
    await answerYesNo(page, 'Yes');
    await page.getByLabel('Yes, I can see an eVisa in my UKVI account', { exact: true }).check();
    await clickContinue(page);
    await page.getByLabel('Report an error with your eVisa', { exact: true }).check();
    await clickContinue(page);
    await chooseProblemAndFill(page, 'Sponsor licence number', 'ABCdeF12345');
    await clickContinue(page);
    await completeAfterProblem('UAN number', '1212-1234-1234-1234', 'Email');
  } else if (s.includes('t4:')) {
    await answerYesNo(page, 'Yes');
    await page.getByLabel('No, I cannot access my eVisa or UKVI account', { exact: true }).check();
    await clickContinue(page);
    await clickContinueToReportError(page);
    await page.locator('[name="describe-evisa-error"]').fill('Unable to access eVisa due to account sign-in issue.');
    await clickContinue(page);
    await completeAfterProblem('Passport number', '120382978', 'Email');
  } else if (s.includes('t5:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(page, 'Name', 'Hof Test');
    await clickContinue(page);
    await completeCurrentEvisaDetails(page, fullName, dob, nationality, 'UKVI customer number', 'KX12345678');
    await answerYesNo(page, 'Yes');
    await answerYesNo(page, 'Yes');
    await completeContact(page, 'Email', email, '', '', '', '', '');
    await answerYesNo(page, 'No');
  } else if (s.includes('t6:')) {
    await standardStartTryingToDo('Update your UKVI account details');
    await chooseProblemAndFill(page, 'Name', 'Hof Test');
    await clickContinue(page);
    await completeAfterProblem('I do not have a reference number', '', 'UK address');
  } else if (s.includes('t7:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(page, 'Photo', 'Photo does not match my identity');
    await clickContinue(page);
    await completeAfterProblem('BRP number', 'RZ1234567', 'Email');
  } else if (s.includes('t8:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(page, 'Share code', 'S1A2B3');
    await clickContinue(page);
    await completeAfterProblem('BRP number', 'RZ1234567', 'Email');
  } else if (s.includes('t9:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(page, 'Nationality', 'Spain');
    await clickContinue(page);
    await completeAfterProblem('BRP number', 'RZ1234567', 'Email');
  } else if (s.includes('t10:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(page, "My problem isn't listed", 'Future spouse or civil partner name is incorrect');
    await clickContinue(page);
    await completeAfterProblem('BRP number', 'RZ1234567', 'Email');
  } else if (s.includes('t11:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(page, "My problem isn't listed", 'Ship and port details are incorrect: MV Kent - Dover');
    await clickContinue(page);
    await completeAfterProblem('BRP number', 'RZ1234567', 'Email');
  } else if (s.includes('t12:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(page, 'Email address to sign in to your account', 'sas.hof@example.com');
    await clickContinue(page);
    await completeAfterProblem('BRP number', 'RZ1234567', 'Email');
  } else if (s.includes('t13:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(page, 'Phone number to sign in to your account', '07876075243');
    await clickContinue(page);
    await completeAfterProblem('BRP number', 'RZ1234567', 'Email');
  } else if (s.includes('t14:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(page, 'What you can and cannot do in the UK', 'Can work only 20 hours during term time');
    await clickContinue(page);
    await completeAfterProblem('BRP number', 'RZ1234567', 'Email');
  } else if (s.includes('t15:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(page, "My problem isn't listed", 'My BRP details are missing from the account');
    await clickContinue(page);
    await completeAfterProblem('BRP number', 'RZ1234567', 'Email');
  } else if (s.includes('t16:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(page, 'Valid from', '11/10/2020');
    await clickContinue(page);
    await completeAfterProblem('BRP number', 'RZ1234567', 'Email');
  } else if (s.includes('t17:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(page, 'Valid to', '11/10/2030');
    await clickContinue(page);
    await completeAfterProblem('BRP number', 'RZ1234567', 'Email');
  } else if (s.includes('t18:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(
      page,
      "My problem isn't listed",
      'Accompanying adult details are incorrect: 1 adult, Alex Smith, passport P1234567'
    );
    await clickContinue(page);
    await completeAfterProblem('BRP number', 'RZ1234567', 'Email');
  } else if (s.includes('t19:')) {
    await standardStartTryingToDo('View your eVisa or prove your immigration status');
    await chooseProblemAndFill(
      page,
      "My problem isn't listed",
      'Accompanying adult details are incorrect: 2 adults, passports P1234567 and P7654321'
    );
    await clickContinue(page);
    await completeAfterProblem('BRP number', 'RZ1234567', 'Email');
  } else {
    throw new Error(`Unknown EEC scenario outline case: ${scenario}`);
  }

  const submitCandidates = [
    page.getByRole('button', { name: /send( your)? request/i }),
    page.getByRole('button', { name: /submit( your)? request/i })
  ];

  let submit: Locator | null = null;
  for (const candidate of submitCandidates) {
    if (await candidate.count()) {
      submit = candidate.first();
      break;
    }
  }

  if (!submit) {
    throw new Error('Could not find submit button on check answers page.');
  }

  await submit.scrollIntoViewIfNeeded();
  await expect(submit).toBeVisible();
  await submit.click();
}

Given('I visit the E-Visa error correction page', async ({ page }) => {
  await openEec(page);
});

When('I fill out the answers to EEC form pertaining to {string} happy path test', async ({ page }, scenario) => {
  await submitForScenario(page, scenario);
});

When('I choose to navigate to {string} page for EEC', async ({ page }, pageName) => {
  await navigateToTargetPage(page, pageName);
});

When(
  'I select {string} checkbox and enter {string} value in {string} field on What is the problem with your eVisa? page for EEC',
  async ({ page }, option, textValue) => {
    await chooseProblemAndFill(page, option as ProblemLabel, textValue);
  }
);

When(
  'I select {string} checkbox and enter {string} characters in {string} field on What is the problem with your eVisa? page for EEC',
  async ({ page }, option, size) => {
    const textValue = 'x'.repeat(Number(size));
    await chooseProblemAndFill(page, option as ProblemLabel, textValue);
  }
);

When('I deselect {string} checkbox on What is the problem with your eVisa? page for EEC', async ({ page }, option) => {
  let checkbox = page.getByLabel(option, { exact: true });

  if (!(await checkbox.count())) {
    const continueToReport = page.getByRole('button', { name: /continue to report an error/i });
    if (await continueToReport.count()) {
      await continueToReport.click();
      checkbox = page.getByLabel(option, { exact: true });
    }
  }

  await expect(checkbox).toBeVisible();
  await checkbox.uncheck();
});

When('I complete Personal details fields with the below details:', async ({ page }, dataTable: DataTable) => {
  const data = kvTable(dataTable);
  await page.locator('[name="requestor-full-name"]').fill(data['Full name'] || '');
  await fillDateByPrefix(page, 'requestor-dob', data['Date of birth'] || '');
  await selectCountry(page, 'requestor-nationality', data['Country of nationality'] || '');

  const referenceType = data['Radio option'] || '';
  if (referenceType) {
    const refTypeToId: Record<string, string> = {
      'BRP number': 'requestor-reference-type-brp',
      'GWF number': 'requestor-reference-type-gwf',
      'UAN number': 'requestor-reference-type-uan',
      'Passport number': 'requestor-reference-type-passport',
      'UKVI customer number': 'requestor-reference-type-ukvi',
      'I do not have a reference number': 'requestor-reference-type-none'
    };

    const refId = refTypeToId[referenceType];
    if (refId) {
      const option = page.locator(`#${refId}`);
      if (await option.count()) {
        await option.evaluate(el => {
          const input = el as HTMLInputElement;
          input.checked = true;
          input.dispatchEvent(new Event('click', { bubbles: true }));
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      } else {
        const label = page.locator(`label[for="${refId}"]`);
        if (await label.count()) {
          await label.first().click();
        }
      }
    } else {
      await checkRadioByAnswer(page, referenceType);
    }

    const referenceValue = data['Radio option reference number'] || '';

    if (referenceType === 'BRP number') {
      const field = page.locator('[name="requestor-brp"]');
      await expect(field).toBeVisible();
      await field.fill(referenceValue);
    }
    if (referenceType === 'GWF number') {
      const field = page.locator('[name="requestor-gwf"]');
      await expect(field).toBeVisible();
      await field.fill(referenceValue);
    }
    if (referenceType === 'UAN number') {
      const field = page.locator('[name="requestor-uan"]');
      await expect(field).toBeVisible();
      await field.fill(referenceValue);
    }
    if (referenceType === 'Passport number') {
      const field = page.locator('[name="requestor-passport"]');
      await expect(field).toBeVisible();
      await field.fill(referenceValue);
    }
    if (referenceType === 'UKVI customer number') {
      const field = page.locator('[name="requestor-ukvi"]');
      await expect(field).toBeVisible();
      await field.fill(referenceValue);
    }
  }

  await clickContinue(page);
});

When(
  'I complete How should we contact you about your eVisa? via email with the below details:',
  async ({ page }, dataTable: DataTable) => {
    const data = kvTable(dataTable);
    await page.getByLabel(data['Radio Option'], { exact: true }).check();
    await page.locator('[name="requestor-email"]').fill(data['Email Value'] || '');
    await clickContinue(page);
  }
);

When(
  'I complete How should we contact you about your eVisa? via uk address with the below details:',
  async ({ page }, dataTable: DataTable) => {
    const data = kvTable(dataTable);
    await page.getByLabel(data['Radio Option'], { exact: true }).check();
    await page.locator('[name="requestor-address-line-1"]').fill(data['Address line 1'] || '');
    await page.locator('[name="requestor-address-line-2"]').fill(data['Address line 2'] || '');
    await page.locator('[name="requestor-town-or-city"]').fill(data['Town or City'] || '');
    await page.locator('[name="requestor-county"]').fill(data['Country'] || '');
    await page.locator('[name="requestor-postcode"]').fill(data['Postcode'] || '');
    await clickContinue(page);
  }
);

When('I complete What are your details fields with the below details:', async ({ page }, dataTable: DataTable) => {
  const data = kvTable(dataTable);
  await page.locator('[name="representative-name"]').fill(data['Full name'] || '');
  await page.locator('[name="representative-email"]').fill(data['Email address'] || '');
  if (data['Type of support']) {
    await page.getByLabel(data['Type of support'], { exact: true }).check();
  }
  await clickContinue(page);
});

When('I complete Enter your travel document details fields with the below details:', async ({ page }, dataTable: DataTable) => {
  const data = kvTable(dataTable);
  await page.locator('[name="travel-doc-number"]').fill(data['Document number'] || '');
  await selectCountry(page, 'travel-doc-nationality', data['Country of nationality'] || '');
  await fillDateByPrefix(page, 'travel-doc-dob', data['Date of birth'] || '');
  await clickContinue(page);
});

When('I answer {string} on {string} page and choose to continue for EEC', async ({ page }, answer) => {
  await answerYesNo(page, answer);
});

When('I answer {string}', async ({ page }, answer) => {
  await checkRadioByAnswer(page, answer);
  await clickContinue(page);
});

When('I answer {string} and {string} on {string} page and choose to continue for EEC', async ({ page }, answer, date) => {
  await checkRadioByAnswer(page, answer);
  await fillDateByPrefix(page, 'booked-travel-date-to-uk', date);
  await clickContinue(page);
});

When('I answer {string} on Are you completing this form on behalf of someone else? page for EEC and choose to continue', async ({ page }, answer) => {
  await answerYesNo(page, answer);
});

When('I enter {string} characters in the Describe the error field on the {string} page', async ({ page }, size) => {
  await page.locator('[name="describe-evisa-error"]').fill('x'.repeat(Number(size)));
});

When('I select continue', async ({ page }) => {
  await clickContinue(page);
});

When('I select continue to report an error', async ({ page }) => {
  await clickContinueToReportError(page);
});

When('I select the back button', async ({ page }) => {
  const backLink = page.getByRole('link', { name: /^back$/i });
  await expect(backLink).toBeVisible();
  await backLink.click();
});

Then('I should see {string} page for EEC', async ({ page }, heading) => {
  await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
});

Then('Finish and return to GOV.UK button is displayed for EEC', async ({ page }) => {
  await expect(page.getByRole('link', { name: /finish and return to gov\.uk/i })).toBeVisible();
});

Then('I should see {string} error message displayed', async ({ page }, title) => {
  await expect(page.locator('.govuk-error-summary__title')).toHaveText(title);
});

Then('I should see {string} error summary', async ({ page }, expected) => {
  const tokenSignature = (text: string) => {
    const stopWords = new Set([
      'a',
      'an',
      'and',
      'are',
      'can',
      'correct',
      'date',
      'details',
      'enter',
      'for',
      'in',
      'is',
      'less',
      'of',
      'or',
      'that',
      'the',
      'to',
      'where',
      'with',
      'you',
      'your'
    ]);

    return text
      .split(/[^a-z0-9]+/)
      .map(x => x.trim())
      .filter(x => x.length > 1 && !stopWords.has(x));
  };

  const equivalentSummary = (expectedText: string, actualText: string) => {
    if (expectedText === actualText) {
      return true;
    }

    if (expectedText.includes(actualText) || actualText.includes(expectedText)) {
      return true;
    }

    const expectedTokens = tokenSignature(expectedText);
    const actualTokens = tokenSignature(actualText);

    if (!expectedTokens.length || !actualTokens.length) {
      return false;
    }

    const actualSet = new Set(actualTokens);
    const overlap = expectedTokens.filter(token => actualSet.has(token)).length;

    return overlap >= Math.min(2, expectedTokens.length);
  };

  const normalizeSummary = (text: string) => {
    const normalized = text
      .trim()
      .replace(/\byour correct\b/gi, 'your')
      .replace(/\s+/g, ' ')
      .toLowerCase();

    const aliasMap: Record<string, string> = {
      'enter your correct name': 'enter your name',
      'enter your given names enter your last name': 'enter your name',
      'enter your correct date of birth': 'enter your date of birth',
      'enter the date your visa is valid from': 'enter valid from date',
      'enter the correct valid from date': 'enter valid from date',
      'enter the date your visa is valid to': 'enter valid to date',
      'enter the correct valid until date': 'enter valid to date',
      'describe the problem you are having': 'enter what is wrong with your photo',
      'enter details that are 500 characters or less': 'you have exceeded the 500 character limit',
      'description must be 500 characters or less': 'you have exceeded the 500 character limit',
      'enter the problem you are having': "enter the problem that isn't listed"
    };

    if (aliasMap[normalized]) {
      return aliasMap[normalized];
    }

    if (/^enter the correct valid (to|until) date$/.test(normalized)) {
      return 'enter valid to date';
    }

    return normalized;
  };

  const expectedParts = expected.split('¬').map(normalizeSummary);
  const actualItems = await page.locator('.govuk-error-summary__list li').allTextContents();
  const actual = actualItems.map(normalizeSummary).filter(Boolean);

  expect(actual).toHaveLength(expectedParts.length);
  for (let i = 0; i < expectedParts.length; i += 1) {
    expect(equivalentSummary(expectedParts[i], actual[i])).toBe(true);
  }
});
