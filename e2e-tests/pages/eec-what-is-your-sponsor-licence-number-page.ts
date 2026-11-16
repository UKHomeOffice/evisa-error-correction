import { BasePage } from './base-page';

export class EecWhatIsYourSponsorLicenceNumber extends BasePage {
  readonly correctSponsorLicenceNumber = this.page.locator('#correct-sponsor-licence-number');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterCorrectSponsorLicenceNumber(value: string) {
    await this.type(this.correctSponsorLicenceNumber, value);
  }
}
