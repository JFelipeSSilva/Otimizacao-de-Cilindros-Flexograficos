const { test, expect } = require('@playwright/test');
const path = require('path');

const pageUrl = `file://${path.resolve(__dirname, '../index.html')}`;

async function addCylinder(page, z, qty) {
  await page.fill('#newZ', String(z));
  await page.fill('#newQty', String(qty));
  await page.click('#addCylinderBtn');
}

test.beforeEach(async ({ page }) => {
  await page.goto(pageUrl);
  await page.evaluate(() => localStorage.clear());
});

test('shows inventory placeholder when no cylinders are available', async ({ page }) => {
  await expect(page.locator('#cylinderListTitle')).toBeHidden();
  await expect(page.locator('#cylinderList')).toContainText('Nenhum cilindro em estoque. Cadastre um cilindro para começar.');
});

test('adds cylinders and displays them in sorted order', async ({ page }) => {
  await addCylinder(page, 30, 4);
  await addCylinder(page, 10, 2);
  const listItems = page.locator('#cylinderList li');
  await expect(listItems).toHaveCount(2);
  await expect(listItems.nth(0)).toContainText('Z: 10, Qtd: 2');
  await expect(listItems.nth(1)).toContainText('Z: 30, Qtd: 4');
  await expect(page.locator('#cylinderListTitle')).toBeVisible();
});

test('shows warning when no valid cylinders exist for selected colors', async ({ page }) => {
  await addCylinder(page, 24, 3);
  await page.fill('#height', '1');
  await page.fill('#width', '10');
  await page.selectOption('#colors', '4');
  await page.click('#calculateBtn');
  await expect(page.locator('#message')).toHaveText(/Nenhuma opção válida encontrada/);
  await expect(page.locator('#results')).toBeHidden();
});

test('calculates optimization and shows efficient result for valid cylinder', async ({ page }) => {
  await addCylinder(page, 24, 5);
  await page.fill('#height', '1');
  await page.fill('#width', '10');
  await page.selectOption('#colors', '4');
  await page.click('#calculateBtn');
  await expect(page.locator('#results')).toBeVisible();
  await expect(page.locator('#resultsBody tr').first()).toContainText('EFICIENTE');
});
