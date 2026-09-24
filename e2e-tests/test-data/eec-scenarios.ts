import { ConstantsLib as c } from '../utility-helper/constants-lib';

export type ProblemCorrection = {
  label: string;
  value: string;
};

export type EecScenarioData = {
  accessingEvisa: string;
  tryingToDo?: string;
  moreDetails?: string;
  problems: ProblemCorrection[];
  referenceType: string;
  referenceValue?: string;
  contactMethod: 'Email' | 'UK address';
  completingForSomeoneElse: boolean;
};

const defaultScenario: Omit<EecScenarioData, 'problems' | 'referenceType' | 'referenceValue'> = {
  accessingEvisa: 'Yes, I can see an eVisa in my UKVI account',
  tryingToDo: 'View your eVisa or prove your immigration status',
  contactMethod: 'Email',
  completingForSomeoneElse: true
};

const brp = { referenceType: 'BRP number', referenceValue: 'RZ1234567' };

export const eecScenarioData: Record<string, EecScenarioData> = {
  't1: test with view your visa, brp number, email, license and form completed on behalf of someone else': {
    ...defaultScenario,
    problems: [{ label: 'Name', value: 'Hof Test' }],
    ...brp
  },
  't2: test with update your account, gwf number, email, license  and form completed on behalf of someone else': {
    ...defaultScenario,
    tryingToDo: 'Update your UKVI account details',
    problems: [{ label: 'Sponsor licence number', value: 'ABCdeF12345' }],
    referenceType: 'GWF number',
    referenceValue: 'GWF123456789'
  },
  't3: test with report error, uan number, email, license and form completed on behalf of someone else': {
    ...defaultScenario,
    tryingToDo: 'Report an error with your eVisa',
    problems: [{ label: 'Sponsor licence number', value: 'ABCdeF12345' }],
    referenceType: 'UAN number',
    referenceValue: '1212-1234-1234-1234'
  },
  't4: test with cannot access evisa, passport number, email and form completed on behalf of someone else': {
    ...defaultScenario,
    accessingEvisa: 'No, I cannot access my eVisa or UKVI account',
    tryingToDo: undefined,
    moreDetails: 'There is a problem accessing the eVisa account',
    problems: [],
    referenceType: 'Passport number',
    referenceValue: '120382978'
  },
  't5: test with view your visa, ukvi customer number, email and form completed by themself': {
    ...defaultScenario,
    problems: [{ label: 'Name', value: 'Hof Test' }],
    referenceType: 'UKVI customer number',
    referenceValue: 'KX12345678',
    completingForSomeoneElse: false
  },
  't6: test with update your account, i do not have a reference number, uk address and form completed on behalf of someone else': {
    ...defaultScenario,
    tryingToDo: 'Update your UKVI account details',
    problems: [{ label: 'Name', value: 'Hof Test' }],
    referenceType: 'I do not have a reference number',
    contactMethod: 'UK address'
  },
  't7: test with view your visa, brp number, email, photo and form completed on behalf of someone else': { ...defaultScenario, problems: [{ label: 'Photo', value: 'Photo does not match my identity' }], ...brp },
  't8: test with view your visa, brp number, email, share code and form completed on behalf of someone else': { ...defaultScenario, problems: [{ label: 'Share code', value: 'S1A2B3' }], ...brp },
  't9: test with view your visa, brp number, email, nationality and form completed on behalf of someone else': { ...defaultScenario, problems: [{ label: 'Nationality', value: c.NATIONALITY }], ...brp },
  't10: test with view your visa, brp number, email, future spouse or civil partner name and form completed on behalf of someone else': { ...defaultScenario, problems: [{ label: 'Future spouse or civil partner name', value: 'HOF TEST' }], ...brp },
  't11: test with view your visa, brp number, email, ship and port details and form completed on behalf of someone else': { ...defaultScenario, problems: [{ label: 'Ship and port details', value: 'MV Kent|Dover' }], ...brp },
  't12: test with view your visa, brp number, email address to sign in to your account and form completed on behalf of someone else': { ...defaultScenario, problems: [{ label: 'Email address to sign in to your account', value: c.SAS_HOF_EMAIL }], ...brp },
  't13: test with view your visa, brp number, phone number to sign in to your account and form completed on behalf of someone else': { ...defaultScenario, problems: [{ label: 'Phone number to sign in to your account', value: '07876075243' }], ...brp },
  't14: test with view your visa, brp number, what you can and cannot do in the uk and form completed on behalf of someone else': { ...defaultScenario, problems: [{ label: 'What you can and cannot do in the UK', value: 'Can work only 20 hours during term time' }], ...brp },
  't15: test with view your visa, brp number, my problem is not listed and form completed on behalf of someone else': { ...defaultScenario, problems: [{ label: 'My problem is not listed', value: 'My BRP details are missing from the account' }], ...brp },
  't16: test with view your visa, brp number, valid from and form completed on behalf of someone else': { ...defaultScenario, problems: [{ label: 'Valid from', value: '11/10/2020' }], ...brp },
  't17: test with view your visa, brp number, valid to and form completed on behalf of someone else': { ...defaultScenario, problems: [{ label: 'Valid to', value: '11/10/2030' }], ...brp },
  't18: test with view your visa, brp number, name or passport numbers of accompanying adult and form completed on behalf of someone else': { ...defaultScenario, problems: [{ label: 'Name or passport numbers of accompanying adult', value: '1|Alex|Smith|P1234567' }], ...brp },
  't19: test with view your visa, brp number, name or passport numbers of accompanying adult for 2 adults and form completed on behalf of someone else': { ...defaultScenario, problems: [{ label: 'Name or passport numbers of accompanying adult', value: '2|P1234567|P7654321' }], ...brp },
  't20: test with view your visa, brp number, name, nationality, national insurance number, photo then add status from check your answers and form completed on behalf of someone else': {
    ...defaultScenario,
    problems: [
      { label: 'Name', value: 'Hof Test' },
      { label: 'Nationality', value: c.NATIONALITY },
      { label: 'National Insurance number', value: 'QQ123456C' },
      { label: 'Photo', value: 'Photo is not clear enough to identify me' },
      { label: 'Status', value: 'My immigration status should show settled status' }
    ],
    ...brp
  },
  't21: test with future spouse name, ship and port details, restrictions, my problem not listed then deselect ship and port details': {
    ...defaultScenario,
    problems: [
      { label: 'Future spouse or civil partner name', value: 'HOF TEST' },
      { label: 'What you can and cannot do in the UK', value: 'My work restrictions are incorrect' },
      { label: 'My problem is not listed', value: 'My visa details have another issue that is not listed' }
    ],
    ...brp
  },
  't22: test with sponsor licence number and accompanying adult then change number of adults from 1 to 2 from check your answers': { ...defaultScenario, problems: [{ label: 'Sponsor licence number', value: 'ABCdeF12345' }, { label: 'Name or passport numbers of accompanying adult', value: '2|P1234567|P7654321' }], ...brp },
  't23: test with must leave uk via (flight number and airport), my problem is not listed then edit flight number and airport from check your answers': { ...defaultScenario, problems: [{ label: 'Must leave UK via (flight number and airport)', value: 'BA456|Gatwick Airport' }, { label: 'My problem is not listed', value: 'problem is to high' }], ...brp },
  't24: test with must leave uk via (flight number and airport), my problem is not listed then edit my problem is not listed from check your answers': { ...defaultScenario, problems: [{ label: 'Must leave UK via (flight number and airport)', value: 'ac123|Heathrow' }, { label: 'My problem is not listed', value: 'we have to edit it to high' }], ...brp },
  't25: test with name and email address to sign in to your account then edit email address to sign in to your account from check your answers': { ...defaultScenario, problems: [{ label: 'Name', value: 'Hof Test' }, { label: 'Email address to sign in to your account', value: 'updated.signin@example.com' }], ...brp }
};