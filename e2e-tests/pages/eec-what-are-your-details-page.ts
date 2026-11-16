import { BasePage } from './base-page';

export class EecWhatAreYourDetailsPage extends BasePage {
  readonly fullNameField = this.page.locator('#representative-name');
  readonly emailAddressField = this.page.locator('#representative-email');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: What are your details? – Report an error with your eVisa'
      : 'What are your details? – Report an error with your eVisa';
  }

  async enterWhatAreYourDetails(name: string, email: string, support: string) {
    await this.type(this.fullNameField, name);
    await this.type(this.emailAddressField, email);
    await this.selectOption(support);
  }

  async completeWhatAreYourDetailsPage(name: string, email: string, support: string) {
    await this.assertPageTitle(await this.expectedPageTitle());
    await this.enterWhatAreYourDetails(name, email, support);
    await this.clickContinue();
  }
}
