import { BasePage } from './base-page';

export class EecHowManyAdultsHaveBeenApprovedToAccompanyAChildPage extends BasePage {
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: How many adults have been approved to accompany a child? – Report an error with your eVisa'
      : 'How many adults have been approved to accompany a child? – Report an error with your eVisa';
  }

  async enterNumberOfAdults(value: string) {
    const field = this.page.locator('#correct-number-of-adults-approved-to-accompany-a-child, #number-of-adults-approved-to-accompany-a-child, #problem-problem-number-of-adults-approved-to-accompany-a-child, input[id*="number"][id*="adult"][id*="accompany"], select[id*="number"][id*="adult"][id*="accompany"]').first();
    if (await field.count()) {
      if (await field.evaluate(element => element.tagName.toLowerCase()) === 'select') await field.selectOption(value.trim());
      else await this.type(field, value.trim());
      return;
    }
    const option = this.page.getByRole('radio', { name: new RegExp(`^${value.trim()}(?: adult| adults| person| people)?$`, 'i') });
    await option.check();
  }
}
