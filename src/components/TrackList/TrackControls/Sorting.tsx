import styles from './TrackControls.module.scss';
import { useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { setSorting } from '@/features/trackList/trackListApiSlice';

import Select from '@/components/ui/Select/Select';
import type { TrackQueryT } from '@/features/trackList/schema';
import { useSearchParams } from 'react-router-dom';

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
   const [sort, setSort] = useState<TrackQueryT['sort']>();
   const [order, setOrder] = useState<'asc' | 'desc'>('asc');
   const [, setSearchParams] = useSearchParams();

   // Load sorted results from server
   const handleSortChange = (value: string) => {
      const newSort = (value || undefined) as TrackQueryT['sort'];
      setSort(newSort);
      dispatch(setSorting({ sort: newSort, order }));
      setSearchParams((searchParams) => {
         // eslint-disable-next-line @typescript-eslint/no-unused-expressions
         newSort
            ? searchParams.set('sort', newSort)
            : searchParams.delete('sort');
         return searchParams;
      });
   };

   // Load ordered results from server
   const handleOrderChange = (value: string) => {
      const newOrder = value as 'asc' | 'desc';
      setOrder(newOrder);
      dispatch(setSorting({ sort, order: newOrder }));
      setSearchParams((searchParams) => {
         searchParams.set('order', newOrder);
         return searchParams;
      });
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
