import { useMutation } from '@apollo/client';
import { BULK_DELETE_TRACKS, GET_TRACKS } from '@/apollo/api';
import { useValidSearchParams } from '@/hooks/useValidSearchParams';
import {
   deleteTracksBulkSchema,
   type BulkDeleteTracksGraphResultT,
   type DeleteTracksBulkReturnT,
} from '@/features/trackList/schema';
import { parseMutationResult } from '@/utils/parseMutationResult';
import { err, type Result } from 'neverthrow';

export function useBulkDeleteTracks() {
   const [bulkDeleteTracksMutation, { loading, error }] =
      useMutation<BulkDeleteTracksGraphResultT>(BULK_DELETE_TRACKS);
   const { params } = useValidSearchParams();

   const bulkDeleteTracks = async (
      ids: string[]
   ): Promise<Result<DeleteTracksBulkReturnT, string>> => {
      try {
         const result = await bulkDeleteTracksMutation({
            variables: { ids },
            refetchQueries: [{ query: GET_TRACKS, variables: { ...params } }],
         });
         return parseMutationResult(
            result.data ?? {},
            'deleteTracks',
            deleteTracksBulkSchema
         );
      } catch (e) {
         const errorMessage = e instanceof Error ? e.message : String(e);
         return err(errorMessage);
      }
   };

   return { bulkDeleteTracks, loading, error };
}
