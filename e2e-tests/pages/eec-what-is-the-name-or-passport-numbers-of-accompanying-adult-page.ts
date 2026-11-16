import { BasePage } from './base-page';

export class EecWhatIsTheNameOrPassportNumbersOfAccompanyingAdultPage extends BasePage {
  readonly correctGivenNames = this.page.locator('#correct-given-names-adult-accompanying');
  readonly correctLastName = this.page.locator('#correct-last-name-adult-accompanying');
  readonly correctPassportNumber = this.page.locator('#correct-passport-number-adult-accompanying');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: What are the correct details of the adult accompanying the child? – Report an error with your eVisa'
      : 'What are the correct details of the adult accompanying the child? – Report an error with your eVisa';
  }

  async enterCorrectAdultDetails(details: string) {
    const [name = '', passport = ''] = details.trim().split('|', 2);
    const [given = '', last = ''] = name.trim().split(/\s+/, 2);
    await this.type(this.correctGivenNames, given);
    await this.type(this.correctLastName, last);
    await this.type(this.correctPassportNumber, passport.trim());
  }

  async enterCorrectName(value: string) {
    await this.enterCorrectAdultDetails(value);
  }
}
