import { BasePage } from './base-page';

export class EecEnterYourTravelDocumentDetailsPage extends BasePage {
  readonly documentNumberField = this.page.locator('#travel-doc-number');
  readonly countryOfNationalityField = this.page.locator('#travel-doc-nationality');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Enter your travel document details – Report an error with your eVisa'
      : 'Enter your travel document details – Report an error with your eVisa';
  }

  async enterEnterYourTravelDocumentDetails(document: string, country: string, dob: string) {
    await this.type(this.documentNumberField, document);
    await this.autocomplete(this.countryOfNationalityField, country);
    await this.enterDateOrDob(dob);
  }

  async completeEnterYourTravelDocumentDetailsPage(document: string, country: string, dob: string) {
    await this.assertPageTitle(await this.expectedPageTitle());
    await this.enterEnterYourTravelDocumentDetails(document, country, dob);
    await this.clickContinue();
  }
}
