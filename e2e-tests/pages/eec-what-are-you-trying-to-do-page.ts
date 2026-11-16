import { BasePage } from './base-page';

export class EecWhatAreYouTryingToDoPage extends BasePage {
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: What are you trying to do? – Report an error with your eVisa'
      : 'What are you trying to do? – Report an error with your eVisa';
  }

  async selectWhatAreYouTryingToDoPageOption(option: string) {
    await this.selectOption(option);
  }

  async completeWhatAreYouTryingToDoPage(option: string) {
    await this.completeRadio(option, await this.expectedPageTitle());
  }
}
