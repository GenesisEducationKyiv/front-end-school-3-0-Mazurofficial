import styles from './TrackBtns.module.scss';
import { useAppDispatch } from '@/app/hooks';
import type { TrackIdT } from '@/features/trackList/schema';
import Button from '@/components/ui/Button/Button';
import { useDeleteTrack } from '@/apollo/mutations/deleteTrack';
import { deleteExTrack } from '@/features/trackList/trackListSlice';
import Spinner from '@/components/ui/Spinner/Spinner';

type DeleteTrackBtnProps = {
   id: TrackIdT;
};

export default function DeleteTrackBtn({ id }: DeleteTrackBtnProps) {
   const dispatch = useAppDispatch();
   const { deleteTrack, loading } = useDeleteTrack();

   // Delete track by id
   const handleDeleteTrack = async (id: string) => {
      if (window.confirm('Are you sure you want to delete this track?')) {
         const result = await deleteTrack(id);
         if (result.isOk() && result.value) {
            dispatch(deleteExTrack(id));
         } else if (result.isErr()) {
            console.error(result.error);
         }
      }
   };

   if (loading)
      return (
         <Button
            disabled
            className={`${styles.iconButton} ${styles.deleteButton}`}
            variant="icon-button"
         >
            <Spinner />
         </Button>
      );

   return (
      <Button
         className={`${styles.iconButton} ${styles.deleteButton}`}
         onClick={() => {
            void handleDeleteTrack(id);
         }}
         title="Delete track"
         data-testid={`delete-track-${id}`}
         variant="icon-button"
      >
         <i className="fa-solid fa-trash"></i>
      </Button>
   );
}
