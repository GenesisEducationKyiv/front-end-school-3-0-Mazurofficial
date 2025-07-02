import { useMutation } from '@apollo/client';
import { UPLOAD_TRACK_FILE, GET_TRACKS } from '@/apollo/api';
import {
   trackSchema,
   type UploadTrackFileGraphT,
   type TrackT,
} from '@/features/trackList/schema';
import { useValidSearchParams } from '@/hooks/useValidSearchParams';
import { parseMutationResult } from '@/utils/parseMutationResult';
import { err, type Result } from 'neverthrow';

export function useUploadTrackFile() {
   const [uploadTrackFileMutation, { loading, error }] =
      useMutation<UploadTrackFileGraphT>(UPLOAD_TRACK_FILE);
   const { params } = useValidSearchParams();

   const uploadTrackFile = async (
      id: string,
      file: File
   ): Promise<Result<TrackT, string>> => {
      try {
         const result = await uploadTrackFileMutation({
            variables: { id, file },
            refetchQueries: [{ query: GET_TRACKS, variables: { ...params } }],
         });
         return parseMutationResult(
            result.data ?? {},
            'uploadTrackFile',
            trackSchema
         );
      } catch (e) {
         const errorMessage = e instanceof Error ? e.message : String(e);
         return err(errorMessage);
      }
   };

   return { uploadTrackFile, loading, error };
}
