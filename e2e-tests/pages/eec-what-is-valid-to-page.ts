import { BasePage } from './base-page';

export class EecWhatIsValidToPage extends BasePage {
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterValidToDate(value: string) {
    const prefixes = ['correct-visa-end-date', 'correct-visa-valid-to-date', 'correct-visa-expiry-date', 'correct-visa-start-date'];
    for (const prefix of prefixes) {
      if (await this.page.locator(`#${prefix}-day`).count()) {
        await this.enterDateOrDob(value, prefix, true);
        return;
      }
    }
    throw new Error('Could not find Valid To date input fields');
  }
}
