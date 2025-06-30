import { screen, waitFor, fireEvent } from '@testing-library/react';
import { server } from '@/mocks/browser';
import { http, HttpResponse } from 'msw';
import Filter from '@/components/TrackList/TrackControls/Filter';
import { renderWithProviders } from '@/utils/test-utils';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LocationDisplayHelper from '@/tests/helpers/LocationDisplayHelper';
import { ALL_GENRES } from '@/api/api';

beforeAll(() => {
   server.listen();
});

afterEach(() => {
   server.resetHandlers();
});

afterAll(() => {
   server.close();
});

describe('Filter Integration Tests', () => {
   it('loads and displays genres from API in the filter dropdown', async () => {
      renderWithProviders(
         <MemoryRouter>
            <Filter />
         </MemoryRouter>
      );

      const select = screen.getByTestId('filter-genre');
      expect(select).toBeInTheDocument();

      await waitFor(() => {
         expect(
            screen.getByRole('option', { name: 'Rock' })
         ).toBeInTheDocument();
         expect(
            screen.getByRole('option', { name: 'Hip Hop' })
         ).toBeInTheDocument();
         expect(
            screen.getByRole('option', { name: 'Jazz' })
         ).toBeInTheDocument();
      });

      expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
   });

   it('allows selecting a valid genre and updates the select value', async () => {
      renderWithProviders(
         <MemoryRouter>
            <Filter />
         </MemoryRouter>
      );

      await waitFor(() => {
         expect(
            screen.getByRole('option', { name: 'Rock' })
         ).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('filter-genre'), {
         target: { value: 'Rock' },
      });

      expect(screen.getByTestId('filter-genre')).toHaveValue('Rock');
   });

   it('allows selecting "All" to clear the filter', async () => {
      renderWithProviders(
         <MemoryRouter>
            <Filter />
         </MemoryRouter>
      );

      await waitFor(() => {
         expect(
            screen.getByRole('option', { name: 'All' })
         ).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('filter-genre'), {
         target: { value: '' },
      });

      expect(screen.getByTestId('filter-genre')).toHaveValue('');
   });

   it('prevents selecting invalid genres and logs error', async () => {
      const consoleSpy = vi
         .spyOn(console, 'error')
         .mockImplementation(() => undefined);

      renderWithProviders(
         <MemoryRouter>
            <Filter />
         </MemoryRouter>
      );

      await waitFor(() => {
         expect(
            screen.getByRole('option', { name: 'Rock' })
         ).toBeInTheDocument();
      });

      const select = screen.getByTestId('filter-genre');

      Object.defineProperty(select, 'value', {
         writable: true,
         value: 'InvalidGenre',
      });

      fireEvent.change(select, { target: { value: 'InvalidGenre' } });

      expect(consoleSpy).toHaveBeenCalledWith("Genre doesn't exist");

      consoleSpy.mockRestore();
   });

   it('handles API errors gracefully', () => {
      server.use(
         http.get(ALL_GENRES, () => {
            return HttpResponse.error();
         })
      );

      renderWithProviders(
         <MemoryRouter>
            <Filter />
         </MemoryRouter>
      );

      const select = screen.getByTestId('filter-genre');
      expect(select).toBeInTheDocument();

      expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
   });

   it('updates URL search params when genre is selected', async () => {
      renderWithProviders(
         <MemoryRouter>
            <Filter />
            <LocationDisplayHelper />
         </MemoryRouter>
      );

      await waitFor(() => {
         expect(
            screen.getByRole('option', { name: 'Rock' })
         ).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('filter-genre'), {
         target: { value: 'Rock' },
      });

      await waitFor(() => {
         expect(screen.getByTestId('location')).toHaveTextContent('genre=Rock');
      });
   });

   it('removes genre from URL when "All" is selected', async () => {
      renderWithProviders(
         <MemoryRouter>
            <Filter />
            <LocationDisplayHelper />
         </MemoryRouter>
      );

      await waitFor(() => {
         expect(
            screen.getByRole('option', { name: 'All' })
         ).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('filter-genre'), {
         target: { value: '' },
      });

      await waitFor(() => {
         expect(screen.getByTestId('location')).not.toHaveTextContent('genre');
      });
   });
});
