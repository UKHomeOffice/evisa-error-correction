import { test as base } from 'playwright-bdd';
import { BasePage } from '../pages/base-page';
import { EecAreYouCurrentlyInTheUkPage } from '../pages/eec-are-you-currently-in-the-uk-page';
import { EecAreYouCompletingThisOnBehalfOfSomeoneElsePage } from '../pages/eec-are-you-completing-this-on-behalf-of-someone-else-page';
import { EecBeforeYouReportAnErrorWithYourEVisaPage } from '../pages/eec-before-you-report-an-error-with-your-evisa-page';
import { EecCanYouAccessYourEVisaPage } from '../pages/eec-can-you-access-your-evisa-page';
import { EecCheckYourAnswersPage } from '../pages/eec-check-your-answers-page';
import { EecDoYouGetAsylumSupportPage } from '../pages/eec-do-you-get-asylum-support-page';
import { EecDoYouHavePermissionToStayInTheUkAsARefugeePage } from '../pages/eec-do-you-have-permission-to-stay-in-the-uk-as-a-refugee-page';
import { EecEnterYourTravelDocumentDetailsPage } from '../pages/eec-enter-your-travel-document-details-page';
import { EecHaveYouBookedYourTravelToTheUkPage } from '../pages/eec-have-you-booked-your-travel-to-the-uk-page';
import { EecHowManyAdultsHaveBeenApprovedToAccompanyAChildPage } from '../pages/eec-how-many-adults-have-been-approved-to-accompany-a-child-page';
import { EecHowShouldWeContactYouAboutYourEVisaPage } from '../pages/eec-how-should-we-contact-you-about-your-evisa-page';
import { EecMyProblemIsNotListedPage } from '../pages/eec-my-problem-is-not-listed-page';
import { EecProvideMoreDetailsAboutTheErrorWithYourEvisaPage } from '../pages/eec-provide-more-details-about-the-error-with-your-evisa-page';
import { EecRequestSentPage } from '../pages/eec-request-sent-page';
import { EecShipAndPortDetailsPage } from '../pages/eec-ship-and-port-details-page';
import { EecTwoAdultsHaveBeenApprovedToAccompanyAChildPage } from '../pages/eec-two-adults-have-been-approved-to-accompany-a-child-page';
import { EecWhatAreYouTryingToDoPage } from '../pages/eec-what-are-you-trying-to-do-page';
import { EecWhatAreYourDetailsPage } from '../pages/eec-what-are-your-details-page';
import { EecWhatIsTheEmailAddressToSignInToYourAccountPage } from '../pages/eec-what-is-the-email-address-to-sign-in-to-your-account-page';
import { EecWhatIsTheNameOrPassportNumbersOfAccompanyingAdultPage } from '../pages/eec-what-is-the-name-or-passport-numbers-of-accompanying-adult-page';
import { EecWhatIsTheProblemWithYourEVisaPage } from '../pages/eec-what-is-the-problem-with-your-evisa-page';
import { EecWhatIsValidFromPage } from '../pages/eec-what-is-valid-from-page';
import { EecWhatIsValidToPage } from '../pages/eec-what-is-valid-to-page';
import { EecWhatIsWrongWithYourPhotoPage } from '../pages/eec-what-is-wrong-with-your-photo-page';
import { EecWhatIsYourCorrectNamePage } from '../pages/eec-what-is-your-correct-name-page';
import { EecWhatIsYourCorrectNationality } from '../pages/eec-what-is-your-correct-nationality-page';
import { EecWhatIsYourDateOfBirthPage } from '../pages/eec-what-is-your-date-of-birth-page';
import { EecWhatIsYourFutureSpouseOrCivilPartnerName } from '../pages/eec-what-is-your-future-spouse-or-civil-partner-name-page';
import { EecWhatIsYourNationalInsuranceNumberPage } from '../pages/eec-what-is-your-national-insurance-number-page';
import { EecWhatIsYourPhoneNumberToSignInToYourAccountPage } from '../pages/eec-what-is-your-phone-number-to-sign-in-to-your-account-page';
import { EecWhatIsYourShareCodePage } from '../pages/eec-what-is-your-share-code-page';
import { EecWhatIsYourSponsorLicenceNumber } from '../pages/eec-what-is-your-sponsor-licence-number-page';
import { EecWhatIsYourStatusPage } from '../pages/eec-what-is-your-status-page';
import { EecWhatYouCanAndCannotDoInUkPage } from '../pages/eec-what-you-can-and-cannot-do-in-uk-page';
import { EecYourCurrentEvisaDetailsPage } from '../pages/eec-your-current-evisa-details-page';

const pageClasses = {
  basePage: BasePage,
  eecAreYouCurrentlyInTheUkPage: EecAreYouCurrentlyInTheUkPage,
  eecAreYouCompletingThisOnBehalfOfSomeoneElsePage: EecAreYouCompletingThisOnBehalfOfSomeoneElsePage,
  eecBeforeYouReportAnErrorWithYourEVisaPage: EecBeforeYouReportAnErrorWithYourEVisaPage,
  eecCanYouAccessYourEVisaPage: EecCanYouAccessYourEVisaPage,
  eecCheckYourAnswersPage: EecCheckYourAnswersPage,
  eecDoYouGetAsylumSupportPage: EecDoYouGetAsylumSupportPage,
  eecDoYouHavePermissionToStayInTheUkAsARefugeePage: EecDoYouHavePermissionToStayInTheUkAsARefugeePage,
  eecEnterYourTravelDocumentDetailsPage: EecEnterYourTravelDocumentDetailsPage,
  eecHaveYouBookedYourTravelToTheUkPage: EecHaveYouBookedYourTravelToTheUkPage,
  eecHowManyAdultsHaveBeenApprovedToAccompanyAChildPage: EecHowManyAdultsHaveBeenApprovedToAccompanyAChildPage,
  eecHowShouldWeContactYouAboutYourEVisaPage: EecHowShouldWeContactYouAboutYourEVisaPage,
  eecMyProblemIsNotListedPage: EecMyProblemIsNotListedPage,
  eecProvideMoreDetailsAboutTheErrorWithYourEvisaPage: EecProvideMoreDetailsAboutTheErrorWithYourEvisaPage,
  eecRequestSentPage: EecRequestSentPage,
  eecShipAndPortDetailsPage: EecShipAndPortDetailsPage,
  eecTwoAdultsHaveBeenApprovedToAccompanyAChildPage: EecTwoAdultsHaveBeenApprovedToAccompanyAChildPage,
  eecWhatAreYouTryingToDoPage: EecWhatAreYouTryingToDoPage,
  eecWhatAreYourDetailsPage: EecWhatAreYourDetailsPage,
  eecWhatIsTheEmailAddressToSignInToYourAccountPage: EecWhatIsTheEmailAddressToSignInToYourAccountPage,
  eecWhatIsTheNameOrPassportNumbersOfAccompanyingAdultPage: EecWhatIsTheNameOrPassportNumbersOfAccompanyingAdultPage,
  eecWhatIsTheProblemWithYourEVisaPage: EecWhatIsTheProblemWithYourEVisaPage,
  eecWhatIsValidFromPage: EecWhatIsValidFromPage,
  eecWhatIsValidToPage: EecWhatIsValidToPage,
  eecWhatIsWrongWithYourPhotoPage: EecWhatIsWrongWithYourPhotoPage,
  eecWhatIsYourCorrectNamePage: EecWhatIsYourCorrectNamePage,
  eecWhatIsYourCorrectNationality: EecWhatIsYourCorrectNationality,
  eecWhatIsYourDateOfBirthPage: EecWhatIsYourDateOfBirthPage,
  eecWhatIsYourFutureSpouseOrCivilPartnerName: EecWhatIsYourFutureSpouseOrCivilPartnerName,
  eecWhatIsYourNationalInsuranceNumberPage: EecWhatIsYourNationalInsuranceNumberPage,
  eecWhatIsYourPhoneNumberToSignInToYourAccountPage: EecWhatIsYourPhoneNumberToSignInToYourAccountPage,
  eecWhatIsYourShareCodePage: EecWhatIsYourShareCodePage,
  eecWhatIsYourSponsorLicenceNumber: EecWhatIsYourSponsorLicenceNumber,
  eecWhatIsYourStatusPage: EecWhatIsYourStatusPage,
  eecWhatYouCanAndCannotDoInUkPage: EecWhatYouCanAndCannotDoInUkPage,
  eecYourCurrentEvisaDetailsPage: EecYourCurrentEvisaDetailsPage,
};

export type Pages = { [Key in keyof typeof pageClasses]: InstanceType<(typeof pageClasses)[Key]> };

export const test = base.extend<{ pages: Pages }>({
  pages: async ({ page }, use) => {
    const pages = Object.fromEntries(
      Object.entries(pageClasses).map(([name, PageClass]) => [name, new PageClass(page)]),
    ) as Pages;
    await use(pages);
  },
});

export const expect = test.expect;
