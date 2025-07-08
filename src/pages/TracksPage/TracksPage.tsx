import React, { Suspense } from 'react';
import { useAppSelector } from '@/app/hooks';
import { Modal } from '@/components/ui/Modal/Modal';
import Header from '@/components/Header/Header';
import TrackList from '@/components/TrackList/TrackList';
import {
   selectModalType,
   selectTrackToEdit,
} from '@/features/modalWindow/modalWindowSelector';
import Preloader from '@/components/ui/Preloader/Preloader';

const AddTrackForm = React.lazy(
   () => import('@/components/AddTrackForm/AddTrackForm')
);
const EditTrackForm = React.lazy(
   () => import('@/components/EditTrackForm/EditTrackForm')
);
const UploadAudioForm = React.lazy(
   () => import('@/components/UploadAudioForm/UploadAudioForm')
);

export default function TracksPage() {
   const modalWindowType = useAppSelector(selectModalType);
   const trackToEditId = useAppSelector(selectTrackToEdit);

   return (
      <>
         <Header />
         <TrackList />
         <Modal>
            {/* Using Suspense to enable code splitting and lazy loading of modal forms.
            This ensures that AddTrackForm, EditTrackForm, and UploadAudioForm are loaded only when needed. */}
            <Suspense fallback={<Preloader />}>
               {modalWindowType === 'add' && <AddTrackForm />}
               {modalWindowType === 'edit' && (
                  <EditTrackForm id={trackToEditId ?? ''} />
               )}
               {modalWindowType === 'upload' && (
                  <UploadAudioForm id={trackToEditId ?? ''} />
               )}
            </Suspense>
         </Modal>
      </>
   );
}
