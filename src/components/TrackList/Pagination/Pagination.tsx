import { useAppSelector } from '@/app/hooks';
import {
   selectTrackListMeta,
   selectTrackListStatus,
} from '@/features/trackList/trackListSelectors';
import Button from '@/components/ui/Button/Button';
import styles from './Pagination.module.scss';
import { useSearchParams } from 'react-router-dom';
import { updateSearchParam } from '@/utils/updateSearchParams';

export default function Pagination() {
   const { page, totalPages } = useAppSelector(selectTrackListMeta);
   const status = useAppSelector(selectTrackListStatus);
   const [, setSearchParams] = useSearchParams();

   const isValidPage = (page: number) => 1 <= page && page <= totalPages;

   // Send request to server with newPage
   const handlePageChange = (newPage: number) => {
      if (isValidPage(newPage)) {
         setSearchParams((searchParams) =>
            updateSearchParam(searchParams, 'page', newPage.toString())
         );
      } else console.error('Wrong page');
   };

   return (
      <>
         {totalPages >= 1 && (
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
