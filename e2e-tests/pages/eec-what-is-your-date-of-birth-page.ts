import { BasePage } from './base-page';

export class EecWhatIsYourDateOfBirthPage extends BasePage {
  readonly dobDay = this.page.locator('#correct-date-of-birth-day');
  readonly dobMonth = this.page.locator('#correct-date-of-birth-month');
  readonly dobYear = this.page.locator('#correct-date-of-birth-year');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterCorrectDateOfBirth(value: string) {
    await this.enterDateOrDob(value);
  }
}
