const {
  ORDERED_PROBLEM_ORDER,
  PROBLEM_ORDER_BY_KEY,
  PROBLEM_ROUTE_TO_KEY,
  getProblemOrder,
  toArray,
  normaliseRoute,
  hasFieldValue,
  getFieldsForProblemKey
} = require('../../utils/problem-utils');

describe('problem-utils', () => {
  test('ORDERED_PROBLEM_ORDER is sorted by order ascending', () => {
    const orders = ORDERED_PROBLEM_ORDER.map(item => item.order);
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
});
