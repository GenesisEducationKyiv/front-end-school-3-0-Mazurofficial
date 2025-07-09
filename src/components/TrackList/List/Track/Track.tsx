import styles from './Track.module.scss';
import CoverImage from './CoverImage/CoverImage';
import TrackInfo from './TrackInfo/TrackInfo';
import TrackBtns from './TrackBtns/TrackBtns';
import type { TrackIdT } from '@/features/trackList/schema';
import React, { Suspense } from 'react';
import Spinner from '@/components/ui/Spinner/Spinner';
const Audio = React.lazy(() => import('@/components/ui/Audio/Audio'));

type TrackProps = {
   id: TrackIdT;
};

export default function Track({ id }: TrackProps) {
   return (
      <li className={styles.track} id={id} data-testid={`track-item-${id}`}>
         <CoverImage id={id} />
         <TrackInfo id={id} />
         <Suspense fallback={<Spinner />}>
            <Audio id={id} />
         </Suspense>
         <TrackBtns id={id} />
      </li>
   );
}
