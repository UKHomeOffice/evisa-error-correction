import { BasePage } from './base-page';

export class EecAreYouCurrentlyInTheUkPage extends BasePage {
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Are you currently in the UK? – Report an error with your eVisa'
      : 'Are you currently in the UK? – Report an error with your eVisa';
  }

  async openEecHomePage() {
    await this.page.goto('/in-uk');
  }

  async openEec() {
    await this.openEecHomePage();
    await this.assertPageTitle(await this.expectedPageTitle());
    const cookies = this.page.getByRole('button', { name: /accept.*cookies/i });
    if (await cookies.isVisible()) await cookies.click();
  }

  async completeAreYouCurrentlyInTheUkPage(option: string) {
    await this.completeRadio(option, await this.expectedPageTitle());
  }
}
