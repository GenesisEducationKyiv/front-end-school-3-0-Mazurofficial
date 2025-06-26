import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@/utils/test-utils';
import EditTrackBtn from '@/components/TrackList/List/Track/TrackBtns/EditTrackBtn';

describe('EditTrackBtn (black-box)', () => {
   const defaultId = '001';

   it('opens modal and sets trackToEdit on click (via state check)', () => {
      const { store } = renderWithProviders(<EditTrackBtn id={defaultId} />);

      fireEvent.click(screen.getByTestId(`edit-track-${defaultId}`));

      const state = store.getState().modal;
      expect(state.isVisible).toBe(true);
      expect(state.type).toBe('edit');
      expect(state.trackToEdit).toBe(defaultId);
   });
});
