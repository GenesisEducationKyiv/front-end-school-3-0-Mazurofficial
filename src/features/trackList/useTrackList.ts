import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { loadTracks, setQuery } from './trackListApiSlice';
import { useSearchParams } from 'react-router-dom';
import { useValidSearchParams } from '@/hooks/useValidSearchParams';

export const useInitialTrackList = () => {
   const dispatch = useAppDispatch();
   const [searchParams] = useSearchParams();
   const { params, paramsUrl } = useValidSearchParams();

   useEffect(() => {
      void dispatch(loadTracks(paramsUrl));
      dispatch(setQuery(params));
      // Disabling eslint to prevent infinite loop
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dispatch, searchParams]);
};
