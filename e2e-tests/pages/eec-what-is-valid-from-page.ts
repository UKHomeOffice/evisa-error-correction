import { BasePage } from './base-page';

export class EecWhatIsValidFromPage extends BasePage {
  readonly validFromDay = this.page.locator('#correct-visa-start-date-day');
  readonly validFromMonth = this.page.locator('#correct-visa-start-date-month');
  readonly validFromYear = this.page.locator('#correct-visa-start-date-year');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterValidFromDate(value: string) {
    await this.enterDateOrDob(value, 'correct-visa-start-date', true);
  }
}
