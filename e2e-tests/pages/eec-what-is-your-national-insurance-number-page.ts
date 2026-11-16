import { BasePage } from './base-page';

export class EecWhatIsYourNationalInsuranceNumberPage extends BasePage {
  readonly correctNationalInsuranceNumber = this.page.locator('#correct-national-insurance-number');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterCorrectNationalInsuranceNumber(value: string) {
    await this.type(this.correctNationalInsuranceNumber, value);
  }
}
