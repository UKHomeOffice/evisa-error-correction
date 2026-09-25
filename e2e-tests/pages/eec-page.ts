import { expect, Locator, Page } from '@playwright/test';
import { ConstantsLib as c } from '../utility-helper/constants-lib';
import { EecScenarioData, ProblemCorrection } from '../test-data/eec-scenarios';

export class EecPage {
  readonly page: Page;
  private readonly problemOrder = [
    'name',
    'date of birth',
    'nationality',
    'status',
    'valid from',
    'valid to',
    'national insurance number',
    'sponsor licence number',
    'photo',
    'future spouse or civil partner name',
    'name or passport numbers of accompanying adult',
    'ship and port details',
    'must leave uk via (flight number and airport)',
    'what you can and cannot do in the uk',
    'share code',
    'email address to sign in to your account',
    'phone number to sign in to your account',
    'my problem is not listed'
  ];

  constructor(page: Page) {
    this.page = page;
  }

  get headerText(): Locator {
    return this.page.locator('h1').first();
  }

  async navigateToUrl(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    const acceptCookies = this.page.locator('#accept-cookies-button');
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }
    const startNow = this.page.getByRole('link', { name: /start now/i });
    if (await startNow.isVisible()) {
      await startNow.click();
    }
  }

  async completeScenario(data: EecScenarioData): Promise<void> {
    await this.selectRadio('Yes');
    await this.continue();
    await this.selectRadio(data.accessingEvisa);
    await this.continue();

    if (data.accessingEvisa.startsWith('No,')) {
      await this.continueToReportAnError();
      await this.fillByLabel('Describe the error', data.moreDetails || 'There is a problem with my eVisa');
      await this.continue();
    } else {
      await this.selectRadio(data.tryingToDo || 'View your eVisa or prove your immigration status');
      await this.continue();
      await this.continueToReportAnError();
      await this.completeProblemCorrections(data.problems);
    }

    await this.completeCurrentEvisaDetails(data.referenceType, data.referenceValue);
    await this.selectRadio('Yes');
    await this.continue();
    await this.selectRadio('Yes');
    await this.continue();
    await this.completeContactDetails(data.contactMethod);
    await this.selectRadio(data.completingForSomeoneElse ? 'Yes' : 'No');
    await this.continue();

    if (data.completingForSomeoneElse) {
      await this.fillByLabel('Full name', c.FULL_NAME);
      await this.fillByLabel('Email address', c.SAS_HOF_EMAIL);
      await this.selectRadio(c.REPRESENTATIVE_TYPE);
      await this.continue();
    }

    if (data.deselectProblemAfterEdit) {
      await this.deselectProblemAfterEdit(data.deselectProblemAfterEdit);
    }

    await this.page.getByRole('button', { name: 'Accept and send' }).click();
  }

  async expectRequestSent(expectedHeader: string): Promise<void> {
    await expect(this.headerText).toHaveText(expectedHeader);
  }

  async expectFinishAndReturnButton(): Promise<void> {
    await expect(this.page.getByRole('link', { name: 'Finish and return to GOV.UK' })).toBeVisible();
  }

  async clickContinue(): Promise<void> {
    await this.continue();
  }

  async clickBack(): Promise<void> {
    await this.page.getByRole('link', { name: 'Back' }).click();
  }

  async expectErrorMessageDisplayed(): Promise<void> {
    await expect(this.page.locator('#error-summary-title')).toHaveText('There is a problem');
  }

  async expectErrorSummary(expectedErrorSummary: string): Promise<void> {
    const expectedErrors = expectedErrorSummary.split('¬');
    const actualText = await this.page.locator('.govuk-error-summary__list').textContent();
    const actualErrors = (actualText || '')
      .replaceAll('\t', '')
      .trim()
      .split(/\r?\n/)
      .map(error => error.trim())
      .filter(Boolean);

    expect(actualErrors).toEqual(expectedErrors);
  }

  async navigateToValidationPage(pageName: string): Promise<void> {
    switch (pageName.toLowerCase()) {
      case 'are you currently in the uk':
        break;
      case 'have you booked your travel to the uk?':
        await this.selectRadio('No');
        await this.continue();
        break;
      case 'what is the problem with your evisa?':
        await this.navigateToProblemPage();
        break;
      case 'personal details':
        await this.navigateToCurrentEvisaDetailsPage();
        break;
      case 'do you have permission to stay in the uk as a refugee?':
        await this.navigateToRefugeePage();
        break;
      case 'how should we contact you about your evisa?':
        await this.navigateToContactPage();
        break;
      case 'are you completing this form on behalf of someone else?':
        await this.navigateToSomeoneElsePage();
        break;
      default:
        throw new Error(`Unsupported EEC validation navigation target: ${pageName}`);
    }
  }

  async answerCurrentPage(answer: string): Promise<void> {
    await this.selectRadio(answer);
    await this.continue();
  }

  async answerCannotAccessEvisa(answer: string): Promise<void> {
    await this.selectRadio(answer);
    await this.continue();
  }

  async answerBookedTravel(answer: string, dateValue: string): Promise<void> {
    await this.selectRadio(answer === 'Yes' ? 'Yes, I have booked my travel' : 'No, I have not booked my travel');
    if (answer === 'Yes' && dateValue.trim()) {
      await this.fillDate('booked-travel-date-to-uk', this.resolveDate(dateValue));
    }
    await this.continue();
  }

  async completeTextareaByLabel(label: string, value: string): Promise<void> {
    await this.fillByLabel(label, value);
  }

  async completeTravelDocumentDetails(documentNumber: string, nationality: string, dateOfBirth: string): Promise<void> {
    await this.fillByLabel('Document number', documentNumber);
    if (nationality) {
      await this.selectAutocomplete('Country of nationality', nationality);
    }
    if (dateOfBirth) {
      await this.fillDate('travel-doc-dob', this.resolveDate(dateOfBirth));
    }
    await this.continue();
  }

  async selectProblemCheckboxAndEnter(problemLabel: string, value: string, valueIsLength = false): Promise<void> {
    const normalizedLabel = this.normalizeProblemLabel(problemLabel);
    const checkbox = this.page.getByRole('checkbox', { name: normalizedLabel, exact: true });
    if (!await checkbox.isChecked()) {
      await checkbox.check();
    }
    await this.continue();
    await this.completeProblemCorrection({
      label: normalizedLabel,
      value: valueIsLength ? 'a'.repeat(Number(value)) : value
    });
  }

  async deselectProblemCheckbox(problemLabel: string): Promise<void> {
    await this.page.getByRole('checkbox', { name: this.normalizeProblemLabel(problemLabel), exact: true }).uncheck();
  }

  async completeCurrentEvisaDetailsForValidation(
    fullName: string,
    dateOfBirth: string,
    nationality: string,
    referenceType: string,
    referenceValue: string
  ): Promise<void> {
    await this.page.locator('#requestor-full-name').fill(fullName);
    if (dateOfBirth) {
      await this.fillDate('requestor-dob', this.resolveDate(dateOfBirth));
    }
    if (nationality) {
      await this.selectAutocomplete('Country of nationality', nationality);
    }
    if (referenceType) {
      await this.selectRadio(referenceType);
    }
    if (referenceValue) {
      await this.fillReferenceValue(referenceType, referenceValue);
    }
    await this.continue();
  }

  async completeEmailContact(email: string): Promise<void> {
    await this.selectRadio('Email');
    if (email) {
      await this.fillByLabel('Email address', email);
    }
    await this.continue();
  }

  async completeUkAddressContact(addressLine1: string, addressLine2: string, townOrCity: string, postcode: string): Promise<void> {
    await this.selectRadio('UK address');
    if (addressLine1) {
      await this.fillByLabel('Address line 1', addressLine1);
    }
    if (addressLine2) {
      await this.fillByLabel('Address line 2 (optional)', addressLine2);
    }
    if (townOrCity) {
      await this.fillByLabel('Town or city', townOrCity);
    }
    if (postcode) {
      await this.fillByLabel('Postcode', postcode);
    }
    await this.continue();
  }

  async completeRepresentativeDetails(fullName: string, emailAddress: string, supportType: string): Promise<void> {
    if (fullName) {
      await this.fillByLabel('Full name', fullName);
    }
    if (emailAddress) {
      await this.fillByLabel('Email address', emailAddress);
    }
    if (supportType) {
      await this.selectRadio(supportType);
    }
    await this.continue();
  }

  private async completeProblemCorrections(problems: ProblemCorrection[]): Promise<void> {
    for (const problem of problems) {
      await this.page.getByRole('checkbox', { name: problem.label, exact: true }).check();
    }
    await this.continue();

    const orderedProblems = [...problems].sort((left, right) => (
      this.problemOrder.indexOf(left.label.toLowerCase()) - this.problemOrder.indexOf(right.label.toLowerCase())
    ));

    for (const problem of orderedProblems) {
      await this.completeProblemCorrection(problem);
      await this.continue();
    }
  }

  private async completeProblemCorrection(problem: ProblemCorrection): Promise<void> {
    switch (problem.label.toLowerCase()) {
      case 'name':
        await this.fillByLabel('Given names', problem.value ? problem.value.split(' ')[0] : '');
        await this.fillByLabel('Last name', problem.value ? problem.value.split(' ').slice(1).join(' ') : '');
        break;
      case 'date of birth':
        await this.fillDate('correct-date-of-birth', problem.value);
        break;
      case 'nationality':
        await this.selectAutocomplete('Nationality', problem.value);
        break;
      case 'status':
        await this.fillByLabel('What problem are you having with your immigration status?', problem.value);
        break;
      case 'valid from':
        await this.fillDate('correct-visa-start-date', problem.value);
        break;
      case 'valid to':
        await this.fillDate('correct-visa-end-date', problem.value);
        break;
      case 'national insurance number':
        await this.fillByLabel('National Insurance number', problem.value);
        break;
      case 'sponsor licence number':
        await this.fillByLabel('Sponsor licence number', problem.value);
        break;
      case 'photo':
        await this.fillByLabel('Describe the problem you are having with your photo', problem.value);
        break;
      case 'future spouse or civil partner name':
        await this.fillByLabel('Given names', problem.value.split(' ')[0] || problem.value);
        await this.fillByLabel('Last name', problem.value.split(' ').slice(1).join(' ') || c.LAST_NAME);
        break;
      case 'name or passport numbers of accompanying adult':
        await this.completeAccompanyingAdult(problem.value);
        break;
      case 'ship and port details': {
        const [ship, port] = problem.value.split('|');
        await this.fillByLabel('Correct ship name', ship);
        await this.fillByLabel('Correct port', port);
        break;
      }
      case 'must leave uk via (flight number and airport)': {
        const [flightNumber, airport] = problem.value.split('|');
        await this.fillByLabel('Correct flight number', flightNumber);
        await this.fillByLabel('Correct airport', airport);
        break;
      }
      case 'what you can and cannot do in the uk':
        await this.fillByLabel('What is wrong with the details of what you can and cannot do in the UK?', problem.value);
        break;
      case 'share code':
        await this.fillByLabel('Which share code are you unable to create?', problem.value);
        break;
      case 'email address to sign in to your account':
        await this.fillByLabel('What is the correct email address to sign in to your account?', problem.value);
        break;
      case 'phone number to sign in to your account':
        await this.fillByLabel('What is the correct phone number where you can receive security codes?', problem.value);
        break;
      case 'my problem is not listed':
        await this.fillByLabel('Describe the problem you are having', problem.value);
        break;
      default:
        throw new Error(`Unsupported EEC problem correction: ${problem.label}`);
    }
  }

  private async deselectProblemAfterEdit(problemToRemove: string): Promise<void> {
    await this.page.locator('a[href^="/problem"]').first().click();
    await this.page.getByRole('checkbox', { name: problemToRemove, exact: true }).uncheck();
    await this.continue();
  }

  private async completeAccompanyingAdult(value: string): Promise<void> {
    const parts = value.split('|');
    await this.selectRadio(parts[0] === '2' ? '2 adults' : '1 adult');
    await this.continue();

    if (parts[0] === '2') {
      await this.fillByLabel('Passport number of adult 1', parts[1]);
      await this.fillByLabel('Passport number of adult 2', parts[2]);
      return;
    }

    await this.fillByLabel('Given names', parts[1]);
    await this.fillByLabel('Last name', parts[2]);
    await this.fillByLabel('Passport number', parts[3]);
  }

  private async completeCurrentEvisaDetails(referenceType: string, referenceValue?: string): Promise<void> {
    await this.fillByLabel('Full name', c.FULL_NAME);
    await this.fillDate('requestor-dob', c.DOB_1978);
    await this.selectAutocomplete('Country of nationality', c.NATIONALITY);
    await this.selectRadio(referenceType);

    if (referenceValue) {
      await this.fillReferenceValue(referenceType, referenceValue);
    }

    await this.continue();
  }

  private async completeContactDetails(contactMethod: 'Email' | 'UK address'): Promise<void> {
    await this.selectRadio(contactMethod);

    if (contactMethod === 'Email') {
      await this.fillByLabel('Email address', c.SAS_HOF_EMAIL);
    } else {
      await this.fillByLabel('Address line 1', c.ADDRESS_LINE_1);
      await this.fillByLabel('Town or city', c.TOWN_OR_CITY);
      await this.fillByLabel('Postcode', c.POSTCODE);
    }

    await this.continue();
  }

  private async selectRadio(label: string): Promise<void> {
    await this.page.getByRole('radio', { name: label, exact: true }).check();
  }

  private async fillByLabel(label: string, value: string): Promise<void> {
    await this.page.getByLabel(label, { exact: true }).fill(value);
  }

  private async fillDate(fieldId: string, value: string): Promise<void> {
    const [day, month, year] = value.split('/');
    await this.page.locator(`#${fieldId}-day`).fill(day || '');
    await this.page.locator(`#${fieldId}-month`).fill(month || '');
    await this.page.locator(`#${fieldId}-year`).fill(year || '');
  }

  private async fillReferenceValue(referenceType: string, referenceValue: string): Promise<void> {
    const referenceFieldByType: Record<string, string> = {
      'BRP number': 'requestor-brp',
      'GWF number': 'requestor-gwf',
      'UAN number': 'requestor-uan',
      'Passport number': 'requestor-passport',
      'UKVI customer number': 'requestor-ukvi'
    };
    await this.page.locator(`input#${referenceFieldByType[referenceType]}`).fill(referenceValue);
  }

  private async navigateToProblemPage(): Promise<void> {
    await this.selectRadio('Yes');
    await this.continue();
    await this.selectRadio('Yes, I can see an eVisa in my UKVI account');
    await this.continue();
    await this.selectRadio('View your eVisa or prove your immigration status');
    await this.continue();
    await this.continueToReportAnError();
  }

  private async navigateToCurrentEvisaDetailsPage(): Promise<void> {
    await this.navigateToProblemPage();
    await this.page.getByRole('checkbox', { name: 'My problem is not listed', exact: true }).check();
    await this.continue();
    await this.fillByLabel('Describe the problem you are having', 'Test problem');
    await this.continue();
  }

  private async navigateToRefugeePage(): Promise<void> {
    await this.navigateToCurrentEvisaDetailsPage();
    await this.completeCurrentEvisaDetailsForValidation(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'I do not have a reference number', '');
  }

  private async navigateToContactPage(): Promise<void> {
    await this.navigateToRefugeePage();
    await this.selectRadio('No');
    await this.continue();
  }

  private async navigateToSomeoneElsePage(): Promise<void> {
    await this.navigateToContactPage();
    await this.completeEmailContact(c.SAS_HOF_EMAIL);
  }

  private normalizeProblemLabel(problemLabel: string): string {
    return problemLabel.toLowerCase() === "my problem isn't listed" ? 'My problem is not listed' : problemLabel;
  }

  private resolveDate(value: string): string {
    const normalized = value.trim().toLowerCase();
    const today = new Date();
    const date = new Date(today);

    if (normalized === "today's date") {
      return this.formatDate(date);
    }
    if (normalized === "tomorrow's date") {
      date.setDate(date.getDate() + 1);
      return this.formatDate(date);
    }
    if (normalized === "yesterday's date") {
      date.setDate(date.getDate() - 1);
      return this.formatDate(date);
    }
    if (normalized === 'more than 120 years ago') {
      date.setFullYear(date.getFullYear() - 120);
      date.setDate(date.getDate() - 1);
      return this.formatDate(date);
    }
    return value;
  }

  private formatDate(date: Date): string {
    return [
      String(date.getDate()).padStart(2, '0'),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getFullYear())
    ].join('/');
  }

  private async selectAutocomplete(label: string, value: string): Promise<void> {
    const field = this.page.getByLabel(label, { exact: true });
    const tagName = await field.evaluate(element => element.tagName.toLowerCase());
    if (tagName === 'select') {
      await field.selectOption({ label: value });
      return;
    }

    await field.fill(value);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  private async continueToReportAnError(): Promise<void> {
    const button = this.page.getByRole('button', { name: 'Continue to report an error' });
    if (await button.isVisible()) {
      await button.click();
    } else {
      await this.continue();
    }
  }

  private async continue(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }
}