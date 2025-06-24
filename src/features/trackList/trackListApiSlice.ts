import type { PayloadAction } from '@reduxjs/toolkit';
import type { ExtraType } from '@/types/extra';
import type { Status } from '@/types/status';
import {
   type MetaT,
   type TrackListT,
   type TrackT,
   type TrackQueryT,
   type CreateTrackDtoT,
   type UpdateTrackDtoT,
   type TrackIdT,
   type DeleteTracksBulkReturnT,
   loadTracksSchema,
   trackSchema,
   deleteTracksBulkSchema,
} from './schema';
import { safeApiCall } from '../../utils/safeApiCall';
import { createAppSlice } from '@/app/createAppSlice';

export type UploadTrackFileParams = {
   id: string;
   file: File;
};

type TrackListSlice = {
   status: Status;
   error: string | null;
   list: TrackListT;
   meta: MetaT;
   query: TrackQueryT;
   bulkDeleteMode: boolean;
   selectedTrackIds: TrackIdT[];
};

const initialState: TrackListSlice = {
   status: 'idle',
   error: null,
   list: [],
   meta: {
      total: 0,
      page: 0,
      limit: 0,
      totalPages: 0,
   },
   query: {
      sort: undefined,
      order: 'asc',
      search: undefined,
      genre: undefined,
   },
   bulkDeleteMode: false,
   selectedTrackIds: [],
};

export const trackListSlice = createAppSlice({
   name: 'tracks',
   initialState,
   reducers: (create) => ({
      setQuery: create.reducer(
         (state, action: PayloadAction<Partial<TrackQueryT>>) => {
            state.query = {
               ...action.payload,
            };
         }
      ),
      setSorting: create.reducer(
         (state, action: PayloadAction<Partial<TrackQueryT>>) => {
            state.query = {
               ...state.query,
               ...action.payload,
            };
         }
      ),
      setFilter: create.reducer(
         (state, action: PayloadAction<Partial<TrackQueryT['genre']>>) => {
            state.query.genre = action.payload;
            state.query.page = 1; // Reset page on new sort
         }
      ),
      setSearch: create.reducer(
         (state, action: PayloadAction<TrackQueryT['search']>) => {
            state.query.search = action.payload;
            state.query.page = 1;
         }
      ),
      toggleBulkDeleteMode: create.reducer((state) => {
         state.bulkDeleteMode = !state.bulkDeleteMode;
         state.selectedTrackIds = [];
      }),
      toggleTrack: create.reducer((state, action: PayloadAction<string>) => {
         if (state.selectedTrackIds.includes(action.payload)) {
            state.selectedTrackIds = state.selectedTrackIds.filter(
               (id) => id !== action.payload
            );
         } else {
            state.selectedTrackIds.push(action.payload);
         }
      }),
      selectAllTracks: create.reducer((state) => {
         state.list.map((track) => {
            if (
               !state.selectedTrackIds.find(
                  (selectedId) => selectedId === track.id
               )
            ) {
               state.selectedTrackIds.push(track.id);
            }
         });
      }),
      clearSelectedTracks: create.reducer((state) => {
         state.selectedTrackIds = [];
      }),
      loadTracks: create.asyncThunk<
         { data: { data: TrackListT; meta: MetaT } },
         URLSearchParams,
         { extra: ExtraType; rejectValue: string }
      >(
         async (
            params: URLSearchParams,
            { extra: { client, api }, rejectWithValue }
         ) => {
            const url = `${api.ALL_TRACKS}?${params.toString()}`;
            const result = await safeApiCall(
               () => client.get(url),
               loadTracksSchema
            );
            if (result.isErr()) return rejectWithValue(result.error);
            return { data: result.value };
         },
         {
            pending: (state) => {
               state.status = 'loading';
               state.error = null;
            },
            rejected: (state, action) => {
               state.status = 'rejected';
               state.error = action.payload ?? 'Cannot load data';
            },
            fulfilled: (state, action) => {
               state.status = 'received';
               state.list = action.payload.data.data;
               state.meta = action.payload.data.meta;
            },
         }
      ),
      addTrack: create.asyncThunk<
         TrackT,
         CreateTrackDtoT,
         {
            extra: ExtraType;
            rejectValue: string;
         }
      >(
         async (newTrack, { extra: { client, api }, rejectWithValue }) => {
            const result = await safeApiCall<TrackT>(
               () => client.post(api.createNewTrack, newTrack),
               trackSchema
            );
            if (result.isErr()) return rejectWithValue(result.error);

            return result.value;
         },
         {
            pending: (state) => {
               state.status = 'loading';
               state.error = null;
            },
            rejected: (state, action) => {
               state.status = 'rejected';
               state.error = action.payload ?? 'Failed to add track';
            },
            // add new track on first place in array
            fulfilled: (state, action) => {
               state.status = 'received';
               state.list.unshift(action.payload);
            },
         }
      ),
      editTrack: create.asyncThunk<
         TrackT,
         UpdateTrackDtoT,
         { extra: ExtraType; rejectValue: string }
      >(
         async (updatedTrack, { extra: { client, api }, rejectWithValue }) => {
            const { id, ...newMeta } = updatedTrack;

            const result = await safeApiCall(
               () => client.put(api.updateTrackById(id), newMeta),
               trackSchema
            );

            if (result.isErr()) return rejectWithValue(result.error);

            return result.value;
         },
         {
            pending: (state) => {
               state.status = 'loading';
               state.error = null;
            },
            rejected: (state, action) => {
               state.status = 'rejected';
               state.error = action.payload ?? 'Failed to update track';
            },
            // change specific track after succesful update on server
            fulfilled: (state, action) => {
               state.status = 'received';
               const index = state.list.findIndex(
                  (track) => track.id === action.payload.id
               );
               if (index !== -1) {
                  state.list[index] = action.payload;
               }
            },
         }
      ),
      deleteTrack: create.asyncThunk<
         TrackIdT,
         TrackIdT,
         { extra: ExtraType; rejectValue: string }
      >(
         async (trackId, { extra: { client, api }, rejectWithValue }) => {
            const result = await safeApiCall(() =>
               client.delete(api.deleteTrackById(trackId))
            );

            if (result.isErr()) return rejectWithValue(result.error);

            return trackId;
         },
         {
            pending: (state) => {
               state.status = 'loading';
               state.error = null;
            },
            rejected: (state, action) => {
               state.status = 'rejected';
               state.error = action.payload ?? 'Failed to delete track';
            },
            fulfilled: (state, action) => {
               state.status = 'received';
               state.list = state.list.filter(
                  (track) => track.id !== action.payload
               );
            },
         }
      ),
      uploadTrackFile: create.asyncThunk<
         TrackT,
         UploadTrackFileParams,
         { extra: ExtraType; rejectValue: string }
      >(
         async ({ id, file }, { extra: { client, api }, rejectWithValue }) => {
            const formData = new FormData();
            formData.append('file', file);

            const result = await safeApiCall<TrackT>(
               () =>
                  client.post(api.uploadAudioToTrackById(id), formData, {
                     headers: { 'Content-Type': 'multipart/form-data' },
                  }),
               trackSchema
            );

            if (result.isErr()) return rejectWithValue(result.error);

            return result.value;
         },
         {
            pending: (state) => {
               state.status = 'loading';
               state.error = null;
            },
            rejected: (state, action) => {
               state.status = 'rejected';
               state.error = action.payload ?? 'Failed to upload track file';
            },
            fulfilled: (state, action) => {
               state.status = 'received';
               const index = state.list.findIndex(
                  (track) => track.id === action.payload.id
               );
               if (index !== -1) {
                  state.list[index] = action.payload;
               }
            },
         }
      ),
      deleteTrackFile: create.asyncThunk<
         TrackT,
         TrackIdT,
         { extra: ExtraType; rejectValue: string }
      >(
         async (trackId, { extra: { client, api }, rejectWithValue }) => {
            const result = await safeApiCall<TrackT>(
               () => client.delete(api.deleteAudioToTrackById(trackId)),
               trackSchema
            );

            if (result.isErr()) return rejectWithValue(result.error);

            return result.value;
         },
         {
            pending: (state) => {
               state.status = 'loading';
               state.error = null;
            },
            rejected: (state, action) => {
               state.status = 'rejected';
               state.error = action.payload ?? 'Failed to delete track file';
            },
            fulfilled: (state, action) => {
               state.status = 'received';
               const index = state.list.findIndex(
                  (track) => track.id === action.payload.id
               );
               if (index !== -1) {
                  state.list[index] = action.payload;
               }
            },
         }
      ),
      deleteTracksBulk: create.asyncThunk<
         DeleteTracksBulkReturnT,
         { ids: TrackIdT[] },
         { extra: ExtraType; rejectValue: string }
      >(
         async (
            tracksToDelete,
            { extra: { client, api }, rejectWithValue }
         ) => {
            const result = await safeApiCall<DeleteTracksBulkReturnT>(
               () => client.post(api.deleteMultipleTracks, tracksToDelete),
               deleteTracksBulkSchema
            );

            if (result.isErr()) return rejectWithValue(result.error);

            return result.value;
         },
         {
            pending: (state) => {
               state.status = 'loading';
               state.error = null;
            },
            rejected: (state, action) => {
               state.status = 'rejected';
               state.error = action.payload ?? 'Failed to delete tracks';
            },
            fulfilled: (state, action) => {
               state.status = 'received';
               const deletedIds = action.payload.success;
               state.list = state.list.filter(
                  (track) => !deletedIds.includes(track.id)
               );
            },
         }
      ),
   }),
});

export const {
   setQuery,
   setFilter,
   setSorting,
   setSearch,
   toggleBulkDeleteMode,
   selectAllTracks,
   toggleTrack,
   clearSelectedTracks,
   loadTracks,
   addTrack,
   editTrack,
   deleteTrack,
   uploadTrackFile,
   deleteTrackFile,
   deleteTracksBulk,
} = trackListSlice.actions;
