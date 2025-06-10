import styles from './TrackControls.module.scss';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectAllGenres } from '@/features/genres/trackListSelectors';
import { loadGenres } from '@/features/genres/genresSlice';
import { setFilter } from '@/features/trackList/trackListApiSlice';
import Select from '@/components/ui/Select/Select';
import { useSearchParams } from 'react-router-dom';
import { selectTrackListQuery } from '@/features/trackList/trackListSelectors';

export default function Filter() {
   const dispatch = useAppDispatch();
   const genres = useAppSelector(selectAllGenres);
   const { genre } = useAppSelector(selectTrackListQuery);
   const [selectedGenre, setSelectedGenre] = useState(genre);
   const [, setSearchParams] = useSearchParams();

   // Load list of available genres
   useEffect(() => {
      void dispatch(loadGenres());
   }, [dispatch]);

   // shows value from Url if exist
   useEffect(() => {
      setSelectedGenre(genre);
   }, [genre]);

   // Send request to load tracks of selected genres
   const handleGenreChange = (genre: string) => {
      dispatch(setFilter(genre || undefined));
      setSearchParams((searchParams) => {
         // eslint-disable-next-line @typescript-eslint/no-unused-expressions
         genre
            ? searchParams.set('genre', genre)
            : searchParams.delete('genre');
         searchParams.set('page', '1');
         return searchParams;
      });
   };

   // Map genres to Option view
   const genreOptions = [
      { label: 'All', value: '' },
      ...genres.map((genre) => ({ label: genre, value: genre })),
   ];

   return (
      <div className={styles.filter}>
         <Select
            name="genre"
            label="Genre:"
            value={selectedGenre ?? ''}
            onChange={handleGenreChange}
            options={genreOptions}
            data-testid="filter-genre"
         />
      </div>
   );
}
