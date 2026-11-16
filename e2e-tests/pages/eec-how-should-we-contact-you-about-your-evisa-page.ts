import { BasePage } from './base-page';

export class EecHowShouldWeContactYouAboutYourEVisaPage extends BasePage {
  readonly emailField = this.page.locator('#requestor-email');
  readonly addressLine1TextField = this.page.locator('#requestor-address-line-1');
  readonly addressLine2TextField = this.page.locator('#requestor-address-line-2');
  readonly townOrCityTextField = this.page.locator('#requestor-town-or-city');
  readonly countryTextField = this.page.locator('#requestor-county');
  readonly postCodeField = this.page.locator('#requestor-postcode');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: How should we contact you about your eVisa? – Report an error with your eVisa'
      : 'How should we contact you about your eVisa? – Report an error with your eVisa';
  }

  async enterEmail(option: string, email: string) {
    await this.selectOption(option);
    await this.type(this.emailField, email);
  }

  async enterUkAddress(option: string, line1: string, line2: string, town: string, country: string, postcode: string) {
    await this.selectOption(option);
    await this.type(this.addressLine1TextField, line1);
    await this.type(this.addressLine2TextField, line2);
    await this.type(this.townOrCityTextField, town);
    await this.type(this.countryTextField, country);
    await this.type(this.postCodeField, postcode);
  }

  async completeHowShouldWeContactYouAboutYourEvisaPage(option: string, email: string, line1: string, line2: string, town: string, country: string, postcode: string) {
    await this.assertPageTitle(await this.expectedPageTitle());
    switch (option.toLowerCase()) {
      case 'email': await this.enterEmail(option, email); break;
      case 'uk address': await this.enterUkAddress(option, line1, line2, town, country, postcode); break;
      default: throw new Error(`Invalid contact option: ${option}`);
    }
    await this.clickContinue();
  }
}
