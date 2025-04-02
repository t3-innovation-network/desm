import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';

export const test = base.extend({
  makeAxeBuilder: async ({ page }, use, _testInfo) => {
    const makeAxeBuilder = () => new AxeBuilder({ page });
    await use(makeAxeBuilder);
  },
});
export { expect } from '@playwright/test';

export const outputAxeReport = async ({ accessibilityScanResults, pageName }, testInfo) => {
  const reportHTML = createHtmlReport({
    results: accessibilityScanResults,
    options: {
      doNotCreateReportFile: true,
    },
  });
  await testInfo.attach(`${pageName}-accessibility-scan-results`, {
    body: JSON.stringify(accessibilityScanResults, null, 2),
    contentType: 'application/json',
  });
  await testInfo.attach(`${pageName}-accessibility-report`, {
    body: reportHTML,
    contentType: 'text/html',
  });
};
