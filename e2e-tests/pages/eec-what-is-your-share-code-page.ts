import { BasePage } from './base-page';

export class EecWhatIsYourShareCodePage extends BasePage {
  readonly shareCodeField = this.page.locator('#share-code, #problem-problem-share-code, #detail-share-code').first();
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterShareCode(value: string) {
    await this.type(this.shareCodeField, value);
  }
}
