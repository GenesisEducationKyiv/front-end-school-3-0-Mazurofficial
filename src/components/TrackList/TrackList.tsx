import Pagination from './Pagination/Pagination';
import List from './List/List';
import TrackControls from './TrackControls/TrackControls';
import styles from './TrackList.module.scss';
import Preloader from '../ui/Preloader/Preloader';
import useGraphTrackList from '@/features/trackList/useGraphTrackList';

export default function TrackList() {
   const { loading, error } = useGraphTrackList();

   if (loading) {
      return (
         <div className={styles.trackList}>
            <h1 data-testid="tracks-header">Your personal tracklist</h1>
            <TrackControls />
            <Preloader />
         </div>
      );
   }
   if (error) {
      return (
         <div className={styles.trackList}>
            <h1 data-testid="tracks-header">Something went wrong</h1>
            <p>{error}</p>
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
