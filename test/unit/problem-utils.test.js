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
  getFieldsForRoutes,
  getInternalRoutesForProblemKey
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
            },
            '/how-many-adults': {
              fields: ['how-many-adults']
            },
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
        }
      }
    };

    expect(getFieldsForProblemKey(req, 'problem-full-name')).toEqual([
      'correct-given-names',
      'correct-last-name'
    ]);
  });

  test('getFieldsForProblemKey includes internalRoutes fields for problem metadata', () => {
    const req = {
      form: {
        options: {
          steps: {
            '/how-many-adults': {
              fields: ['how-many-adults']
            },
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
        }
      }
    };

    expect(getFieldsForProblemKey(req, 'problem-accompanying-adult-details')).toEqual([
      'how-many-adults',
      'correct-given-names-adult-accompanying',
      'correct-last-name-adult-accompanying',
      'correct-passport-number-adult-accompanying',
      'correct-passport-number-adult-1',
      'correct-passport-number-adult-2'
    ]);
  });

  test('getFieldsForProblemKey can return only the selected internalRoutes branch', () => {
    const req = {
      form: {
        options: {
          steps: {
            '/how-many-adults': {
              fields: ['how-many-adults']
            },
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
        }
      }
    };

    req.sessionModel = {
      get: key => (key === 'how-many-adults' ? '1-adult' : undefined)
    };

    expect(
      getFieldsForProblemKey(req, 'problem-accompanying-adult-details', {
        internalRoutes: 'selected'
      })
    ).toEqual([
      'how-many-adults',
      'correct-given-names-adult-accompanying',
      'correct-last-name-adult-accompanying',
      'correct-passport-number-adult-accompanying'
    ]);
  });

  test('getInternalRoutesForProblemKey returns the selected internal route branch', () => {
    const req = {
      sessionModel: {
        get: key => (key === 'how-many-adults' ? '2-adults' : undefined)
      }
    };

    expect(
      getInternalRoutesForProblemKey(req, 'problem-accompanying-adult-details', 'selected')
    ).toEqual(['/correct-passport-number']);
  });

  test('getInternalRoutesForProblemKey returns an empty array when the selector value is missing', () => {
    const req = {
      sessionModel: {
        get: () => undefined
      }
    };

    expect(
      getInternalRoutesForProblemKey(req, 'problem-accompanying-adult-details', 'selected')
    ).toEqual([]);
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

  test('getInternalRoutesForProblemKey falls back to empty array when selected mode has no selector field', () => {
    jest.isolateModules(() => {
      jest.doMock('../../utils/problem-order', () => ({
        PROBLEM_ORDER: [
          {
            key: 'problem-with-object-internal-routes',
            target: '/parent',
            internalRoutes: {
              '1-option': ['/child-one'],
              '2-option': ['/child-two']
            },
            order: 1
          }
        ]
      }));

      const mockedUtils = require('../../utils/problem-utils');

      const req = {
        sessionModel: {
          get: () => undefined
        }
      };

      expect(
        mockedUtils.getInternalRoutesForProblemKey(
          req,
          'problem-with-object-internal-routes',
          'selected'
        )
      ).toEqual([]);
    });

    jest.resetModules();
    jest.unmock('../../utils/problem-order');
  });
});
