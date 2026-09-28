import { test as base } from 'playwright-bdd';
import { EecPage } from '../pages/eec-page';

type Pages = {
  eecPage: EecPage;
};

export const test = base.extend<{ pages: Pages }>({
  pages: async ({ page }, use) => {
    await use({
      eecPage: new EecPage(page)
    });
  }
});

export const expect = test.expect;