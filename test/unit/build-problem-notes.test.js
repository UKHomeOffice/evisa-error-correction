jest.mock('../../utils/index', () => ({
  getLabel: jest.fn(),
  formatDate: jest.fn(value => `formatted:${value}`)
}));

jest.mock('../../utils/problem-utils', () => ({
  getFieldsForProblemKey: jest.fn(),
  getFieldsForRoutes: jest.fn(),
  getInternalRoutesForProblemKey: jest.fn()
}));

const { buildProblemNotes } = require('../../utils/build-problem-notes');
const { getLabel, formatDate } = require('../../utils/index');
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

    getLabel.mockImplementation((key, value, namespace) => {
      if (key === 'problem' && value === 'problem-full-name') {
        return 'Name';
      }

      if (key === 'problem' && value === 'problem-valid-from') {
        return 'Valid from';
      }

      if (key === 'how-many-adults' && namespace === 'confirm-field') {
        return 'How many adults';
      }

      if (key === 'correct-given-names-adult-accompanying' && namespace === 'confirm-field') {
        return 'Given names';
      }

      return undefined;
    });

    getFieldsForProblemKey.mockReturnValue([]);
    getFieldsForRoutes.mockReturnValue([]);
    getInternalRoutesForProblemKey.mockReturnValue([]);
  });

  test('formats date fields and joins non-space problems with comma separators', () => {
    getFieldsForProblemKey.mockImplementation((request, problem) => {
      if (problem === 'problem-valid-from') {
        return ['problem-valid-from'];
      }

      return [];
    });

    const output = buildProblemNotes(req({
      problem: ['problem-valid-from'],
      'problem-valid-from': '2026-08-01'
    }));

    expect(formatDate).toHaveBeenCalledWith('2026-08-01');
    expect(output).toBe('Valid from: formatted:2026-08-01\n\n');
  });

  test('handles a single selected problem stored as a string and uses space separator for full name', () => {
    getFieldsForProblemKey.mockImplementation((request, problem) => {
      if (problem === 'problem-full-name') {
        return ['correct-given-name', 'correct-last-name'];
      }

      return [];
    });

    const output = buildProblemNotes(req({
      problem: 'problem-full-name',
      'correct-given-name': 'Ada',
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
      expect(output).toBe('How many adults: \n\n\n:\n\n');
    });

  test('builds accompanying-adult notes for two adults and prefixes each available field value', () => {
    getFieldsForRoutes.mockReturnValue([
      'correct-given-names-adult-accompanying',
      'correct-passport-number-adult-1',
      'correct-passport-number-adult-2'
    ]);

    const output = buildProblemNotes(req({
      problem: ['problem-accompanying-adult-details'],
      'how-many-adults': '2-adults',
      'correct-given-names-adult-accompanying': 'Alex',
      'correct-passport-number-adult-1': '',
      'correct-passport-number-adult-2': 'P223344'
    }));

    expect(output).toBe(
      'How many adults: 2-adults\n\n\nGiven names:\nAdult 1: Alex null\nAdult 3: P223344\n\n\n'
    );
  });

  test('builds accompanying-adult notes for one adult without numbered prefixes', () => {
    getLabel.mockImplementation((key, value, namespace) => {
      if (key === 'how-many-adults' && namespace === 'confirm-field') {
        return 'How many adults';
      }

      if (key === 'how-many-adults' && value === '1-adult') {
        return '1 adult';
      }

      if (key === 'correct-given-names-adult-accompanying' && namespace === 'confirm-field') {
        return 'Given names';
      }

      return undefined;
    });

    getFieldsForRoutes.mockReturnValue([
      'correct-given-names-adult-accompanying'
    ]);

    const output = buildProblemNotes(req({
      problem: ['problem-accompanying-adult-details'],
      'how-many-adults': '1-adult',
      'correct-given-names-adult-accompanying': 'Jamie'
    }));

    expect(output).toBe(
      'How many adults: 1 adult\n\n\nGiven names:\nJamie \n\n'
    );
  });
});
