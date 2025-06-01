import type { CreateTrackDtoT } from '../../features/trackList/zod_schemas';
import Form from '../ui/Form/Form';

const initialFormState: CreateTrackDtoT = {
   title: '',
   artist: '',
   album: '',
   genres: [],
   coverImage: '',
};

export default function AddTrackForm() {
   return <Form initialState={initialFormState} onSubmitAction="ADD" />;
}
