const { PROBLEM_ORDER } = require('../../utils/problem-order');

describe('problem-order', () => {
  test('exports a non-empty array', () => {
    expect(Array.isArray(PROBLEM_ORDER)).toBe(true);
    expect(PROBLEM_ORDER.length).toBeGreaterThan(0);
  });

  test('assigns contiguous order values starting at 1', () => {
    const orders = PROBLEM_ORDER.map(problem => problem.order);
    const expected = Array.from({ length: PROBLEM_ORDER.length }, (_, index) => index + 1);

    expect(orders).toEqual(expected);
  });

  test('has unique problem keys and targets', () => {
    const keys = PROBLEM_ORDER.map(problem => problem.key);
    const targets = PROBLEM_ORDER.map(problem => problem.target);

    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(targets).size).toBe(targets.length);
  });

  test('contains required shape for each problem definition', () => {
    PROBLEM_ORDER.forEach(problem => {
      expect(typeof problem.key).toBe('string');
      expect(problem.key.length).toBeGreaterThan(0);

      expect(typeof problem.target).toBe('string');
      expect(problem.target.startsWith('/')).toBe(true);

      expect(Number.isInteger(problem.order)).toBe(true);
      expect(problem.order).toBeGreaterThan(0);
    });
  });

  test('problem-accompanying-adult-details defines selector-based internal routes', () => {
    const adultProblem = PROBLEM_ORDER.find(problem => problem.key === 'problem-accompanying-adult-details');

    expect(adultProblem).toMatchObject({
      target: '/how-many-adults',
      internalRouteSelector: 'how-many-adults'
    });
    expect(adultProblem.internalRoutes).toEqual({
      '1-adult': ['/correct-details-adult-accompanying'],
      '2-adults': ['/correct-passport-number']
    });
  });
});
