import { BasePage } from './base-page';

export class EecAreYouCompletingThisOnBehalfOfSomeoneElsePage extends BasePage {
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Are you completing this form on behalf of someone else? – Report an error with your eVisa'
      : 'Are you completing this form on behalf of someone else? – Report an error with your eVisa';
  }

  async completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(option: string) {
    await this.completeRadio(option, await this.expectedPageTitle());
  }
}
