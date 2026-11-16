import { BasePage } from './base-page';

export class EecYourCurrentEvisaDetailsPage extends BasePage {
  readonly fullNameField = this.page.locator('#requestor-full-name');
  readonly countryOfNationalityField = this.page.locator('#requestor-nationality');
  readonly brpNumberField = this.page.locator('#requestor-brp');
  readonly gwfNumberField = this.page.locator('#requestor-gwf');
  readonly uanNumberField = this.page.locator('#requestor-uan');
  readonly passportNumberField = this.page.locator('#requestor-passport');
  readonly ukViCustomerNumberField = this.page.locator('[name="requestor-ukvi"]');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Your current eVisa details – Report an error with your eVisa'
      : 'Your current eVisa details – Report an error with your eVisa';
  }

  async enterYourCurrentEvisaDetails(name: string, dob: string, country: string, option: string, reference: string, allowUnlistedCountry = false) {
    await this.type(this.fullNameField, name);
    await this.enterDateOrDob(dob);
    await this.autocomplete(this.countryOfNationalityField, country, allowUnlistedCountry);
    await this.selectOption(option);
    switch (option.toLowerCase()) {
      case 'brp number': await this.type(this.brpNumberField, reference); break;
      case 'gwf number': await this.type(this.gwfNumberField, reference); break;
      case 'uan number': await this.type(this.uanNumberField, reference); break;
      case 'passport number': await this.type(this.passportNumberField, reference); break;
      case 'ukvi customer number': await this.type(this.ukViCustomerNumberField, reference); break;
      case 'i do not have a reference number': break;
      default: throw new Error(`Invalid reference type: ${option}`);
    }
  }

  async completeCurrentEvisaDetailsPage(name: string, dob: string, country: string, option: string, reference: string, allowUnlistedCountry = false) {
    await this.assertPageTitle(await this.expectedPageTitle());
    await this.enterYourCurrentEvisaDetails(name, dob, country, option, reference, allowUnlistedCountry);
    await this.clickContinue();
  }

  async completeCurrentEvisaDetailsPageWithRetry(name: string, dob: string, country: string, option: string, reference: string) {
    await this.completeCurrentEvisaDetailsPage(name, dob, country, option, reference);
    if ((await this.page.title()).includes('Your current eVisa details')) {
      await this.completeCurrentEvisaDetailsPage(name, dob, country, option, reference);
    }
  }
}
