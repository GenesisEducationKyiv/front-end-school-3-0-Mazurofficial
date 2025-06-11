import { useAppSelector } from '@/app/hooks';
import {
   selectTrackListQuery,
   selectTrackListStatus,
} from '@/features/trackList/trackListSelectors';
import Select from '@/components/ui/Select/Select';
import styles from './TrackControls.module.scss';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PageLimitSelect() {
   const { limit } = useAppSelector(selectTrackListQuery);
   const [limitValue, setLimitValue] = useState(limit ?? 10);
   const status = useAppSelector(selectTrackListStatus);
   const options = [5, 10, 15, 20, 50].map((val) => ({
      label: val.toString(),
      value: val.toString(),
   }));
   const [, setSearchParams] = useSearchParams();

   useEffect(() => {
      setLimitValue(limit ?? 10);
   }, [limit]);

   // Send request to load tracks with new Meta{limit}
   const handleLimitChange = (newLimit: number) => {
      setSearchParams((searchParams) => {
         searchParams.set('limit', newLimit.toString());
         searchParams.set('page', '1');
         return searchParams;
      });
   };

   return (
      <div className={styles.pageLimitSelect}>
         <Select
            label="Tracks per page:"
            name="page-limit"
            value={limitValue.toString()}
            onChange={(value) => {
               handleLimitChange(parseInt(value, 10));
            }}
            disabled={status === 'loading'}
            options={options}
         />
      </div>
   );
}
