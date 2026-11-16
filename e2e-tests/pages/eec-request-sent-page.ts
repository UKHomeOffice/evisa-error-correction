import { BasePage } from './base-page';

export class EecRequestSentPage extends BasePage {
  readonly finishedAndReturnGovBtn = this.page.getByRole('link', { name: 'Finish and return to GOV.UK' });
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: What are your details? – Report an error with your eVisa'
      : 'What are your details? – Report an error with your eVisa';
  }

  async isFinishAndReturnToGovUkBtnDisplayed() {
    return this.finishedAndReturnGovBtn.isVisible();
  }
}
