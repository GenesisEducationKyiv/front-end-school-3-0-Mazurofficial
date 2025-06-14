import { useAppSelector } from '@/app/hooks';
import { selectTrackById } from '@/features/trackList/trackListSelectors';
import styles from './CoverImage.module.scss';
import fallbackImage from '@/assets/fallbak.svg';
import type { TrackIdT } from '@/features/trackList/schema';

type CoverImageProps = {
   id: TrackIdT;
};

export default function CoverImage({ id }: CoverImageProps) {
   const track = useAppSelector((state) => selectTrackById(state, id));
   const imageUrl = track?.coverImage;
   // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
   return <img className={styles.cover} src={imageUrl || fallbackImage} />;
}
