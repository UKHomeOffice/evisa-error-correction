import { BasePage } from './base-page';

export class EecWhatIsYourStatusPage extends BasePage {
  readonly correctStatus = this.page.locator('#problem-problem-status');
  readonly immigrationStatus = this.page.locator('#problem-immigration-status');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterImmigrationStatus(value: string) {
    await this.type(this.immigrationStatus, value);
  }
}
