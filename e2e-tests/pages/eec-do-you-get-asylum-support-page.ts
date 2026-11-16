import { BasePage } from './base-page';

export class EecDoYouGetAsylumSupportPage extends BasePage {
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Do you get asylum support? – Report an error with your eVisa'
      : 'Do you get asylum support? – Report an error with your eVisa';
  }

  async completeDoYouGetAsylumSupportPage(option: string) {
    await this.completeRadio(option, await this.expectedPageTitle());
  }
}
