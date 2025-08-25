// @ts-check
import { test, expect, outputAxeReport } from './fixtures/axe-test';

test.describe('Accessibility Tests', () => {
  // select a configuration with option name as sharedMappingConfig from config
  const sharedMappingConfig = process.env.SHARED_MAPPING_CONFIG || 'DESM Demo and Documentation';

  test('Check homepage accessibility', async ({ page, makeAxeBuilder }, testInfo) => {
    await page.goto('/');
    // wait for homepage to be loaded
    await page.locator('text=About the DESM tool').waitFor();
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    await outputAxeReport(
      {
        accessibilityScanResults,
        pageName: 'homepage',
      },
      testInfo
    );
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Check shared mapping page accessibility', async ({ page, makeAxeBuilder }, testInfo) => {
    page.goto('/');
    // click on link with text sharedMappingConfig
    await page.getByRole('link', { name: sharedMappingConfig }).click();
    // wait for shared mapping to be loaded for words Property name
    await page.locator('text=Property name').first().waitFor();
    const accessibilityScanResults = await makeAxeBuilder().analyze();
    await outputAxeReport(
      {
        accessibilityScanResults,
        pageName: 'shared-mapping',
      },
      testInfo
    );
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
