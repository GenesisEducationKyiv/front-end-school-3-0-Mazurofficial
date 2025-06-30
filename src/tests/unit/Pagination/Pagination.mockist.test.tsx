import { render, screen, fireEvent } from '@testing-library/react';
import * as hooks from '@/app/hooks';
import { vi } from 'vitest';
import type * as reactRouterDom from 'react-router-dom';
import Pagination from '@/components/TrackList/Pagination/Pagination';

const setSearchParamsMock = vi.fn();

// mock useSearchParams
vi.mock('react-router-dom', async () => {
   const actual =
      await vi.importActual<typeof reactRouterDom>('react-router-dom');
   return {
      ...actual,
      useSearchParams: () => [new URLSearchParams(), setSearchParamsMock],
   };
});

describe('Pagination', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it('renders Pagination with correct data-test-id', () => {
      vi.spyOn(hooks, 'useAppSelector').mockReturnValue({
         page: 1,
         totalPages: 10,
      });
      render(<Pagination />);
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
   });

   it('disables Previous button on first page', () => {
      vi.spyOn(hooks, 'useAppSelector').mockReturnValue({
         page: 1,
         totalPages: 5,
      });
      render(<Pagination />);
      expect(screen.getByTestId('pagination-prev')).toBeDisabled();
      expect(screen.getByTestId('pagination-next')).not.toBeDisabled();
   });

   it('disables Next button on last page', () => {
      vi.spyOn(hooks, 'useAppSelector').mockReturnValue({
         page: 5,
         totalPages: 5,
      });
      render(<Pagination />);
      expect(screen.getByTestId('pagination-next')).toBeDisabled();
      expect(screen.getByTestId('pagination-prev')).not.toBeDisabled();
   });

   it('calls setSearchParams with next page when clicking Next', () => {
      vi.spyOn(hooks, 'useAppSelector').mockReturnValue({
         page: 2,
         totalPages: 5,
      });
      render(<Pagination />);
      fireEvent.click(screen.getByTestId('pagination-next'));

      expect(setSearchParamsMock).toHaveBeenCalled();

      const setParamFn = setSearchParamsMock.mock.calls[0][0];
      const result = setParamFn(new URLSearchParams());

      expect(result.get('page')).toBe('3');
   });

   it('calls setSearchParams with previous page when clicking Previous', () => {
      vi.spyOn(hooks, 'useAppSelector').mockReturnValue({
         page: 3,
         totalPages: 5,
      });
      render(<Pagination />);
      fireEvent.click(screen.getByTestId('pagination-prev'));

      expect(setSearchParamsMock).toHaveBeenCalled();

      const setParamFn = setSearchParamsMock.mock.calls[0][0];
      const result = setParamFn(new URLSearchParams());

      expect(result.get('page')).toBe('2');
   });

   it('does not render pagination if totalPages < 1', () => {
      vi.spyOn(hooks, 'useAppSelector').mockReturnValue({
         page: 1,
         totalPages: 0,
      });
      render(<Pagination />);
      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
   });
});
