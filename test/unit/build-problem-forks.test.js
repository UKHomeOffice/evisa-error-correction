const { buildProblemForks } = require('../../utils/build-problem-forks');

describe('build-problem-forks utility', () => {
  const baseReq = ({
    problem,
    params = {},
    values = {},
    steps = {}
  }) => ({
    params,
    form: {
      options: {
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

  test('afterKey limits matching to problems that come later in canonical order', () => {
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
});
