import { BasePage } from './base-page';

export class EecTwoAdultsHaveBeenApprovedToAccompanyAChildPage extends BasePage {
  readonly correctPassportNumberAdult1 = this.page.locator('#correct-passport-number-adult-1');
  readonly correctPassportNumberAdult2 = this.page.locator('#correct-passport-number-adult-2');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: What are the correct passport numbers of the adults approved to accompany a child? – Report an error with your eVisa'
      : 'What are the correct passport numbers of the adults approved to accompany a child? – Report an error with your eVisa';
  }

  async enterCorrectPassportNumbers(details: string) {
    const [first = '', second = ''] = details.trim().split('|', 2).map(value => value.trim());
    const fields = this.page.locator('input[id*="passport"][id*="adult"]:visible');
    if (await this.correctPassportNumberAdult1.isVisible() && await this.correctPassportNumberAdult2.isVisible()) {
      await this.type(this.correctPassportNumberAdult1, first);
      await this.type(this.correctPassportNumberAdult2, second);
    } else if (await fields.count() >= 2) {
      await this.type(fields.nth(0), first);
      await this.type(fields.nth(1), second);
    } else {
      const combined = this.page.locator('#correct-passport-numbers-of-adults-approved-to-accompany-a-child, #passport-numbers-of-adults-approved-to-accompany-a-child, #problem-problem-passport-numbers-of-adults-approved-to-accompany-a-child, textarea[id*="passport"][id*="adult"][id*="accompany"], input[id*="passport"][id*="adult"][id*="accompany"][id*="numbers"]').first();
      await this.type(combined, second ? `${first}\n${second}` : first);
    }
  }
}
