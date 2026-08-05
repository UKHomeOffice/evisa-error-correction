@EecRegression1
@EEC-V

Feature: EEC - E-Visa Error Correction Service Form validation test
#https://collaboration.homeoffice.gov.uk/jira/browse/EEC-1

#Are you currently in the UK
#Can you access your eVisa?
#Provide more details about the error with your eVisa
  Scenario: EEC Test-1 Validate the above pages
    Given I visit the E-Visa error correction page
    When I choose to navigate to "Are you currently in the UK" page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Select if you are currently in the UK" error summary
    When I answer "Yes" on "Are you currently in the UK?" page and choose to continue for EEC
#Page: Can you access your eVisa?
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Select yes if you can access your eVisa" error summary
    When I answer "No, I cannot access my eVisa or UKVI account"
    And I select continue to report an error
#Page: Provide more details about the error with your eVisa
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter the error with your eVisa" error summary
#User enters more than 2000 characters
    When I enter "2001" characters in the Describe the error field on the "Provide more details about the error with your eVisa" page
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "You have exceeded the 2000 character limit" error summary


  @EEC-V2
# Have you booked your travel to the UK? page
# Enter your travel document details page
# Did you pay for a priority or super priority service?
  Scenario: EEC Test-2 Validate the above pages
    Given I visit the E-Visa error correction page
    When I choose to navigate to "Have you booked your travel to the UK?" page for EEC
#Have you booked your travel to the UK? page
#No data entered in any of the fields
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Select if you have booked your travel to the UK" error summary
#Date validation
    When I answer "Yes" and "" on "Have you booked your travel to the UK?" page and choose to continue for EEC
    Then I should see "There is a problem" error message displayed
    And I should see "Enter the correct date your travel was booked" error summary
    When I answer "Yes" and "Today's date" on "Have you booked your travel to the UK?" page and choose to continue for EEC
#Enter your travel document details page
#No data entered in any of the fields
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter your document number¬Enter your country of nationality¬Enter your date of birth" error summary
#Document number: Only letters and numbers, no special characters or space and Date of birth: can not be in the past
    When I complete Enter your travel document details fields with the below details:
      | Document number        | £12038397A      |
      | Country of nationality | Aland Islands   |
      | Date of birth          | Tomorrow's date |
    Then I should see "There is a problem" error message displayed
    And I should see "Document number must only include numbers and letters¬Date of birth must be in the past" error summary
#Date of birth: has special characters
    When I complete Enter your travel document details fields with the below details:
      | Document number        | 1             |
      | Country of nationality | Aland Islands |
      | Date of birth          | *2/02/2000    |
    Then I should see "There is a problem" error message displayed
    And I should see "The date must only contain numbers. For example, 31 3 1980" error summary
#Date of birth: is 120 years or more in the past
    When I complete Enter your travel document details fields with the below details:
      | Document number        | 120383978A              |
      | Country of nationality | Aland Islands           |
      | Date of birth          | more than 120 years ago |
    Then I should see "There is a problem" error message displayed
    And I should see "Enter a real date of birth" error summary
    When I complete Enter your travel document details fields with the below details:
      | Document number        | 120383978A       |
      | Country of nationality | Aland Islands    |
      | Date of birth          | Yesterday's date |
#Did you pay for a priority or super priority service? page
    Then I should see "Did you pay for a priority or super priority service?" page for EEC

  @EEC-V3
# What is the problem with your eVisa page
  Scenario: EEC Test-3 Validate the above pages
    Given I visit the E-Visa error correction page
    When I choose to navigate to "What is the problem with your eVisa?" page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
#No checkbox selected
    Then I should see "There is a problem" error message displayed
    And I should see "Select what the problem is" error summary
#Name field: no data entered
    When I select "Name" checkbox and enter "" value in "What is your correct name?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter your correct name" error summary
    When I select the back button
    When I deselect "Name" checkbox on What is the problem with your eVisa? page for EEC
#DOB field: no data entered
    And I select "Date of birth" checkbox and enter "" value in "What is your correct date of birth?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter your date of birth" error summary
    When I select the back button
    When I deselect "Date of birth" checkbox on What is the problem with your eVisa? page for EEC
#DOB field: Incorrect data entered
    And I select "Date of birth" checkbox and enter "11/13/1990" value in "What is your correct date of birth?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "The date must only contain numbers. For example, 31 3 1980" error summary
    When I select the back button
    When I deselect "Date of birth" checkbox on What is the problem with your eVisa? page for EEC
#Nationality field: no data entered
    When I select "Nationality" checkbox and enter "" value in "What is your correct nationality?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter your nationality" error summary
    When I select the back button
    When I deselect "Nationality" checkbox on What is the problem with your eVisa? page for EEC
#Status field: no data entered
    When I select "Status" checkbox and enter "" value in "What problem are you having with your immigration status?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter what is wrong with your status" error summary
    When I select the back button
    When I deselect "Status" checkbox on What is the problem with your eVisa? page for EEC
#Valid from field: no data entered
    And I select "Valid from" checkbox and enter "" value in "What is the correct date your visa is valid from?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter the date your visa is valid from" error summary
    When I select the back button
    When I deselect "Valid from" checkbox on What is the problem with your eVisa? page for EEC
#Valid to field: no data entered
    And I select "Valid to" checkbox and enter "" value in "What is the correct date your visa is valid to?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter the date your visa is valid to" error summary
    When I select the back button
    When I deselect "Valid to" checkbox on What is the problem with your eVisa? page for EEC
#National Insurance number field: no data entered
    And I select "National Insurance number" checkbox and enter "" value in "What is your correct National Insurance number?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter your National Insurance number" error summary
    When I select the back button
    When I deselect "National Insurance number" checkbox on What is the problem with your eVisa? page for EEC
#Photo text field: no data entered
    And I select "Photo" checkbox and enter "" value in "What is wrong with your photo?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Describe the problem you are having" error summary
    When I select the back button
    When I deselect "Photo" checkbox on What is the problem with your eVisa? page for EEC
#What you can and cannot do in the UK field: no data entered
    And I select "What you can and cannot do in the UK" checkbox and enter "" value in "What is wrong with the details of what you can and cannot do in the UK?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter what is wrong with the details of what you can and cannot do in the UK" error summary
    When I select the back button
    When I deselect "What you can and cannot do in the UK" checkbox on What is the problem with your eVisa? page for EEC
#What you can and cannot do in the UK field: 500 character limit
    And I select "What you can and cannot do in the UK" checkbox and enter "501" characters in "What is wrong with the details of what you can and cannot do in the UK?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter details that are 500 characters or less" error summary
    When I select the back button
    When I deselect "What you can and cannot do in the UK" checkbox on What is the problem with your eVisa? page for EEC
#Share code field: no data entered
    And I select "Share code" checkbox and enter "" value in "Which share code are you unable to create?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter which share code you are unable to create" error summary
    When I select the back button
    When I deselect "Share code" checkbox on What is the problem with your eVisa? page for EEC
#Email address to sign in to your account field: no data entered
    And I select "Email address to sign in to your account" checkbox and enter "" value in "What is the correct email address where you can receive security codes?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter the correct email address where you can receive security codes" error summary
    When I select the back button
    When I deselect "Email address to sign in to your account" checkbox on What is the problem with your eVisa? page for EEC
#Email address to sign in to your account field: email address start with @ symbol
    And I select "Email address to sign in to your account" checkbox and enter "@Kings.com" value in "What is the correct email address where you can receive security codes?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter an email address in the correct format, like name@example.com" error summary
    When I select the back button
    When I deselect "Email address to sign in to your account" checkbox on What is the problem with your eVisa? page for EEC
#Email address to sign in to your account field: email address end with @ symbol
    And I select "Email address to sign in to your account" checkbox and enter "Kings.com@" value in "What is the correct email address where you can receive security codes?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter an email address in the correct format, like name@example.com" error summary
    When I select the back button
    When I deselect "Email address to sign in to your account" checkbox on What is the problem with your eVisa? page for EEC
#Email address to sign in to your account field: email address short Contact email address is less than 6 characters
    And I select "Email address to sign in to your account" checkbox and enter "a@b.c" value in "What is the correct email address where you can receive security codes?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter an email address in the correct format, like name@example.com" error summary
    When I select the back button
    When I deselect "Email address to sign in to your account" checkbox on What is the problem with your eVisa? page for EEC
#Email address to sign in to your account field: email address does not have @ symbol
    And I select "Email address to sign in to your account" checkbox and enter "TesterTlf.co" value in "What is the correct email address where you can receive security codes?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter an email address in the correct format, like name@example.com" error summary
    When I select the back button
    When I deselect "Email address to sign in to your account" checkbox on What is the problem with your eVisa? page for EEC
#Phone number to sign in to your account field: no data entered
    And I select "Phone number to sign in to your account" checkbox and enter "" value in "What is the correct phone number where you can receive security codes?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter a phone number" error summary
    When I select the back button
    When I deselect "Phone number to sign in to your account" checkbox on What is the problem with your eVisa? page for EEC
#Phone number to sign in to your account field: more than 12
    And I select "Phone number to sign in to your account" checkbox and enter "016155010012" value in "What is the correct phone number where you can receive security codes?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192" error summary
    When I select the back button
    When I deselect "Phone number to sign in to your account" checkbox on What is the problem with your eVisa? page for EEC
#Phone number to sign in to your account field: less than 12
    And I select "Phone number to sign in to your account" checkbox and enter "+44808157019" value in "What is the correct phone number where you can receive security codes?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192" error summary
    When I select the back button
    When I deselect "Phone number to sign in to your account" checkbox on What is the problem with your eVisa? page for EEC
#Phone number to sign in to your account field: special character
    And I select "Phone number to sign in to your account" checkbox and enter "&448081570192" value in "What is the correct phone number where you can receive security codes?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192" error summary
    When I select the back button
    When I deselect "Phone number to sign in to your account" checkbox on What is the problem with your eVisa? page for EEC
#Phone number to sign in to your account field: Non-numeric
    And I select "Phone number to sign in to your account" checkbox and enter "abc123456789" value in "What is the correct phone number where you can receive security codes?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192" error summary
    When I select the back button
    When I deselect "Phone number to sign in to your account" checkbox on What is the problem with your eVisa? page for EEC

#Sponsor license number field: no data entered
    And I select "Sponsor licence number" checkbox and enter "  " value in "What is your correct sponsor licence number?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter your sponsor licence number" error summary
    When I select the back button
    When I deselect "Sponsor licence number" checkbox on What is the problem with your eVisa? page for EEC
#Sponsor license number field: more than 20
    And I select "Sponsor licence number" checkbox and enter "016155244422220100122" value in "What is your correct sponsor licence number?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Sponsor licence number must be 20 characters or less" error summary
    When I select the back button
    When I deselect "Sponsor licence number" checkbox on What is the problem with your eVisa? page for EEC
#Sponsor license number field: special character
    And I select "Sponsor licence number" checkbox and enter "&448081570192" value in "What is your correct sponsor licence number?" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Sponsor licence number can only contain letters a to z or numbers 0 to 9" error summary
    When I select the back button
    When I deselect "Sponsor licence number" checkbox on What is the problem with your eVisa? page for EEC

#My problem isn't listed field: no data entered
    And I select "My problem isn't listed" checkbox and enter "" value in "Describe the problem you are having" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter the problem you are having" error summary
    When I select the back button
    When I deselect "My problem isn't listed" checkbox on What is the problem with your eVisa? page for EEC
#My problem isn't listed field: 500 character limit
    And I select "My problem isn't listed" checkbox and enter "501" characters in "Describe the problem you are having" field on What is the problem with your eVisa? page for EEC
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Description must be 500 characters or less" error summary

  @EEC-V4
#Personal details page
  Scenario: EEC Test-4 Validate the above pages
    Given I visit the E-Visa error correction page
    When I choose to navigate to "Personal details" page for EEC
    And I select continue
#No data entered in any of the fields
    Then I should see "There is a problem" error message displayed
    And I should see "Enter your full name¬Enter your date of birth¬Enter a country of nationality¬Enter a reference number" error summary
#Full name invalid and 'Date of birth’ in the future and 'Country of nationality’ invalid (value not selected from list)
    When I complete Personal details fields with the below details:
      | Full name                     | T3d H0F         |
      | Date of birth                 | Tomorrow's date |
      | Country of nationality        | England         |
      | Radio option                  | BRP number      |
      | Radio option reference number | RZX123456       |
    Then I should see "There is a problem" error message displayed
#    And I should see "Full name must only include letters a to z, spaces, hyphens and apostrophes¬Date of birth must be in the past¬Enter a country of nationality" error summary
#BRP field empty
    When I complete Personal details fields with the below details:
      | Full name                     | Top Hof    |
      | Date of birth                 | 11/11/1990 |
      | Country of nationality        | Spain      |
      | Radio option                  | BRP number |
      | Radio option reference number |            |
    Then I should see "There is a problem" error message displayed
    And I should see "What is your BRP number?" error summary
#GWF field empty
    When I complete Personal details fields with the below details:
      | Full name                     | Top Hof    |
      | Date of birth                 | 11/11/1990 |
      | Country of nationality        | Spain      |
      | Radio option                  | GWF number |
      | Radio option reference number |            |
    Then I should see "There is a problem" error message displayed
    And I should see "What is your GWF number?" error summary
#UAN field empty
    When I complete Personal details fields with the below details:
      | Full name                     | Top Hof    |
      | Date of birth                 | 11/11/1990 |
      | Country of nationality        | Spain      |
      | Radio option                  | UAN number |
      | Radio option reference number |            |
    Then I should see "There is a problem" error message displayed
    And I should see "What is your UAN number?" error summary
#Passport field empty
    When I complete Personal details fields with the below details:
      | Full name                     | Top Hof         |
      | Date of birth                 | 11/11/1990      |
      | Country of nationality        | Spain           |
      | Radio option                  | Passport number |
      | Radio option reference number |                 |
    Then I should see "There is a problem" error message displayed
    And I should see "What is your passport number?" error summary
#UKVI customer number field empty
    When I complete Personal details fields with the below details:
      | Full name                     | Top Hof              |
      | Date of birth                 | 11/11/1990           |
      | Country of nationality        | Spain                |
      | Radio option                  | UKVI customer number |
      | Radio option reference number |                      |
    Then I should see "There is a problem" error message displayed
    And I should see "What is your UKVI customer number?" error summary
#BRP field is invalid
    When I complete Personal details fields with the below details:
      | Full name                     | Top Hof    |
      | Date of birth                 | 11/11/1990 |
      | Country of nationality        | Spain      |
      | Radio option                  | BRP number |
      | Radio option reference number | Z1234567   |
    Then I should see "There is a problem" error message displayed
    And I should see "Enter your BRP number in the correct format; for example RZX123456 or RZ1234567" error summary
#GWF field is invalid
    When I complete Personal details fields with the below details:
      | Full name                     | Top Hof      |
      | Date of birth                 | 11/11/1990   |
      | Country of nationality        | Spain        |
      | Radio option                  | GWF number   |
      | Radio option reference number | GWD012345678 |
    Then I should see "There is a problem" error message displayed
    And I should see "Enter your GWF number in the correct format; for example, GWF012345678" error summary
#UAN field is invalid
    When I complete Personal details fields with the below details:
      | Full name                     | Top Hof            |
      | Date of birth                 | 11/11/1990         |
      | Country of nationality        | Spain              |
      | Radio option                  | UAN number         |
      | Radio option reference number | 234-1234-1234-1234 |
    Then I should see "There is a problem" error message displayed
    And I should see "Enter your UAN in the correct format; for example, 1234-1234-1234-1234" error summary
#UKVI customer number field is invalid
    When I complete Personal details fields with the below details:
      | Full name                     | Top Hof              |
      | Date of birth                 | 11/11/1990           |
      | Country of nationality        | Spain                |
      | Radio option                  | UKVI customer number |
      | Radio option reference number | KK12345678           |
    Then I should see "There is a problem" error message displayed
    And I should see "UKVI customer number must start with KX" error summary
#UKVI customer number field incorrect length
    When I complete Personal details fields with the below details:
      | Full name                     | Top Hof              |
      | Date of birth                 | 11/11/1990           |
      | Country of nationality        | Spain                |
      | Radio option                  | UKVI customer number |
      | Radio option reference number | KX1234567            |
    Then I should see "There is a problem" error message displayed
    And I should see "UKVI customer number must be 10 characters long" error summary


#Do you have permission to stay in the UK as a refugee page
#Do you get asylum support page
  Scenario: EEC Test-5 Validate the above pages
    Given I visit the E-Visa error correction page
    When I choose to navigate to "Do you have permission to stay in the UK as a refugee?" page for EEC
#Do you have permission to stay in the UK as a refugee page
#No data entered in any of the fields
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Select if you have permission to stay in the UK as a refugee" error summary
    When I answer "Yes" on "Do you have permission to stay in the UK as a refugee?" page and choose to continue for EEC
#Do you get asylum support page
#No data entered in any of the fields
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Select if you are receiving asylum support" error summary



#How should we contact you about your eVisa page
  Scenario: EEC Test-6 Validate the above pages
    Given I visit the E-Visa error correction page
    When I choose to navigate to "How should we contact you about your eVisa?" page for EEC
#No data entered in any of the fields
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Select how you want to be contacted" error summary
#Email address empty
    When I complete How should we contact you about your eVisa? via email with the below details:
      | Radio Option | Email |
      | Email Value  |       |
    Then I should see "There is a problem" error message displayed
    And I should see "Enter an email address" error summary
#Email address incorrect format
    When I complete How should we contact you about your eVisa? via email with the below details:
      | Radio Option | Email     |
      | Email Value  | @test.com |
    Then I should see "There is a problem" error message displayed
    And I should see "Enter an email address in the correct format, like name@example.com" error summary
#Address line 1, Town or city, and Postcode fields are empty
    When I complete How should we contact you about your eVisa? via uk address with the below details:
      | Radio Option   | UK address |
      | Address line 1 |            |
      | Address line 2 |            |
      | Town or City   |            |
      | Country        |            |
      | Postcode       |            |
    Then I should see "There is a problem" error message displayed
    And I should see "Enter address line 1, typically your building and street¬Enter your town or city¬Enter your postcode" error summary
#UK address: Postcode incorrect format
    When I complete How should we contact you about your eVisa? via uk address with the below details:
      | Radio Option   | UK address |
      | Address line 1 | 12         |
      | Address line 2 | Kings      |
      | Town or City   | Leeds      |
      | Country        | UK         |
      | Postcode       | L!2 1PP    |
    Then I should see "There is a problem" error message displayed
    And I should see "Enter a valid UK postcode" error summary



#Are you completing this form on behalf of someone else? page
#What are your details page
  Scenario: EEC Test-7 Validate the above pages
    Given I visit the E-Visa error correction page
    When I choose to navigate to "Are you completing this form on behalf of someone else?" page for EEC
#Are you completing this form on behalf of someone else? page: radio option is not selected
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Select if you are completing this form on behalf of someone else" error summary
    When I answer "Yes" on Are you completing this form on behalf of someone else? page for EEC and choose to continue
#What are your details page: Full name, Email address and Type of support fields are empty
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter your full name¬Enter your email address¬Select which type of support you are to the requestor" error summary
#What are your details page: Full name invalid characters
    When I complete What are your details fields with the below details:
      | Radio Option    | Yes            |
      | Full name       | 1Full name     |
      | Email address   | Kings@test.com |
      | Type of support | Sponsor        |
    Then I should see "There is a problem" error message displayed
    And I should see "Full name must only include letters a to z, spaces, hyphens and apostrophes" error summary
#What are your details page: Email address incorrect format
    When I complete What are your details fields with the below details:
      | Radio Option    | Yes        |
      | Full name       | Full name  |
      | Email address   | @Kings.com |
      | Type of support | Sponsor    |
    Then I should see "There is a problem" error message displayed
    And I should see "Enter an email address in the correct format, like name@example.com" error summary

