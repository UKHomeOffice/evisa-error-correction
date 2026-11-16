import { BasePage } from './base-page';

export class EecProvideMoreDetailsAboutTheErrorWithYourEvisaPage extends BasePage {
  readonly textAreaField = this.page.locator('#describe-evisa-error');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Provide more details about the error with your eVisa – Report an error with your eVisa'
      : 'Provide more details about the error with your eVisa – Report an error with your eVisa';
  }

  async enterProvideMoreDetailsAboutTheErrorWithYourEvisaDetails(value: string) {
    await this.type(this.textAreaField, value);
  }

  async completeProvideMoreDetailsAboutTheErrorWithYourEvisaPage(value: string) {
    await this.assertPageTitle(await this.expectedPageTitle());
    await this.enterProvideMoreDetailsAboutTheErrorWithYourEvisaDetails(value);
    await this.clickContinue();
  }
}
