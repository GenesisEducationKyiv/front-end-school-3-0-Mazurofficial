import { useAppSelector } from '@/app/hooks';
import { selectAllTrackList } from '@/features/trackList/trackListSelectors';
import styles from './List.module.scss';
import Track from './Track/Track';

export default function List() {
   const list = useAppSelector(selectAllTrackList);

   return (
      <ul data-testid="track-list" className={styles.list}>
         {list.length > 0 ? (
            list.map((track) => <Track id={track.id} key={track.id} />)
         ) : (
            <h2>Sorry! There are no such tracks</h2>
         )}
      </ul>
   );
}
