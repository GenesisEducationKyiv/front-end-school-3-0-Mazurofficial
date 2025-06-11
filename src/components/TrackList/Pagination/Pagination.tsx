import { useAppSelector } from '@/app/hooks';
import {
   selectTrackListMeta,
   selectTrackListStatus,
} from '@/features/trackList/trackListSelectors';
import Button from '@/components/ui/Button/Button';
import styles from './Pagination.module.scss';
import { useSearchParams } from 'react-router-dom';

export default function Pagination() {
   const { page, totalPages } = useAppSelector(selectTrackListMeta);
   const status = useAppSelector(selectTrackListStatus);
   const [, setSearchParams] = useSearchParams();

   // Send request to server with newPage
   const handlePageChange = (newPage: number) => {
      //void dispatch(loadTracks({ ...trackListQuery, page: newPage, limit }));
      setSearchParams((searchParams) => {
         searchParams.set('page', newPage.toString());
         return searchParams;
      });
   };

   return (
      <>
         {totalPages !== 1 && (
            <div className={styles.pagination} data-testid="pagination">
               <Button
                  onClick={() => {
                     handlePageChange(page - 1);
                  }}
                  disabled={page === 1 || status === 'loading'}
                  data-testid="pagination-prev"
               >
                  Previous
               </Button>
               <span className={styles.info}>
                  Page {page} of {totalPages}
               </span>
               <Button
                  onClick={() => {
                     handlePageChange(page + 1);
                  }}
                  disabled={page === totalPages || status === 'loading'}
                  data-testid="pagination-next"
               >
                  Next
               </Button>
            </div>
         )}
      </>
   );
}
