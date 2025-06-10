import styles from './TrackControls.module.scss';
import type { ChangeEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import Input from '@/components/ui/Input/Input';
import { useSearchParams } from 'react-router-dom';
import { setSearch } from '@/features/trackList/trackListApiSlice';

export default function Search() {
   const dispatch = useAppDispatch();
   const isFirstRender = useRef(true);
   const [, setSearchParams] = useSearchParams();
   const [searchInput, setSearchInput] = useState('');

   useEffect(() => {
      // Skip first render
      if (isFirstRender.current) {
         isFirstRender.current = false;
         return;
      }

      const timeoutId = setTimeout(() => {
         dispatch(setSearch(searchInput || undefined));
         setSearchParams((searchParams) => {
            searchParams.set('search', searchInput);
            searchParams.set('page', '1');
            return searchParams;
         });
      }, 1000);

      return () => {
         clearTimeout(timeoutId);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [searchInput]);

   // Handle search input change
   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
   };

   return (
      <Input
         label="Search:"
         name="search"
         placeholder="Search by title, artist, album..."
         type="text"
         value={searchInput}
         onChange={handleChange}
         className={styles.search}
         data-testid="search-input"
      />
   );
}
