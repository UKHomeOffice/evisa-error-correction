import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { DataTable } from '@cucumber/cucumber';
import { test } from '../fixture/fixtures';
import { eecScenarioData } from '../test-data/eec-scenarios';

export const { Given, When, Then } = createBdd(test);

Given('I visit the E-Visa error correction page', async ({ pages }) => {
  await pages.eecPage.navigateToUrl();
});

When('I fill out the answers to EEC form pertaining to {string} happy path test', async ({ pages }, scenario: string) => {
  const data = eecScenarioData[scenario.toLowerCase()];
  if (!data) {
    throw new Error(`Invalid EEC scenario: ${scenario}`);
  }

  await pages.eecPage.completeScenario(data);
});

Then('I should see {string} page for EEC', async ({ pages }, expectedPageHeaderText: string) => {
  await pages.eecPage.expectRequestSent(expectedPageHeaderText);
});

Then('Finish and return to GOV.UK button is displayed for EEC', async ({ pages }) => {
  await pages.eecPage.expectFinishAndReturnButton();
});

When('I choose to navigate to {string} page for EEC', async ({ pages }, pageName: string) => {
  await pages.eecPage.navigateToValidationPage(pageName);
});

When('I select continue', async ({ pages }) => {
  await pages.eecPage.clickContinue();
});

When('I select the back button', async ({ pages }) => {
  await pages.eecPage.clickBack();
});

Then('I should see {string} error message displayed', async ({ pages }, expectedErrorHeading: string) => {
  expect(expectedErrorHeading).toBe('There is a problem');
  await pages.eecPage.expectErrorMessageDisplayed();
});

Then('I should see {string} error summary', async ({ pages }, expectedErrorSummary: string) => {
  await pages.eecPage.expectErrorSummary(expectedErrorSummary);
});

When('I answer {string} on {string} page and choose to continue for EEC', async ({ pages }, answer: string, _pageName: string) => {
  await pages.eecPage.answerCurrentPage(answer);
});

When('I answer {string}', async ({ pages }, answer: string) => {
  await pages.eecPage.answerCannotAccessEvisa(answer);
});

When('I answer {string} and {string} on {string} page and choose to continue for EEC', async ({ pages }, answer: string, dateValue: string, _pageName: string) => {
  await pages.eecPage.answerBookedTravel(answer, dateValue);
});

When('I select continue to report an error', async ({ pages }) => {
  await pages.eecPage.clickContinue();
});

When('I enter {string} characters in the Describe the error field on the {string} page', async ({ pages }, charSize: string, _pageName: string) => {
  await pages.eecPage.completeTextareaByLabel('Describe the error', 'a'.repeat(Number(charSize)));
});

When('I complete Enter your travel document details fields with the below details:', async ({ pages }, dataTable: DataTable) => {
  const data = dataTable.rowsHash();
  await pages.eecPage.completeTravelDocumentDetails(
    data['Document number'],
    data['Country of nationality'],
    data['Date of birth']
  );
});

When('I select {string} checkbox and enter {string} value in {string} field on What is the problem with your eVisa? page for EEC', async ({ pages }, problemLabel: string, value: string, _fieldName: string) => {
  await pages.eecPage.selectProblemCheckboxAndEnter(problemLabel, value);
});

When('I select {string} checkbox and enter {string} characters in {string} field on What is the problem with your eVisa? page for EEC', async ({ pages }, problemLabel: string, charSize: string, _fieldName: string) => {
  await pages.eecPage.selectProblemCheckboxAndEnter(problemLabel, charSize, true);
});

When('I deselect {string} checkbox on What is the problem with your eVisa? page for EEC', async ({ pages }, problemLabel: string) => {
  await pages.eecPage.deselectProblemCheckbox(problemLabel);
});

When('I complete Personal details fields with the below details:', async ({ pages }, dataTable: DataTable) => {
  const data = dataTable.rowsHash();
  await pages.eecPage.completeCurrentEvisaDetailsForValidation(
    data['Full name'],
    data['Date of birth'],
    data['Country of nationality'],
    data['Radio option'],
    data['Radio option reference number']
  );
});

When('I complete How should we contact you about your eVisa? via email with the below details:', async ({ pages }, dataTable: DataTable) => {
  const data = dataTable.rowsHash();
  await pages.eecPage.completeEmailContact(data['Email Value']);
});

When('I complete How should we contact you about your eVisa? via uk address with the below details:', async ({ pages }, dataTable: DataTable) => {
  const data = dataTable.rowsHash();
  await pages.eecPage.completeUkAddressContact(
    data['Address line 1'],
    data['Address line 2'],
    data['Town or City'],
    data.Postcode
  );
});

When('I answer {string} on Are you completing this form on behalf of someone else? page for EEC and choose to continue', async ({ pages }, answer: string) => {
  await pages.eecPage.answerCurrentPage(answer);
});

When('I complete What are your details fields with the below details:', async ({ pages }, dataTable: DataTable) => {
  const data = dataTable.rowsHash();
  await pages.eecPage.completeRepresentativeDetails(
    data['Full name'],
    data['Email address'],
    data['Type of support']
  );
});