import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
   await page.goto('http://localhost:3000');
});

test.describe('TrackList page', () => {
   test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('Music App');
   });
   test('should have a header', async ({ page }) => {
      await expect(page.getByTestId('tracks-header')).toHaveText(
         'Your personal tracklist'
      );
      await expect(page.getByTestId('tracks-header')).toBeVisible();
   });
   test('should show modal with add-track-form when create-track-button is clicked', async ({
      page,
   }) => {
      await page.getByTestId('create-track-button').click();
      await expect(page.getByTestId('track-form')).toBeVisible();
      await expect(page.getByTestId('input-title')).toBeEmpty(); // title input should be empty when form is "ADD" type
   });
   test('should add a track when add-track-form is submitted', async ({
      page,
   }) => {
      await page.getByTestId('create-track-button').click();
      await page.getByTestId('input-title').fill('Test Track');
      await page.getByTestId('input-artist').fill('Test Artist');
      await page.getByTestId('input-album').fill('Test Album');
      await page.getByTestId('submit-button').click();
      const firstTrack = page.locator('[data-testid^="track-item-"]').first();
      await expect(
         firstTrack.locator('[data-testid^="track-item-"]').first()
      ).toHaveText('Test Track');
   });
   test('should show track on search', async ({ page }) => {
      await page.getByTestId('search-input').fill('Test Track');
      const findedTracks = page.locator('[data-testid^="track-item-"]');
      await expect(
         findedTracks.locator('[data-testid^="track-item-"]').first()
      ).toHaveText('Test Track');
   });
   test('should edit track when edit-track-button is clicked', async ({
      page,
   }) => {
      const testTrack = page.locator('[data-testid^="track-item-"]');
      await testTrack.locator('[data-testid^="edit-track-"]').first().click();
      await expect(page.getByTestId('track-form')).toBeVisible();
      await expect(page.getByTestId('input-title')).toHaveValue('Test Track');

      await page.getByTestId('input-title').fill('Test Track Edited');
      await page.getByTestId('submit-button').click();
      await expect(
         testTrack.locator('[data-testid^="track-item-"]').first()
      ).toHaveText('Test Track Edited');
   });
   test('should delete track when delete-track-button is clicked', async ({
      page,
   }) => {
      page.on('dialog', (dialog) => dialog.accept());

      const testTrack = page.locator('[data-testid^="track-item-"]');
      await expect(
         testTrack.locator('[data-testid^="track-item-"]').first()
      ).toHaveText('Test Track Edited');
      await testTrack.locator('[data-testid^="delete-track-"]').first().click();

      await expect(
         testTrack.locator('[data-testid^="track-item-"]').first()
      ).not.toHaveText('Test Track Edited');
   });
});
