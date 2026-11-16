import { DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixture/fixtures';
import { ConstantsLib as c } from '../utility-helper/constants-lib';

export const { Given, When, Then } = createBdd(test);

Given('I visit the E-Visa error correction page', async ({ pages }) => {
  await pages.eecAreYouCurrentlyInTheUkPage.openEec();
});

When('I answer {string} on {string} page and choose to continue for EEC', async ({ pages }, answer: string, pageName: string) => {
  switch (pageName.toLowerCase()) {
    case 'are you currently in the uk?': await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(answer); break;
    case 'do you have permission to stay in the uk as a refugee?': await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(answer); break;
    default: throw new Error(`Invalid page name: ${pageName}`);
  }
});

When('I fill out the answers to EEC form pertaining to {string} happy path test', async ({ pages }, scenario: string) => {
  switch (scenario.toLowerCase()) {
    case 't1: test with view your visa, brp number, email, license and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.completeWhatIsTheProblemWithYourEVisaPage('Name', c.CORRECT_NAME);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'BRP number', c.BRP_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't2: test with update your account, gwf number, email, license  and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('Update your UKVI account details');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectSponsorLicenceAndEnter(c.SPONSOR_LICENCE_NUMBER);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'GWF number', c.GWF_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't3: test with report error, uan number, email, license and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('Report an error with your eVisa');
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectSponsorLicenceAndEnter(c.SPONSOR_LICENCE_NUMBER);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'UAN number', c.UAN_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't4: test with cannot access evisa, passport number, email and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('No, I cannot access my eVisa or UKVI account');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecProvideMoreDetailsAboutTheErrorWithYourEvisaPage.completeProvideMoreDetailsAboutTheErrorWithYourEvisaPage(c.TEXT_AREA_FIELD_DATA);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'Passport number', c.PASSPORT_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't5: test with view your visa, ukvi customer number, email and form completed by themself':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectNameAndEnter(c.CORRECT_NAME);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPageWithRetry(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'UKVI customer number', c.UKVI_CUSTOMER_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.NO);
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't6: test with update your account, i do not have a reference number, uk address and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('Update your UKVI account details');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectNameAndEnter(c.CORRECT_NAME);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'I do not have a reference number', '');
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('UK address', '', c.CONTACT_ADDRESS_LINE_1, '', c.CONTACT_TOWN, c.CONTACT_COUNTY, c.CONTACT_POSTCODE);
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't7: test with view your visa, brp number, email, photo and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectPhotoAndEnter(c.PHOTO_PROBLEM);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'BRP number', c.BRP_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't8: test with view your visa, brp number, email, share code and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectShareCodeAndEnter(c.SHARE_CODE);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'BRP number', c.BRP_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't9: test with view your visa, brp number, email, nationality and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectNationalityAndEnter(c.NATIONALITY);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'BRP number', c.BRP_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't10: test with view your visa, brp number, email, future spouse or civil partner name and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectFutureSpouseOrCivilPartnerNameAndEnter(c.FULL_NAME);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'BRP number', c.BRP_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't11: test with view your visa, brp number, email, ship and port details and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectShipAndPortDetailsAndEnter(c.SHIP_AND_PORT_DETAILS);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'BRP number', c.BRP_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't12: test with view your visa, brp number, email address to sign in to your account and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectEmailAddressToSignInAndEnter(c.SIGN_IN_EMAIL);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'BRP number', c.BRP_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't13: test with view your visa, brp number, phone number to sign in to your account and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectPhoneNumberToSignInAndEnter(c.SIGN_IN_PHONE);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'BRP number', c.BRP_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't14: test with view your visa, brp number, what you can and cannot do in the uk and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectWhatYouCanAndCannotDoInUkAndEnter(c.RESTRICTIONS_DETAILS);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'BRP number', c.BRP_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't15: test with view your visa, brp number, my problem is not listed and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectMyProblemIsNotListedAndEnter(c.UNLISTED_PROBLEM);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'BRP number', c.BRP_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't16: test with view your visa, brp number, valid from and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectValidFromAndEnter(c.VALID_FROM);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'BRP number', c.BRP_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't17: test with view your visa, brp number, valid to and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectValidToAndEnter(c.VALID_TO);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'BRP number', c.BRP_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't18: test with view your visa, brp number, name or passport numbers of accompanying adult and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectNameOrPassportNumbersOfAccompanyingAdultAndEnter(c.ONE_ACCOMPANYING_ADULT);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'BRP number', c.BRP_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    case 't19: test with view your visa, brp number, name or passport numbers of accompanying adult for 2 adults and form completed on behalf of someone else':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.assertPageTitle(await pages.eecWhatIsTheProblemWithYourEVisaPage.expectedPageTitle());
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectNameOrPassportNumbersOfAccompanyingAdultAndEnter(c.TWO_ACCOMPANYING_ADULTS);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'BRP number', c.BRP_NUMBER);
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.YES);
      await pages.eecDoYouGetAsylumSupportPage.completeDoYouGetAsylumSupportPage(c.YES);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(c.YES);
      await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
      await pages.eecCheckYourAnswersPage.completeCheckYourAnswersPage();
      break;
    default: throw new Error(`Invalid scenario: ${scenario}`);
  }
});

When('I answer {string}', async ({ pages }, _answer: string) => {
  await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('No, I cannot access my eVisa or UKVI account');
});

When('I answer {string} and {string} on {string} page and choose to continue for EEC', async ({ pages }, answer: string, date: string, _pageName: string) => {
  await pages.eecHaveYouBookedYourTravelToTheUkPage.completeHaveYouBookedYourTravelToTheUkPage(answer, date);
});

When('I select continue to report an error', async ({ pages }) => {
  await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
});

When('I select continue', async ({ pages }) => {
  await pages.basePage.clickContinue();
});

When('I select the back button', async ({ page }) => {
  await page.getByRole('link', { name: 'Back' }).click();
});

When('I choose to navigate to {string} page for EEC', async ({ pages }, pageName: string) => {
  switch (pageName.toLowerCase()) {
    case 'are you currently in the uk':
      break;
    case 'have you booked your travel to the uk?':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.NO);
      break;
    case 'what is the problem with your evisa?':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      break;
    case 'personal details':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectCheckboxAndEnterTextInto("My problem isn't listed", 'Test problem');
      break;
    case 'do you have permission to stay in the uk as a refugee?':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectCheckboxAndEnterTextInto('Name', c.CORRECT_NAME);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'I do not have a reference number', '');
      break;
    case 'how should we contact you about your evisa?':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectCheckboxAndEnterTextInto('Name', c.CORRECT_NAME);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'I do not have a reference number', '');
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.NO);
      break;
    case 'are you completing this form on behalf of someone else?':
      await pages.eecAreYouCurrentlyInTheUkPage.completeAreYouCurrentlyInTheUkPage(c.YES);
      await pages.eecCanYouAccessYourEVisaPage.completeCanYouAccessYourEVisaPage('Yes, I can see an eVisa in my UKVI account');
      await pages.eecWhatAreYouTryingToDoPage.completeWhatAreYouTryingToDoPage('View your eVisa or prove your immigration status');
      await pages.eecBeforeYouReportAnErrorWithYourEVisaPage.completeBeforeYouReportAnErrorWithYourEVisaPage();
      await pages.eecWhatIsTheProblemWithYourEVisaPage.selectCheckboxAndEnterTextInto('Name', c.CORRECT_NAME);
      await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(c.FULL_NAME, c.DOB_1978, c.NATIONALITY, 'I do not have a reference number', '');
      await pages.eecDoYouHavePermissionToStayInTheUkAsARefugeePage.completeDoYouHavePermissionToStayInTheUkAsARefugeePage(c.NO);
      await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage('Email', c.SAS_HOF_EMAIL, '', '', '', '', '');
      break;
    default: throw new Error(`Invalid page name: ${pageName}`);
  }
});

Then('I should see {string} page for EEC', async ({ pages }, title: string) => {
  await expect(pages.basePage.headerText).toHaveText(title);
});

Then('I should see {string} error message displayed', async ({ pages }, text: string) => {
  await expect(pages.basePage.errorSummaryTitle).toHaveText(text);
});

Then('I should see {string} error summary', async ({ pages }, text: string) => {
  await expect(pages.basePage.errorSummaryItems).toHaveText(text.split('¬'));
});

Then('Finish and return to GOV.UK button is displayed for EEC', async ({ pages }) => {
  await expect(pages.eecRequestSentPage.finishedAndReturnGovBtn).toBeVisible();
});

When('I enter {string} characters in the Describe the error field on the {string} page', async ({ pages }, size: string, _pageName: string) => {
  await pages.eecProvideMoreDetailsAboutTheErrorWithYourEvisaPage.enterProvideMoreDetailsAboutTheErrorWithYourEvisaDetails('a'.repeat(Number(size)));
});

When('I select {string} checkbox and enter {string} value in {string} field on What is the problem with your eVisa? page for EEC', async ({ pages }, option: string, value: string, _question: string) => {
  await pages.eecWhatIsTheProblemWithYourEVisaPage.selectCheckboxAndEnterTextInto(option, value);
});

When('I select {string} checkbox and enter {string} characters in {string} field on What is the problem with your eVisa? page for EEC', async ({ pages }, option: string, size: string, _question: string) => {
  await pages.eecWhatIsTheProblemWithYourEVisaPage.selectCheckboxAndEnterTextInto(option, 'a'.repeat(Number(size)));
});

When('I deselect {string} checkbox on What is the problem with your eVisa? page for EEC', async ({ pages }, option: string) => {
  await pages.eecWhatIsTheProblemWithYourEVisaPage.deselectCheckbox(option);
});

When('I complete Personal details fields with the below details:', async ({ pages }, dataTable: DataTable) => {
  const data = dataTable.rowsHash();

  const fullName = data['Full name'];
  const dob = data['Date of birth'];
  const nationality = data['Country of nationality'];
  const radioOption = data['Radio option'];
  const referenceNumber = data['Radio option reference number'];

  await pages.eecYourCurrentEvisaDetailsPage.completeCurrentEvisaDetailsPage(
    fullName, dob, nationality, radioOption, referenceNumber, nationality === 'England',
  );
});

When('I complete Enter your travel document details fields with the below details:', async ({ pages }, dataTable: DataTable) => {
  const data = dataTable.rowsHash();

  const documentNumber = data['Document number'];
  const nationality = data['Country of nationality'];
  const dob = data['Date of birth'];

  await pages.eecEnterYourTravelDocumentDetailsPage.completeEnterYourTravelDocumentDetailsPage(documentNumber, nationality, dob);
});

When('I complete How should we contact you about your eVisa? via email with the below details:', async ({ pages }, dataTable: DataTable) => {
  const data = dataTable.rowsHash();

  const radioOption = data['Radio Option'];
  const email = data['Email Value'];

  await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage(radioOption, email, '', '', '', '', '');
});

When('I complete How should we contact you about your eVisa? via uk address with the below details:', async ({ pages }, dataTable: DataTable) => {
  const data = dataTable.rowsHash();

  const radioOption = data['Radio Option'];
  const addressLine1 = data['Address line 1'];
  const addressLine2 = data['Address line 2'];
  const townOrCity = data['Town or City'];
  const country = data['Country'];
  const postcode = data['Postcode'];

  await pages.eecHowShouldWeContactYouAboutYourEVisaPage.completeHowShouldWeContactYouAboutYourEvisaPage(
    radioOption, '', addressLine1, addressLine2, townOrCity, country, postcode,
  );
});

When('I complete What are your details fields with the below details:', async ({ pages }, dataTable: DataTable) => {
  const data = dataTable.rowsHash();

  const fullName = data['Full name'];
  const email = data['Email address'];
  const typeOfSupport = data['Type of support'];

  await pages.eecWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(fullName, email, typeOfSupport);
});

When('I answer {string} on Are you completing this form on behalf of someone else? page for EEC and choose to continue', async ({ pages }, answer: string) => {
  await pages.eecAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(answer);
});
