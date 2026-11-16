import { BasePage } from './base-page';

export class EecWhatIsTheEmailAddressToSignInToYourAccountPage extends BasePage {
  readonly emailAddressField = this.page.locator('#correct-signin-email');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterEmailAddress(value: string) {
    await this.type(this.emailAddressField, value);
  }
}
