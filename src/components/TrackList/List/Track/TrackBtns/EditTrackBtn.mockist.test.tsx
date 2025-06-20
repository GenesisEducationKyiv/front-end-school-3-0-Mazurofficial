import {
   openModal,
   setModalEdit,
} from '@/features/modalWindow/modalWindowSlice';
import EditTrackBtn from './EditTrackBtn';
import { fireEvent, render, screen } from '@testing-library/react';
import * as hooks from '@/app/hooks';

describe('EditTrackBtn (white-box)', () => {
   const dispatchMock = vi.fn();
   const defaultId = '001';

   beforeEach(() => {
      vi.clearAllMocks();
      vi.spyOn(hooks, 'useAppDispatch').mockReturnValue(dispatchMock);
   });

   it('renders EditTrackBtn with correct data-test-id', () => {
      render(<EditTrackBtn id={defaultId} />);
      expect(screen.getByTestId(`edit-track-${defaultId}`)).toBeInTheDocument();
   });

   it('dispatches openModal when clicked', () => {
      render(<EditTrackBtn id={defaultId} />);
      const editBtn = screen.getByTestId(`edit-track-${defaultId}`);
      fireEvent.click(editBtn);
      expect(dispatchMock).toHaveBeenCalledWith(openModal());
   });

   it('dispatches setModalEdit with correct id', () => {
      render(<EditTrackBtn id={defaultId} />);
      const editBtn = screen.getByTestId(`edit-track-${defaultId}`);
      fireEvent.click(editBtn);
      expect(dispatchMock).toHaveBeenCalledWith(setModalEdit(defaultId));
   });
});
