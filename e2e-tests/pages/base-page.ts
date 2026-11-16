import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  readonly headerText: Locator;
  readonly continueButton: Locator;
  readonly errorSummaryTitle: Locator;
  readonly errorSummaryItems: Locator;

  constructor(readonly page: Page) {
    this.headerText = page.locator('h1');
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.errorSummaryTitle = page.locator('#error-summary-title');
    this.errorSummaryItems = page.locator('.govuk-error-summary__list li');
  }

  async assertPageTitle(title: string): Promise<void> {
    await expect(this.page).toHaveTitle(`${title} – GOV.UK`);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async completeRadio(option: string, title: string): Promise<void> {
    await this.assertPageTitle(title);
    await this.selectOption(option);
    await this.clickContinue();
  }

  async selectOption(option: string): Promise<void> {
    if (!option.trim()) throw new Error('Option text cannot be blank');
    const radio = this.page.getByRole('radio', { name: option, exact: true });
    const checkbox = this.page.getByRole('checkbox', { name: option, exact: true });
    if (await radio.count()) await radio.check();
    else await checkbox.check();
  }

  async type(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
    await locator.press('Tab');
  }

  async autocomplete(locator: Locator, value: string, allowUnlisted = false): Promise<void> {
    await locator.fill(value);
    if (!value.trim()) {
      await locator.press('Tab');
      return;
    }
    const escaped = value.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const option = this.page.getByRole('option', { name: new RegExp(`^${escaped}$`, 'i') });
    if (allowUnlisted) {
      const noResults = this.page.getByRole('option', { name: 'No results found' });
      await expect(option.or(noResults)).toBeVisible();
      if (await noResults.isVisible()) {
        await locator.press('Tab');
        return;
      }
    }
    await option.click();
  }

  convertTextToDate(value: string): string {
    const date = new Date();
    let years = 0;
    let days = 0;
    switch (value.trim().toLowerCase()) {
      case "yesterday's date": days = -1; break;
      case "today's date": break;
      case "tomorrow's date": days = 1; break;
      case 'more than one year in the future': years = 1; days = 1; break;
      case 'more than 100 years in the future': years = 100; days = 1; break;
      case 'more than one year in the past': years = -1; days = -1; break;
      case 'within the last 3 years': years = -3; days = 1; break;
      case 'more than 3 years ago': years = -3; break;
      case 'less than 16 years ago': years = -16; days = 1; break;
      case 'less than 18 years ago': years = -18; days = 1; break;
      case '19 years ago': years = -20; break;
      case 'more than 50 years ago': years = -50; days = -1; break;
      case 'more than 100 years ago': years = -100; days = -1; break;
      case 'more than 120 years ago': years = -120; days = -1; break;
      case 'more than 127 years ago': years = -127; days = -1; break;
      default: return value;
    }
    date.setFullYear(date.getFullYear() + years);
    date.setDate(date.getDate() + days);
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
      .map((part, index) => index < 2 ? String(part).padStart(2, '0') : String(part))
      .join('/');
  }

  async enterDateOrDob(value: string, prefix?: string, clearBlank = false): Promise<void> {
    if (!value.trim() && !clearBlank) return;
    const parts = value.trim() ? this.convertTextToDate(value).split('/') : ['', '', ''];
    if (parts.length !== 3) throw new Error(`Invalid date: ${value}; expected dd/MM/yyyy`);
    const fields = prefix
      ? ['day', 'month', 'year'].map(part => this.page.locator(`#${prefix}-${part}`))
      : ['Day', 'Month', 'Year'].map(part => this.page.getByLabel(part, { exact: true }));
    for (let index = 0; index < fields.length; index++) await this.type(fields[index], parts[index]);
  }
}
