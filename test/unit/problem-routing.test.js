jest.mock('notifications-node-client', () => ({
  NotifyClient: jest.fn().mockImplementation(() => ({
    sendEmail: jest.fn()
  }))
}));

const app = require('../../apps/eec');

const getTargetFromForks = (stepConfig, req) => {
  const matchingFork = (stepConfig.forks || []).find(fork => {
    if (typeof fork.condition === 'function') {
      return fork.condition(req);
    }

    return false;
  });

  return matchingFork ? matchingFork.target : stepConfig.next;
};

describe('Problem routing from Check answers edits', () => {
  test('routes to the first selected problem with missing values in edit journey', () => {
    const req = {
      params: { action: 'edit' },
      form: {
        options: {
          steps: app.steps
        }
      },
      sessionModel: {
        get: key => {
          const values = {
            problem: ['problem-full-name', 'problem-nationality'],
            'correct-given-names': 'Anju',
            'correct-last-name': 'Rajan',
            steps: ['/problem', '/your-correct-name', '/check-answers']
          };

          return values[key];
        }
      }
    };

    const step = app.steps['/problem'];
    expect(getTargetFromForks(step, req)).toBe('/correct-nationality');
  });

  test('routes to the next selected problem in non-edit journey', () => {
    const req = {
      params: {},
      form: {
        options: {
          steps: app.steps
        }
      },
      sessionModel: {
        get: key => {
          const values = {
            problem: ['problem-full-name', 'problem-nationality'],
            'correct-given-names': 'Anju',
            'correct-last-name': 'Rajan',
            steps: ['/problem', '/your-correct-name', '/check-answers']
          };

          return values[key];
        }
      }
    };

    const step = app.steps['/problem'];
    expect(getTargetFromForks(step, req)).toBe('/your-correct-name');
  });

  test('supports comma-separated problem values when the first selected problem is incomplete', () => {
    const req = {
      params: {},
      form: {
        options: {
          steps: app.steps
        }
      },
      sessionModel: {
        get: key => {
          const values = {
            problem: 'problem-full-name, problem-nationality',
            'correct-given-names': '',
            'correct-last-name': 'Rajan',
            steps: ['/problem', '/your-correct-name', '/check-answers']
          };

          return values[key];
        }
      }
    };

    const step = app.steps['/problem'];
    expect(getTargetFromForks(step, req)).toBe('/your-correct-name');
  });

  test('keeps canonical selected-problem order in non-edit journey even when earlier problem is complete', () => {
    const req = {
      params: {},
      form: {
        options: {
          steps: app.steps
        }
      },
      sessionModel: {
        get: key => {
          const values = {
            problem: ['problem-full-name', 'problem-nationality'],
            'correct-given-names': 'Anju',
            'correct-last-name': 'Rajan',
            'correct-nationality': '',
            steps: ['/problem', '/your-correct-name', '/check-answers']
          };

          return values[key];
        }
      }
    };

    const step = app.steps['/problem'];
    expect(getTargetFromForks(step, req)).toBe('/your-correct-name');
  });
});
