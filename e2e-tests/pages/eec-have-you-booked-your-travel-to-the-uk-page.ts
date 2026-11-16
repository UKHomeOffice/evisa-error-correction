import { BasePage } from './base-page';

export class EecHaveYouBookedYourTravelToTheUkPage extends BasePage {
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Have you booked your travel to the UK? – Report an error with your eVisa'
      : 'Have you booked your travel to the UK? – Report an error with your eVisa';
  }

  async selectHaveYouBookedYourTravelToTheUkOption(option: string, date: string) {
    if (!option.startsWith('Yes') && !option.startsWith('No')) throw new Error(`Invalid travel option: ${option}`);
    await this.page.getByRole('radio', { name: option.startsWith('Yes') ? /^Yes\b/i : /^No\b/i }).check();
    if (option.startsWith('Yes')) await this.enterDateOrDob(date);
  }

  async completeHaveYouBookedYourTravelToTheUkPage(option: string, date: string) {
    await this.assertPageTitle(await this.expectedPageTitle());
    await this.selectHaveYouBookedYourTravelToTheUkOption(option, date);
    await this.clickContinue();
  }
}
