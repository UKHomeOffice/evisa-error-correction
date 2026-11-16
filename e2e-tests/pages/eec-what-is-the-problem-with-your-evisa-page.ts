import { BasePage } from './base-page';
import { EecWhatIsYourCorrectNamePage } from './eec-what-is-your-correct-name-page';
import { EecWhatIsYourDateOfBirthPage } from './eec-what-is-your-date-of-birth-page';
import { EecWhatIsYourCorrectNationality } from './eec-what-is-your-correct-nationality-page';
import { EecWhatIsYourStatusPage } from './eec-what-is-your-status-page';
import { EecWhatIsValidFromPage } from './eec-what-is-valid-from-page';
import { EecWhatIsValidToPage } from './eec-what-is-valid-to-page';
import { EecWhatIsYourNationalInsuranceNumberPage } from './eec-what-is-your-national-insurance-number-page';
import { EecWhatIsWrongWithYourPhotoPage } from './eec-what-is-wrong-with-your-photo-page';
import { EecWhatYouCanAndCannotDoInUkPage } from './eec-what-you-can-and-cannot-do-in-uk-page';
import { EecWhatIsYourShareCodePage } from './eec-what-is-your-share-code-page';
import { EecWhatIsYourFutureSpouseOrCivilPartnerName } from './eec-what-is-your-future-spouse-or-civil-partner-name-page';
import { EecShipAndPortDetailsPage } from './eec-ship-and-port-details-page';
import { EecWhatIsTheEmailAddressToSignInToYourAccountPage } from './eec-what-is-the-email-address-to-sign-in-to-your-account-page';
import { EecWhatIsYourPhoneNumberToSignInToYourAccountPage } from './eec-what-is-your-phone-number-to-sign-in-to-your-account-page';
import { EecWhatIsYourSponsorLicenceNumber } from './eec-what-is-your-sponsor-licence-number-page';
import { EecMyProblemIsNotListedPage } from './eec-my-problem-is-not-listed-page';
import { EecHowManyAdultsHaveBeenApprovedToAccompanyAChildPage } from './eec-how-many-adults-have-been-approved-to-accompany-a-child-page';
import { EecWhatIsTheNameOrPassportNumbersOfAccompanyingAdultPage } from './eec-what-is-the-name-or-passport-numbers-of-accompanying-adult-page';
import { EecTwoAdultsHaveBeenApprovedToAccompanyAChildPage } from './eec-two-adults-have-been-approved-to-accompany-a-child-page';

export class EecWhatIsTheProblemWithYourEVisaPage extends BasePage {
  readonly nameField = this.page.locator('#detail-full-name');
  readonly dobField = this.page.locator('#date-of-birth');
  readonly nationalityField = this.page.locator('#detail-nationality');
  readonly statusField = this.page.locator('#detail-status');
  readonly validFromField = this.page.locator('#detail-valid-from');
  readonly validToField = this.page.locator('#detail-valid-until');
  readonly niNoField = this.page.locator('#detail-nin');
  readonly photoField = this.page.locator('#detail-photo');
  readonly whatYouCanAndCannotDoInTheUkField = this.page.locator('#detail-restrictions');
  readonly shareCodeField = this.page.locator('#detail-share-code');
  readonly futureSpouseOrCivilPartnerNameField = this.page.locator('#detail-future-spouse-or-civil-partner-name');
  readonly shipAndPortDetailsField = this.page.locator('#detail-ship-and-port-details');
  readonly emailField = this.page.locator('#detail-signin-email');
  readonly phoneField = this.page.locator('#detail-signin-phone');
  readonly licenseField = this.page.locator('#detail-sponsor-licence-number');
  readonly problemNotListedField = this.page.locator('#detail-other');
  readonly problemNotListedOption = this.page.getByRole('checkbox', { name: /^My problem (?:isn't|is not) listed$/i });

  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: What is the problem with your eVisa? – Report an error with your eVisa'
      : 'What is the problem with your eVisa? – Report an error with your eVisa';
  }

  async completeWhatIsTheProblemWithYourEVisaPage(option: string, value: string) {
    await this.assertPageTitle(await this.expectedPageTitle());
    await this.selectCheckboxAndEnterTextInto(option, value);
    await this.clickContinue();
  }

  async selectCheckboxAndEnterTextInto(option: string, value: string) {
    switch (option.toLowerCase()) {
      case 'name': await this.selectNameAndEnter(value); break;
      case 'date of birth': await this.selectDateOfBirthAndEnter(value); break;
      case 'nationality': await this.selectNationalityAndEnter(value); break;
      case 'status': await this.selectStatusAndEnter(value); break;
      case 'valid from': await this.selectValidFromAndEnter(value); break;
      case 'valid to': await this.selectValidToAndEnter(value); break;
      case 'national insurance number': await this.selectNationalInsuranceAndEnter(value); break;
      case 'photo': await this.selectPhotoAndEnter(value); break;
      case 'what you can and cannot do in the uk': await this.selectWhatYouCanAndCannotDoInUkAndEnter(value); break;
      case 'share code': await this.selectShareCodeAndEnter(value); break;
      case 'future spouse or civil partner name': await this.selectFutureSpouseOrCivilPartnerNameAndEnter(value); break;
      case 'ship and port details': await this.selectShipAndPortDetailsAndEnter(value); break;
      case 'email address to sign in to your account': await this.selectEmailAddressToSignInAndEnter(value); break;
      case 'phone number to sign in to your account': await this.selectPhoneNumberToSignInAndEnter(value); break;
      case 'sponsor licence number': await this.selectSponsorLicenceAndEnter(value); break;
      case "my problem isn't listed": await this.selectMyProblemIsNotListedAndEnter(value); break;
      case 'name or passport numbers of accompanying adult': await this.selectNameOrPassportNumbersOfAccompanyingAdultAndEnter(value); break;
      default: throw new Error(`Invalid problem option: ${option}`);
    }
  }

  async deselectCheckbox(option: string) {
    const checkbox = option.toLowerCase() === "my problem isn't listed"
      ? this.problemNotListedOption
      : this.page.getByRole('checkbox', { name: option, exact: true });
    await checkbox.uncheck();
  }

  private async selectAndEnter(option: string, enter: () => Promise<void>) {
    await this.selectOption(option);
    await this.clickContinue();
    await enter();
    await this.clickContinue();
  }

  async selectNameAndEnter(value: string) {
    await this.selectAndEnter('Name', () => new EecWhatIsYourCorrectNamePage(this.page).enterCorrectName(value));
  }

  async selectDateOfBirthAndEnter(value: string) {
    await this.selectAndEnter('Date of birth', () => new EecWhatIsYourDateOfBirthPage(this.page).enterCorrectDateOfBirth(value));
  }

  async selectNationalityAndEnter(value: string) {
    await this.selectAndEnter('Nationality', () => new EecWhatIsYourCorrectNationality(this.page).enterCorrectNationality(value));
  }

  async selectStatusAndEnter(value: string) {
    await this.selectAndEnter('Status', () => new EecWhatIsYourStatusPage(this.page).enterImmigrationStatus(value));
  }

  async selectValidFromAndEnter(value: string) {
    await this.selectAndEnter('Valid from', () => new EecWhatIsValidFromPage(this.page).enterValidFromDate(value));
  }

  async selectValidToAndEnter(value: string) {
    await this.selectAndEnter('Valid to', () => new EecWhatIsValidToPage(this.page).enterValidToDate(value));
  }

  async selectNationalInsuranceAndEnter(value: string) {
    await this.selectAndEnter('National Insurance number', () => new EecWhatIsYourNationalInsuranceNumberPage(this.page).enterCorrectNationalInsuranceNumber(value));
  }

  async selectPhotoAndEnter(value: string) {
    await this.selectAndEnter('Photo', () => new EecWhatIsWrongWithYourPhotoPage(this.page).enterPhoto(value));
  }

  async selectWhatYouCanAndCannotDoInUkAndEnter(value: string) {
    await this.selectAndEnter('What you can and cannot do in the UK', () => new EecWhatYouCanAndCannotDoInUkPage(this.page).enterRestrictionsDetails(value));
  }

  async selectShareCodeAndEnter(value: string) {
    await this.selectAndEnter('Share code', () => new EecWhatIsYourShareCodePage(this.page).enterShareCode(value));
  }

  async selectFutureSpouseOrCivilPartnerNameAndEnter(value: string) {
    await this.selectAndEnter('Future spouse or civil partner name', () => new EecWhatIsYourFutureSpouseOrCivilPartnerName(this.page).enterCorrectName(value));
  }

  async selectShipAndPortDetailsAndEnter(value: string) {
    await this.selectAndEnter('Ship and port details', () => new EecShipAndPortDetailsPage(this.page).enterCorrectName(value));
  }

  async selectEmailAddressToSignInAndEnter(value: string) {
    await this.selectAndEnter('Email address to sign in to your account', () => new EecWhatIsTheEmailAddressToSignInToYourAccountPage(this.page).enterEmailAddress(value));
  }

  async selectPhoneNumberToSignInAndEnter(value: string) {
    await this.selectAndEnter('Phone number to sign in to your account', () => new EecWhatIsYourPhoneNumberToSignInToYourAccountPage(this.page).enterPhoneNumber(value));
  }

  async selectSponsorLicenceAndEnter(value: string) {
    await this.selectAndEnter('Sponsor licence number', () => new EecWhatIsYourSponsorLicenceNumber(this.page).enterCorrectSponsorLicenceNumber(value));
  }

  async selectMyProblemIsNotListedAndEnter(value: string) {
    await this.problemNotListedOption.check();
    await this.clickContinue();
    await new EecMyProblemIsNotListedPage(this.page).enterCorrectProblemNotListed(value);
    await this.clickContinue();
  }

  async selectNameOrPassportNumbersOfAccompanyingAdultAndEnter(value: string) {
    const parts = value.trim().split('|');
    const count = parts.length > 1 ? parts.shift()!.trim() : '1';
    const details = parts.length ? parts.join('|') : value.trim();
    await this.selectOption('Name or passport numbers of accompanying adult');
    await this.clickContinue();
    const adults = new EecHowManyAdultsHaveBeenApprovedToAccompanyAChildPage(this.page);
    await adults.assertPageTitle(await adults.expectedPageTitle());
    await adults.enterNumberOfAdults(count);
    await adults.clickContinue();
    if (count === '2') {
      const page = new EecTwoAdultsHaveBeenApprovedToAccompanyAChildPage(this.page);
      await page.assertPageTitle(await page.expectedPageTitle());
      await page.enterCorrectPassportNumbers(details);
      await page.clickContinue();
    } else {
      const page = new EecWhatIsTheNameOrPassportNumbersOfAccompanyingAdultPage(this.page);
      await page.assertPageTitle(await page.expectedPageTitle());
      await page.enterCorrectAdultDetails(details);
      await page.clickContinue();
    }
  }
}
