import { BasePage } from './base-page';

export class EecWhatYouCanAndCannotDoInUkPage extends BasePage {
  readonly canAndCannotDoInUkField = this.page.locator('#detail-restrictions-in-uk, #problem-problem-restrictions, #problem-problem-restrictions-in-uk, #correct-restrictions-in-uk').first();
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterRestrictionsDetails(value: string) {
    await this.type(this.canAndCannotDoInUkField, value);
  }
}
