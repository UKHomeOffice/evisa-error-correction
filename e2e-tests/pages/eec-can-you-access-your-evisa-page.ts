import { BasePage } from './base-page';

export class EecCanYouAccessYourEVisaPage extends BasePage {
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Can you access your eVisa? – Report an error with your eVisa'
      : 'Can you access your eVisa? – Report an error with your eVisa';
  }

  async selectCanYouAccessYourEVisaPageOption(option: string) {
    await this.selectOption(option);
  }

  async completeCanYouAccessYourEVisaPage(option: string) {
    await this.completeRadio(option, await this.expectedPageTitle());
  }
}
