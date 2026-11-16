import { BasePage } from './base-page';

export class EecWhatIsWrongWithYourPhotoPage extends BasePage {
  readonly photoField = this.page.locator('#photo');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterPhoto(value: string) {
    await this.type(this.photoField, value);
  }
}
