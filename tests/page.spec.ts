import { test, expect } from '@playwright/test';

const url = 'http://localhost:3000';

test('main page test', async ({ page }) => {
  await page.goto(url);
  const header = await page.textContent('h1');
  expect(header).toBe('Astroidy');
});

test('should display no asteroids message when list is empty', async ({
  page,
}) => {
  await page.goto(url);
  const noAsteroidsMessage = await page.textContent(
    '.text-center.text-gray-400',
  );
  expect(noAsteroidsMessage).toBe(
    'No asteroids found for the selected date range.',
  );
});

test('should expand asteroid details on click', async ({ page }) => {
  await page.goto(url);
  await page.click('.group.block.cursor-pointer');
  const detailsVisible = await page.isVisible('.asteroid-details.open');
  expect(detailsVisible).toBe(true);
});

test('should display correct asteroid details', async ({ page }) => {
  await page.goto(url);

  await page.click('.group.block.cursor-pointer');
  const absoluteMagnitude = await page.textContent(
    '.asteroid-details.open p:nth-of-type(1)',
  );
  expect(absoluteMagnitude).toContain('Absolute Magnitude:');
  const estimatedDiameter = await page.textContent(
    '.asteroid-details.open ul:nth-of-type(1) li:nth-of-type(1)',
  );
  expect(estimatedDiameter).toContain('Kilometers:');
  const potentiallyHazardous = await page.textContent(
    '.asteroid-details.open p:nth-of-type(2)',
  );
  expect(potentiallyHazardous).toContain('Estimated Diameter:');
  const closeApproachData = await page.textContent(
    '.asteroid-details.open ul:nth-of-type(2) li:nth-of-type(1) p:nth-of-type(1)',
  );
  expect(closeApproachData).toContain('Date:');
});
