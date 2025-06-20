import { useAppSelector } from '@/app/hooks';
import { selectTrackById } from '@/features/trackList/trackListSelectors';
import styles from './Track.module.scss';
import CoverImage from './CoverImage/CoverImage';
import TrackInfo from './TrackInfo/TrackInfo';
import Audio from '@/components/ui/Audio/Audio';
import TrackBtns from './TrackBtns/TrackBtns';
import type { TrackIdT } from '@/features/trackList/schema';

type TrackProps = {
   id: TrackIdT;
};

export default function Track({ id }: TrackProps) {
   const track = useAppSelector((state) => selectTrackById(state, id));

   if (!track) return null;

   return (
      <li className={styles.track} id={id} data-testid={`track-item-${id}`}>
         <CoverImage id={id} />
         <TrackInfo id={id} />
         <Audio id={id} />
         <TrackBtns id={id} />
      </li>
   );
}
