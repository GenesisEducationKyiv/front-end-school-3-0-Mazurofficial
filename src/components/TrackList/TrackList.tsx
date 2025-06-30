import Pagination from './Pagination/Pagination';
import List from './List/List';
import TrackControls from './TrackControls/TrackControls';
import styles from './TrackList.module.scss';
import { useAppSelector } from '@/app/hooks';
import { selectTrackListStatus } from '@/features/trackList/trackListSelectors';
import Preloader from '../ui/Preloader/Preloader';
import { useInitialTrackList } from '@/features/trackList/useTrackList';

export default function TrackList() {
   const loadingStatus = useAppSelector(selectTrackListStatus);
   useInitialTrackList();

   if (loadingStatus === 'loading') {
      return (
         <div className={styles.trackList}>
            <h1 data-testid="tracks-header">Your personal tracklist</h1>
            <TrackControls />
            <Preloader />
         </div>
      );
   }

   return (
      <div className={styles.trackList}>
         <h1 data-testid="tracks-header">Your personal tracklist</h1>
         <TrackControls />
         <List />
         <Pagination />
      </div>
   );
}
