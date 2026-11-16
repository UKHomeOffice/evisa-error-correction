import { BasePage } from './base-page';

export class EecDoYouHavePermissionToStayInTheUkAsARefugeePage extends BasePage {
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Do you have permission to stay in the UK as a refugee? – Report an error with your eVisa'
      : 'Do you have permission to stay in the UK as a refugee? – Report an error with your eVisa';
  }

  async completeDoYouHavePermissionToStayInTheUkAsARefugeePage(option: string) {
    await this.completeRadio(option, await this.expectedPageTitle());
  }
}
