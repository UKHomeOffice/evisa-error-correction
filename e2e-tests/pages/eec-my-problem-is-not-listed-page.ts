import { BasePage } from './base-page';

export class EecMyProblemIsNotListedPage extends BasePage {
  readonly problemNotListed = this.page.locator('#problem-not-listed, #problem-problem-other, #detail-other').first();
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterCorrectProblemNotListed(value: string) {
    await this.type(this.problemNotListed, value);
  }
}
