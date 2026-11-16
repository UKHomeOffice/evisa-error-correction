import { BasePage } from './base-page';

export class EecWhatIsYourPhoneNumberToSignInToYourAccountPage extends BasePage {
  readonly correctPhoneNumberField = this.page.locator('#correct-signin-phone, #problem-problem-signin-phone, #detail-signin-phone, #phone-number-to-sign-in').first();
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterPhoneNumber(value: string) {
    await this.type(this.correctPhoneNumberField, value);
  }
}
