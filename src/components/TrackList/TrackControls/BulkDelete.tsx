import styles from './TrackControls.module.scss';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
   clearSelectedTracks,
   deleteExTracksBulk,
   selectAllTracks,
   toggleBulkDeleteMode,
} from '@/features/trackList/trackListApiSlice';
import {
   selectBulkDeleteMode,
   selectSelectedTrackIds,
   selectTrackListMeta,
} from '@/features/trackList/trackListSelectors';
import Button from '@/components/ui/Button/Button';
import { useBulkDeleteTracks } from '@/apollo/mutations/bulkDeleteTracks';

export default function BulkDelete() {
   const dispatch = useAppDispatch();
   const bulkDeleteMode = useAppSelector(selectBulkDeleteMode);
   const selectedTrackIds = useAppSelector(selectSelectedTrackIds);
   const { limit } = useAppSelector(selectTrackListMeta);
   const { bulkDeleteTracks } = useBulkDeleteTracks();

   // Toggle BulkDelete mode
   const handleToggle = () => dispatch(toggleBulkDeleteMode());

   // Send request to delete all selected tracks
   const handleBulkDelete = async () => {
      if (
         selectedTrackIds.length > 0 &&
         window.confirm('Are you sure you want to delete these tracks?')
      ) {
         const result = await bulkDeleteTracks(selectedTrackIds);
         if (result.isOk()) {
            const { success, failed } = result.value;
            dispatch(
               deleteExTracksBulk({
                  success,
                  failed,
               })
            );
         } else if (result.isErr()) {
            console.error(result.error);
         }
         dispatch(clearSelectedTracks());
         handleToggle();
      }
   };

   // Select all tracks on page
   const handleSelectAll = () => {
      dispatch(selectAllTracks());
   };

   return (
      <div className={styles.buttonsContainer}>
         <Button onClick={handleToggle} data-testid="select-mode-toggle">
            {bulkDeleteMode ? (
               'Cancel'
            ) : (
               <span>
                  Bulk Delete <i className="fa-solid fa-trash"></i>
               </span>
            )}
         </Button>
         {bulkDeleteMode && selectedTrackIds.length < limit && (
            <Button onClick={handleSelectAll} data-testid="select-all">
               Select all
            </Button>
         )}
         {bulkDeleteMode && selectedTrackIds.length > 0 && (
            <Button
               onClick={() => void handleBulkDelete()}
               className={styles.deleteSelected}
               data-testid="bulk-delete-button"
            >
               Delete Selected ({selectedTrackIds.length})
            </Button>
         )}
      </div>
   );
}
