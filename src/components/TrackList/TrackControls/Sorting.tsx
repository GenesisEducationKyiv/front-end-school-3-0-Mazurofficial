import styles from './TrackControls.module.scss';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadTracks, setSorting } from '@/features/trackList/trackListApiSlice';
import {
   selectTrackListMeta,
   selectTrackListQuery,
} from '@/features/trackList/trackListSelectors';
import Select from '@/components/ui/Select/Select';
import type { TrackQueryT } from '@/features/trackList/schema';

const sortOptions = [
   { label: 'Title', value: 'title' },
   { label: 'Artist', value: 'artist' },
   { label: 'Album', value: 'album' },
   { label: 'Created At', value: 'createdAt' },
];

const orderOptions = [
   { label: 'Ascending', value: 'asc' },
   { label: 'Descending', value: 'desc' },
];

export default function Sorting() {
   const dispatch = useAppDispatch();
   const { page, limit } = useAppSelector(selectTrackListMeta);
   const [sort, setSort] = useState<TrackQueryT['sort']>();
   const [order, setOrder] = useState<'asc' | 'desc'>('asc');
   const trackListQuery = useAppSelector(selectTrackListQuery);

   // Load sorted results from server
   const handleSortChange = (value: string) => {
      const newSort = (value || undefined) as TrackQueryT['sort'];
      setSort(newSort);
      dispatch(setSorting({ sort: newSort, order }));
      void dispatch(
         loadTracks({ ...trackListQuery, sort: newSort, order, page, limit })
      );
   };

   // Load ordered results from server
   const handleOrderChange = (value: string) => {
      const newOrder = value as 'asc' | 'desc';
      setOrder(newOrder);
      dispatch(setSorting({ sort, order: newOrder }));
      void dispatch(
         loadTracks({ ...trackListQuery, sort, order: newOrder, page, limit })
      );
   };

   return (
      <div className={styles.sorting}>
         <Select
            name="sort"
            label="Sort by:"
            value={sort ?? ''}
            onChange={handleSortChange}
            options={[{ label: '--', value: '' }, ...sortOptions]}
            className={styles.sort}
            data-testid="sort-select"
         />
         <Select
            name="order"
            label="Order:"
            value={order}
            onChange={handleOrderChange}
            options={orderOptions}
            className={styles.order}
         />
      </div>
   );
}
