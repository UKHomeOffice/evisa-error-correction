const fs = require('fs');
const path = require('path');
const Module = require('module');
const { buildProblemForks } = require('../../utils/build-problem-forks');

const loadPrivateBuildForkHelpers = () => {
  const filePath = path.resolve(__dirname, '../../utils/build-problem-forks.js');
  const source = fs.readFileSync(filePath, 'utf8');
  const instrumented = `${source}\nmodule.exports.__test__ = {
    nextSelectedProblem,
    isNextProblemTarget,
    problemHasMissingOwnedFields
  };\n`;

  const testModule = new Module(filePath, module);
  testModule.filename = filePath;
  testModule.paths = Module._nodeModulePaths(path.dirname(filePath));
  testModule._compile(instrumented, filePath);

  return testModule.exports.__test__;
};

describe('build-problem-forks utility', () => {
  const baseReq = ({
    problem,
    params = {},
    values = {},
    route,
    steps = {}
  }) => ({
    params,
    form: {
      options: {
        route,
        steps
      }
    },
    sessionModel: {
      get: key => {
        if (key === 'problem') {
          return problem;
        }

        return values[key];
      }
    }
  });

  test('builds slash-prefixed fork targets with continueOnEdit enabled', () => {
    const forks = buildProblemForks();

    expect(forks.length).toBeGreaterThan(0);
    forks.forEach(fork => {
      expect(fork.target.startsWith('/')).toBe(true);
      expect(fork.continueOnEdit).toBe(true);
      expect(typeof fork.condition).toBe('function');
    });
  });

  test('non-edit journey routes to first later selected problem in canonical order', () => {
    const req = baseReq({
      params: {},
      problem: ['problem-share-code', 'problem-nationality'],
      values: {
        'correct-nationality': 'Indian'
      },
      steps: {
        '/correct-nationality': { fields: ['correct-nationality'] },
        '/share-code': { fields: ['detail-share-code'] }
      }
    });

    const forks = buildProblemForks();
    const matched = forks.find(fork => fork.condition(req));

    expect(matched.target).toBe('/correct-nationality');
  });

  test('edit journey routes to first later selected problem with missing owned fields', () => {
    const req = baseReq({
      params: { action: 'edit' },
      problem: ['problem-nationality', 'problem-share-code'],
      values: {
        'correct-nationality': 'Indian',
        'detail-share-code': ''
      },
      steps: {
        '/correct-nationality': { fields: ['correct-nationality'] },
        '/share-code': { fields: ['detail-share-code'] }
      }
    });

    const forks = buildProblemForks();
    const matched = forks.find(fork => fork.condition(req));

    expect(matched.target).toBe('/share-code');
  });

  test('edit journey yields no matching fork when all later selected problems are complete', () => {
    const req = baseReq({
      params: { action: 'edit' },
      problem: ['problem-nationality', 'problem-share-code'],
      values: {
        'correct-nationality': 'Indian',
        'detail-share-code': 'ABC123'
      },
      steps: {
        '/correct-nationality': { fields: ['correct-nationality'] },
        '/share-code': { fields: ['detail-share-code'] }
      }
    });

    const forks = buildProblemForks();
    const matched = forks.find(fork => fork.condition(req));

    expect(matched).toBeUndefined();
  });

  test('edit journey from problem page yields no matching fork when selected problems are complete', () => {
    const req = baseReq({
      params: { action: 'edit' },
      problem: ['problem-accompanying-adult-details', 'problem-share-code'],
      route: '/problem',
      values: {
        'how-many-adults': '1-adult',
        'detail-share-code': 'ABC123'
      },
      steps: {
        '/how-many-adults': { fields: ['how-many-adults'] },
        '/share-code': { fields: ['detail-share-code'] }
      }
    });

    const forks = buildProblemForks();
    const matched = forks.find(fork => fork.condition(req));

    expect(matched).toBeUndefined();
  });

  test('currentProblemKey limits matching to problems that come later in canonical order', () => {
    const req = baseReq({
      params: {},
      problem: ['problem-full-name', 'problem-nationality', 'problem-share-code'],
      values: {},
      steps: {
        '/your-correct-name': { fields: ['correct-given-names', 'correct-last-name'] },
        '/correct-nationality': { fields: ['correct-nationality'] },
        '/share-code': { fields: ['detail-share-code'] }
      }
    });

    const forks = buildProblemForks('problem-nationality');
    const matched = forks.find(fork => fork.condition(req));

    expect(matched.target).toBe('/share-code');
  });

  test('private helper defaults currentProblemKey to null when omitted', () => {
    const { nextSelectedProblem } = loadPrivateBuildForkHelpers();
    const req = baseReq({
      params: {},
      problem: ['problem-nationality'],
      values: {},
      steps: {
        '/correct-nationality': { fields: ['correct-nationality'] }
      }
    });

    expect(nextSelectedProblem(req)).toBe('/correct-nationality');
  });

  test('private target matcher defaults currentProblemKey to null when omitted', () => {
    const { isNextProblemTarget } = loadPrivateBuildForkHelpers();
    const req = baseReq({
      params: {},
      problem: ['problem-share-code'],
      values: {},
      steps: {
        '/share-code': { fields: ['detail-share-code'] }
      }
    });

    expect(isNextProblemTarget(req, '/share-code')).toBe(true);
  });

  test('private missing-field check only inspects the selected adult branch', () => {
    const { problemHasMissingOwnedFields } = loadPrivateBuildForkHelpers();
    const req = baseReq({
      params: { action: 'edit' },
      problem: ['problem-accompanying-adult-details'],
      values: {
        'how-many-adults': '1-adult',
        'correct-given-names-adult-accompanying': 'Adult',
        'correct-last-name-adult-accompanying': 'Person',
        'correct-passport-number-adult-accompanying': 'P1234567',
        'correct-passport-number-adult-1': '',
        'correct-passport-number-adult-2': ''
      },
      steps: {
        '/how-many-adults': { fields: ['how-many-adults'] },
        '/correct-details-adult-accompanying': {
          fields: [
            'correct-given-names-adult-accompanying',
            'correct-last-name-adult-accompanying',
            'correct-passport-number-adult-accompanying'
          ]
        },
        '/correct-passport-number': {
          fields: [
            'correct-passport-number-adult-1',
            'correct-passport-number-adult-2'
          ]
        }
      }
    });

    expect(problemHasMissingOwnedFields(req, 'problem-accompanying-adult-details')).toBe(false);
  });
});
