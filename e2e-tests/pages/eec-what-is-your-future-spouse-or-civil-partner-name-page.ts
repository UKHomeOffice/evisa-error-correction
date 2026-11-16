import { BasePage } from './base-page';

export class EecWhatIsYourFutureSpouseOrCivilPartnerName extends BasePage {
  readonly correctGivenNames = this.page.locator('#future-partner-correct-given-names');
  readonly correctLastName = this.page.locator('#future-partner-correct-last-name');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterCorrectName(fullName: string) {
    const [given = '', last = ''] = fullName.trim().split(/\s+/, 2);
    await this.type(this.correctGivenNames, given);
    await this.type(this.correctLastName, last);
  }

  async enterCorrectGivenNames(value: string) {
    await this.type(this.correctGivenNames, value);
  }

  async enterCorrectLastName(value: string) {
    await this.type(this.correctLastName, value);
  }
}
