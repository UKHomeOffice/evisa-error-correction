const {
  PROBLEM_ORDER,
  PROBLEM_ORDER_BY_KEY,
  PROBLEM_ROUTE_TO_KEY,
  getProblemOrder,
  toArray,
  normaliseRoute,
  isEditJourney,
  hasFieldValue,
  getFieldsForProblemKey,
  getFieldsForRoutes
} = require('../../utils/problem-utils');

describe('problem-utils', () => {
  test('PROBLEM_ORDER is sorted by order ascending', () => {
    const orders = PROBLEM_ORDER.map(item => item.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  test('PROBLEM_ORDER_BY_KEY maps keys to order values', () => {
    expect(PROBLEM_ORDER_BY_KEY['problem-full-name']).toBe(1);
    expect(PROBLEM_ORDER_BY_KEY['problem-other']).toBe(18);
  });

  test('PROBLEM_ROUTE_TO_KEY maps slash-prefixed targets to problem keys', () => {
    expect(PROBLEM_ROUTE_TO_KEY['/your-correct-name']).toBe(
      'problem-full-name'
    );
    expect(PROBLEM_ROUTE_TO_KEY['/problem-not-listed']).toBe('problem-other');
  });

  test('getProblemOrder returns 0 for missing key and mapped order for valid key', () => {
    expect(getProblemOrder()).toBe(0);
    expect(getProblemOrder('')).toBe(0);
    expect(getProblemOrder('unknown-key')).toBe(0);
    expect(getProblemOrder('problem-share-code')).toBe(15);
  });

  test('toArray handles falsy, arrays, strings and scalars', () => {
    expect(toArray(undefined)).toEqual([]);
    expect(toArray(null)).toEqual([]);
    expect(toArray([])).toEqual([]);
    expect(toArray(['a', 'b'])).toEqual(['a', 'b']);
    expect(toArray('a,b, c , ,')).toEqual(['a', 'b', 'c']);
    expect(toArray('single')).toEqual(['single']);
    expect(toArray(123)).toEqual([123]);
  });

  test('normaliseRoute returns null for invalid input and slash-prefixed routes for valid input', () => {
    expect(normaliseRoute(undefined)).toBeNull();
    expect(normaliseRoute(null)).toBeNull();
    expect(normaliseRoute('')).toBeNull();
    expect(normaliseRoute(123)).toBeNull();
    expect(normaliseRoute('/abc')).toBe('/abc');
    expect(normaliseRoute('abc')).toBe('/abc');
  });

  test('isEditJourney handles missing params and edit markers', () => {
    expect(isEditJourney({})).toBe(false);
    expect(isEditJourney({ params: {} })).toBe(false);
    expect(isEditJourney({ params: { edit: '1' } })).toBe(true);
    expect(isEditJourney({ params: { action: 'edit' } })).toBe(true);
  });

  test('hasFieldValue handles undefined/null/strings/arrays and primitives', () => {
    expect(hasFieldValue(undefined)).toBe(false);
    expect(hasFieldValue(null)).toBe(false);
    expect(hasFieldValue('')).toBe(false);
    expect(hasFieldValue('   ')).toBe(false);
    expect(hasFieldValue('value')).toBe(true);
    expect(hasFieldValue([])).toBe(false);
    expect(hasFieldValue(['x'])).toBe(true);
    expect(hasFieldValue(0)).toBe(true);
    expect(hasFieldValue(false)).toBe(true);
  });

  test('getFieldsForProblemKey returns fields for known problem key when step fields are configured', () => {
    const req = {
      form: {
        options: {
          steps: {
            '/your-correct-name': {
              fields: ['correct-given-names', 'correct-last-name']
            }
          }
        }
      }
    };

    expect(getFieldsForProblemKey(req, 'problem-full-name')).toEqual([
      'correct-given-names',
      'correct-last-name'
    ]);
  });

  test('getFieldsForProblemKey returns empty array for unknown key or missing step config', () => {
    const reqWithSteps = {
      form: {
        options: {
          steps: {}
        }
      }
    };

    const reqWithoutSteps = {
      form: {
        options: {}
      }
    };

    expect(getFieldsForProblemKey(reqWithSteps, 'unknown-key')).toEqual([]);
    expect(
      getFieldsForProblemKey(reqWithoutSteps, 'problem-full-name')
    ).toEqual([]);
  });

  test('getFieldsForRoutes flattens configured fields across routes in order', () => {
    const req = {
      form: {
        options: {
          steps: {
            '/a': { fields: ['field-a1', 'field-a2'] },
            '/b': { fields: ['field-b1'] }
          }
        }
      }
    };

    expect(getFieldsForRoutes(req, ['/a', '/b'])).toEqual([
      'field-a1',
      'field-a2',
      'field-b1'
    ]);
  });

  test('getFieldsForRoutes returns empty array when steps are missing or route has no fields', () => {
    const reqWithoutSteps = {
      form: {
        options: {}
      }
    };

    const reqWithMixedRoutes = {
      form: {
        options: {
          steps: {
            '/a': {},
            '/b': { fields: ['field-b1'] }
          }
        }
      }
    };

    expect(getFieldsForRoutes(reqWithoutSteps, ['/a'])).toEqual([]);
    expect(getFieldsForRoutes(reqWithMixedRoutes, ['/missing', '/a', '/b'])).toEqual(['field-b1']);
  });

  test('route maps preserve already slash-prefixed targets when provided by problem-order', () => {
    jest.isolateModules(() => {
      jest.doMock('../../utils/problem-order', () => ({
        PROBLEM_ORDER: [
          { key: 'problem-a', target: '/already-slashed', order: 1 },
          { key: 'problem-b', target: 'plain-target', order: 2 }
        ]
      }));

      const mockedUtils = require('../../utils/problem-utils');

      expect(mockedUtils.PROBLEM_ROUTE_TO_KEY['/already-slashed']).toBe('problem-a');
      expect(mockedUtils.PROBLEM_ROUTE_TO_KEY['/plain-target']).toBe('problem-b');

      const req = {
        form: {
          options: {
            steps: {
              '/already-slashed': {
                fields: ['field-a']
              },
              '/plain-target': {
                fields: ['field-b']
              }
            }
          }
        }
      };

      expect(mockedUtils.getFieldsForProblemKey(req, 'problem-a')).toEqual(['field-a']);
      expect(mockedUtils.getFieldsForProblemKey(req, 'problem-b')).toEqual(['field-b']);
    });

    jest.resetModules();
    jest.unmock('../../utils/problem-order');
  });
});
