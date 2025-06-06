import styles from './TrackBtns.module.scss';
import { useAppDispatch } from '@/app/hooks';
import { deleteTrack } from '@/features/trackList/trackListApiSlice';
import type { TrackIdT } from '@/features/trackList/schema';
import Button from '@/components/ui/Button/Button';

type DeleteTrackBtnProps = {
   id: TrackIdT;
};

export default function DeleteTrackBtn({ id }: DeleteTrackBtnProps) {
   const dispatch = useAppDispatch();

   // Delete track by id
   const handleDeleteTrack = (id: string) => {
      if (window.confirm('Are you sure you want to delete this track?')) {
         void dispatch(deleteTrack(id));
      }
   };

   return (
      <Button
         className={`${styles.iconButton} ${styles.deleteButton}`}
         onClick={() => {
            handleDeleteTrack(id);
         }}
         title="Delete track"
         data-testid={`delete-track-${id}`}
      >
         <i className="fa-solid fa-trash"></i>
      </Button>
   );
}
