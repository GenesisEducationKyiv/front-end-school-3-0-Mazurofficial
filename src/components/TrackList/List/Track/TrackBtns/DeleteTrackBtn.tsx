import styles from './TrackBtns.module.scss';
import { useAppDispatch } from '@/app/hooks';
import type { TrackIdT } from '@/features/trackList/schema';
import Button from '@/components/ui/Button/Button';
import { useDeleteTrack } from '@/apollo/mutations/deleteTrack';
import { deleteExTrack } from '@/features/trackList/trackListApiSlice';

type DeleteTrackBtnProps = {
   id: TrackIdT;
};

export default function DeleteTrackBtn({ id }: DeleteTrackBtnProps) {
   const dispatch = useAppDispatch();
   const { deleteTrack } = useDeleteTrack();

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

   return (
      <Button
         className={`${styles.iconButton} ${styles.deleteButton}`}
         onClick={() => {
            void handleDeleteTrack(id);
         }}
         title="Delete track"
         data-testid={`delete-track-${id}`}
      >
         <i className="fa-solid fa-trash"></i>
      </Button>
   );
}
