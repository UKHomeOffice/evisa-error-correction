@EecRegression1
@regression1 @RegressionTestCI
#Feature: EEC - E-Visa Error Correction Service Form
#https://collaboration.homeoffice.gov.uk/jira/browse/EEC-1

Feature: EEC - E-Visa Error Correction Service Form
  @EEC-E2E
  Scenario Outline: E-Visa Error Correction Service form E2E test
    Given I visit the E-Visa error correction page
    When I fill out the answers to EEC form pertaining to "<EEC Journey Test>" happy path test
    Then I should see "Request sent" page for EEC
    And Finish and return to GOV.UK button is displayed for EEC
    Examples:
       | EEC Journey Test                                                                                                                                    |
       | T1: test with view your visa, brp number, email, license and form completed on behalf of someone else                                               |
       | T2: test with update your account, gwf number, email, license  and form completed on behalf of someone else                                         |
       | T3: test with report error, uan number, email, license and form completed on behalf of someone else                                                 |
       | T4: test with cannot access eVisa, passport number, email and form completed on behalf of someone else                                              |
       | T5: test with view your visa, ukvi customer number, email and form completed by themself                                                            |
       | T6: test with update your account, i do not have a reference number, uk address and form completed on behalf of someone else                        |
       | T7: test with view your visa, brp number, email, photo and form completed on behalf of someone else                                                 |
       | T8: test with view your visa, brp number, email, share code and form completed on behalf of someone else                                            |
       | T9: test with view your visa, brp number, email, nationality and form completed on behalf of someone else                                           |
       | T10: test with view your visa, brp number, email, future spouse or civil partner name and form completed on behalf of someone else                  |
       | T11: test with view your visa, brp number, email, ship and port details and form completed on behalf of someone else                                |
       | T12: test with view your visa, brp number, email address to sign in to your account and form completed on behalf of someone else                    |
       | T13: test with view your visa, brp number, phone number to sign in to your account and form completed on behalf of someone else                     |
       | T14: test with view your visa, brp number, what you can and cannot do in the uk and form completed on behalf of someone else                        |
       | T15: test with view your visa, brp number, my problem is not listed and form completed on behalf of someone else                                    |
       | T16: test with view your visa, brp number, valid from and form completed on behalf of someone else                                                  |
       | T17: test with view your visa, brp number, valid to and form completed on behalf of someone else                                                    |
       | T18: test with view your visa, brp number, name or passport numbers of accompanying adult and form completed on behalf of someone else              |
       | T19: test with view your visa, brp number, name or passport numbers of accompanying adult for 2 adults and form completed on behalf of someone else |



