import { BasePage } from './base-page';

export class EecBeforeYouReportAnErrorWithYourEVisaPage extends BasePage {
  readonly continueToReportAnErrorButton = this.page.getByRole('button', { name: 'Continue to report an error' });
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Before you report an error with your eVisa – Report an error with your eVisa'
      : 'Before you report an error with your eVisa – Report an error with your eVisa';
  }

  async clickContinueToReportAnErrorButton() {
    await this.continueToReportAnErrorButton.click();
  }

  async completeBeforeYouReportAnErrorWithYourEVisaPage() {
    await this.assertPageTitle(await this.expectedPageTitle());
    await this.clickContinueToReportAnErrorButton();
  }
}
