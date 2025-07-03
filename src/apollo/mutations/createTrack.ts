import { useMutation } from '@apollo/client';
import { CREATE_TRACK, GET_TRACKS } from '@/apollo/api';
import {
   trackSchema,
   type CreateTrackDtoT,
   type TrackT,
} from '@/features/trackList/schema';
import { useValidSearchParams } from '@/hooks/useValidSearchParams';
import type { CreateTrackGraphT } from '@/features/trackList/schema';
import { parseMutationResult } from '@/utils/parseMutationResult';
import { err, type Result } from 'neverthrow';

export function useCreateTrack() {
   const [createTrackMutation, { loading, error }] =
      useMutation<CreateTrackGraphT>(CREATE_TRACK);
   const { params } = useValidSearchParams();

   const createTrack = async (
      input: CreateTrackDtoT
   ): Promise<Result<TrackT, string>> => {
      try {
         const result = await createTrackMutation({
            variables: { input },
            refetchQueries: [{ query: GET_TRACKS, variables: { ...params } }],
         });
         return parseMutationResult(
            result.data ?? {},
            'createTrack',
            trackSchema
         );
      } catch (e) {
         const errorMessage = e instanceof Error ? e.message : String(e);
         return err(errorMessage);
      }
   };

   return { createTrack, loading, error };
}
