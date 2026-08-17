jest.mock('../../utils/problem-utils', () => ({
  getFieldsForProblemKey: jest.fn(),
  getFieldsForRoutes: jest.fn(),
  getInternalRoutesForProblemKey: jest.fn()
}));

const { buildProblemNotes } = require('../../utils/build-problem-notes');
const {
  getFieldsForProblemKey,
  getFieldsForRoutes,
  getInternalRoutesForProblemKey
} = require('../../utils/problem-utils');

describe('build-problem-notes utility', () => {
  const req = values => ({
    sessionModel: {
      get: key => values[key]
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();

    getFieldsForProblemKey.mockReturnValue([]);
    getFieldsForRoutes.mockReturnValue([]);
    getInternalRoutesForProblemKey.mockReturnValue([]);
  });

  test('formats valid-from and valid-to dates as DD/MM/YYYY', () => {
    getFieldsForProblemKey.mockImplementation((request, problem) => {
      if (problem === 'problem-valid-from') {
        return ['problem-valid-from'];
      }

      if (problem === 'problem-valid-to') {
        return ['problem-valid-to'];
      }

      return [];
    });

    const output = buildProblemNotes(req({
      problem: ['problem-valid-from', 'problem-valid-to'],
      'problem-valid-from': '2025-06-22',
      'problem-valid-to': '2026-11-24'
    }));

    expect(output).toBe('Valid from: 22/06/2025\n\nValid to: 24/11/2026\n\n');
  });

  test('handles a single selected problem stored as a string and uses space separator for full name', () => {
    getFieldsForProblemKey.mockImplementation((request, problem) => {
      if (problem === 'problem-full-name') {
        return ['correct-given-names', 'correct-last-name'];
      }

      return [];
    });

    const output = buildProblemNotes(req({
      problem: 'problem-full-name',
      'correct-given-names': 'Ada',
      'correct-last-name': 'Lovelace'
    }));

    expect(output).toBe('Name: Ada Lovelace\n\n');
  });

  test('builds accompanying-adult notes with empty selected routes and falls back to empty adult count label value',
    () => {
      const output = buildProblemNotes(req({
        problem: ['problem-accompanying-adult-details']
      }));

      expect(getInternalRoutesForProblemKey).toHaveBeenCalledWith(
        expect.any(Object),
        'problem-accompanying-adult-details',
        'selected'
      );
      expect(getFieldsForRoutes).toHaveBeenCalledWith(expect.any(Object), []);
      expect(output).toBe('Number of adults accompanying a child: \n\n\n:\n\n');
    });

  test('builds accompanying-adult notes for two adults and prefixes each available field value', () => {
    getFieldsForRoutes.mockReturnValue([
      'correct-passport-number-adult-1',
      'correct-passport-number-adult-2'
    ]);

    const output = buildProblemNotes(req({
      problem: ['problem-accompanying-adult-details'],
      'how-many-adults': '2-adults',
      'correct-passport-number-adult-1': 'P133456',
      'correct-passport-number-adult-2': 'P223344'
    }));

    expect(output).toBe(
      'Number of adults accompanying a child: 2 adults\n\n\nPassport numbers of accompanying adults:\nAdult 1: P133456\nAdult 2: P223344\n\n\n'
    );
  });

  test('builds accompanying-adult notes for one adult with multiple fields and without numbered prefixes', () => {
    getFieldsForRoutes.mockReturnValue([
      'correct-given-names-adult-accompanying',
      'correct-last-name-adult-accompanying',
      'correct-passport-number-adult-accompanying'
    ]);

    const output = buildProblemNotes(req({
      problem: ['problem-accompanying-adult-details'],
      'how-many-adults': '1-adult',
      'correct-given-names-adult-accompanying': 'Jamie',
      'correct-last-name-adult-accompanying': 'Smith',
      'correct-passport-number-adult-accompanying': 'P1234567'
    }));

    expect(output).toBe(
      'Number of adults accompanying a child: 1 adult\n\n\nName and passport number of accompanying adult:\nJamie Smith\nP1234567\n\n\n'
    );
  });
});
