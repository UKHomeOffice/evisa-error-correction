import { BasePage } from './base-page';

export class EecCheckYourAnswersPage extends BasePage {
  readonly acceptAndSendBtn = this.page.getByRole('button', { name: 'Accept and send' });
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers – Report an error with your eVisa';
  }

  async clickOnAcceptAndSendButton() {
    await this.acceptAndSendBtn.click();
  }

  async completeCheckYourAnswersPage() {
    await this.assertPageTitle(await this.expectedPageTitle());
    await this.clickOnAcceptAndSendButton();
  }
}
