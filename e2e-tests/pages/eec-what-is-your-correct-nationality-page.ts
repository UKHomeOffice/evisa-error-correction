import { BasePage } from './base-page';

export class EecWhatIsYourCorrectNationality extends BasePage {
  readonly correctNationality = this.page.locator('#correct-nationality, #problem-problem-nationality').first();
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterCorrectNationality(value: string) {
    await this.autocomplete(this.correctNationality, value);
  }
}
