import { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { loadTracks } from './trackListApiSlice';

export const useInitialTrackList = () => {
   const dispatch = useAppDispatch();

   useEffect(() => {
      void dispatch(loadTracks({}));
   }, [dispatch]);
};
