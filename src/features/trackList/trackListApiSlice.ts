import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { ExtraType } from '../../types/extra';
import type { Status } from '../../types/status';
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
   trackIdSchema,
   deleteTracksBulkSchema,
} from './zod_schemas';

// Loads a list of tracks from the API with support for pagination, sorting, searching, and filtering by genre.
export const loadTracks = createAsyncThunk<
   {
      data: {
         data: TrackListT;
         meta: MetaT;
      };
   },
   TrackQueryT,
   {
      extra: ExtraType;
      rejectValue: string;
   }
>(
   'tracks/load-tracks',
   async (params, { extra: { client, api }, rejectWithValue }) => {
      const queryParams = new URLSearchParams();

      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.order) queryParams.append('order', params.order);
      if (params.search) queryParams.append('search', params.search);
      if (params.genre) queryParams.append('genre', params.genre);

      const queryString = queryParams.toString();
      const url = `${api.ALL_TRACKS}?${queryString}`;

      try {
         const result = await client.get(url);
         const parseResult = loadTracksSchema.safeParse(result.data); // Validate response using Zod
         if (!parseResult.success) {
            return rejectWithValue('Invalid TrackList Type from server');
         }
         return { data: parseResult.data };
      } catch (error) {
         if (error instanceof Error) return rejectWithValue(error.message);
         return rejectWithValue('Unknown error');
      }
   }
);

// Sends a new track to the API to be added to the database and returns the created track.
export const addTrack = createAsyncThunk<
   TrackT, // return
   CreateTrackDtoT, // input
   {
      extra: ExtraType;
      rejectValue: string;
   }
>(
   'tracks/add-track',
   async (newTrack, { extra: { client, api }, rejectWithValue }) => {
      try {
         const result = await client.post<TrackT>(api.createNewTrack, newTrack);
         const parseResult = trackSchema.safeParse(result.data); // Validate response using Zod
         if (!parseResult.success) {
            return rejectWithValue('Invalid Track Type from server');
         }
         return parseResult.data;
      } catch (error) {
         if (error instanceof Error) return rejectWithValue(error.message);
         return rejectWithValue('Unknown error');
      }
   }
);

// Sends updated track data to the API and returns the updated track from the server.
export const editTrack = createAsyncThunk<
   TrackT, // returned updated track
   UpdateTrackDtoT, // input: edited track
   {
      extra: ExtraType;
      rejectValue: string;
   }
>(
   'tracks/edit-track',
   async (updatedTrack, { extra: { client, api }, rejectWithValue }) => {
      const { id, ...newMeta } = updatedTrack;
      try {
         const result = await client.put<TrackT>(
            api.updateTrackById(id),
            newMeta
         );
         const parseResult = trackSchema.safeParse(result.data); // Validate response using Zod
         if (!parseResult.success) {
            return rejectWithValue('Invalid Track Type from server');
         }
         return parseResult.data;
      } catch (error) {
         if (error instanceof Error) return rejectWithValue(error.message);
         return rejectWithValue('Unknown error');
      }
   }
);

// Sends a delete request to the API for a specific track ID and returns the deleted ID if successful.
export const deleteTrack = createAsyncThunk<
   TrackIdT, // return
   TrackIdT, // input
   {
      extra: ExtraType;
      rejectValue: string;
   }
>(
   'tracks/delete-track',
   async (trackId, { extra: { client, api }, rejectWithValue }) => {
      try {
         const result = await client.delete(api.deleteTrackById(trackId));
         const parseResult = trackIdSchema.safeParse(result.data);
         if (!parseResult.success) {
            return rejectWithValue('Invalid ID Type from server');
         }
         return parseResult.data;
      } catch (error) {
         if (error instanceof Error) return rejectWithValue(error.message);
         return rejectWithValue('Unknown error');
      }
   }
);

export type UploadTrackFileParams = {
   id: string;
   file: File;
};

// Uploads an audio file for a specific track using multipart/form-data and returns the updated track data.
export const uploadTrackFile = createAsyncThunk<
   TrackT, // return
   UploadTrackFileParams, // input
   {
      extra: ExtraType;
      rejectValue: string;
   }
>(
   'tracks/upload-file',
   async ({ id, file }, { extra: { client, api }, rejectWithValue }) => {
      try {
         const formData = new FormData();
         formData.append('file', file);

         const result = await client.post(
            api.uploadAudioToTrackById(id),
            formData,
            {
               headers: { 'Content-Type': 'multipart/form-data' },
            }
         );
         const parseResult = trackSchema.safeParse(result.data); // Validate response using Zod
         if (!parseResult.success) {
            return rejectWithValue('Invalid Track Type from server');
         }
         return parseResult.data;
      } catch (error) {
         if (error instanceof Error) return rejectWithValue(error.message);
         return rejectWithValue('Unknown error');
      }
   }
);

// Deletes the audio file associated with a specific track and returns the updated track data.
export const deleteTrackFile = createAsyncThunk<
   TrackT, // return
   TrackIdT, // input
   {
      extra: ExtraType;
      rejectValue: string;
   }
>(
   'tracks/delete-track-file',
   async (trackId, { extra: { client, api }, rejectWithValue }) => {
      try {
         const result = await client.delete<TrackT>(
            api.deleteAudioToTrackById(trackId)
         );
         const parseResult = trackSchema.safeParse(result.data); // Validate response using Zod
         if (!parseResult.success) {
            return rejectWithValue('Invalid Track Type from server');
         }
         return parseResult.data;
      } catch (error) {
         if (error instanceof Error) return rejectWithValue(error.message);
         return rejectWithValue('Unknown error');
      }
   }
);

// MultiDeletes selected audio files associated with a specific tracks and returns the IDs of succesfully deleted tracks
export const deleteTracksBulk = createAsyncThunk<
   DeleteTracksBulkReturnT, // return
   {
      ids: TrackIdT[];
   }, // input
   {
      extra: ExtraType;
      rejectValue: string;
   }
>(
   'tracks/delete-tracks-bulk',
   async (tracksToDelete, { extra: { client, api }, rejectWithValue }) => {
      try {
         const result = await client.post(
            api.deleteMultipleTracks,
            tracksToDelete
         );
         const parseResult = deleteTracksBulkSchema.safeParse(result.data); // Validate response using Zod
         if (!parseResult.success) {
            return rejectWithValue('Invalid Track Type from server');
         }
         return parseResult.data;
      } catch (error) {
         if (error instanceof Error) return rejectWithValue(error.message);
         return rejectWithValue('Unknown error');
      }
   }
);

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

export const trackListSlice = createSlice({
   name: 'tracks',
   initialState,
   reducers: {
      // Set sorting value
      setSorting: (
         state,
         action: PayloadAction<
            Partial<{ sort: TrackQueryT['sort']; order: TrackQueryT['order'] }>
         >
      ) => {
         state.query = {
            ...state.query,
            ...action.payload,
            page: 1, // Reset page on new sort
         };
      },
      // Set filter value
      setFilter: (
         state,
         action: PayloadAction<Partial<TrackQueryT['genre']>>
      ) => {
         state.query.genre = action.payload;
         state.query.page = 1; // Reset page on new sort
      },
      // Set search value
      setSearch: (state, action: PayloadAction<TrackQueryT['search']>) => {
         state.query.search = action.payload;
         state.query.page = 1;
      },
      // On/off bulk delete mode
      toggleBulkDeleteMode: (state) => {
         state.bulkDeleteMode = !state.bulkDeleteMode;
         state.selectedTrackIds = [];
      },
      // Select track to bulk delete
      selectTrack: (state, action: PayloadAction<string>) => {
         if (!state.selectedTrackIds.includes(action.payload)) {
            state.selectedTrackIds.push(action.payload);
         }
      },
      // Select all tracks on page to bulk delete
      selectAllTracks: (state) => {
         state.list.map((track) => {
            if (
               !state.selectedTrackIds.find(
                  (selectedId) => selectedId === track.id
               )
            )
               state.selectedTrackIds.push(track.id);
         });
      },
      // Unselect track from deleting list
      unselectTrack: (state, action: PayloadAction<string>) => {
         state.selectedTrackIds = state.selectedTrackIds.filter(
            (id) => id !== action.payload
         );
      },
      // Unselect all tracks from deleting list
      clearSelectedTracks: (state) => {
         state.selectedTrackIds = [];
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(loadTracks.pending, (state) => {
            state.status = 'loading';
            state.error = null;
         })
         .addCase(loadTracks.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload ?? 'Cannot load data';
         })
         // Update state when receiving tracklist data
         .addCase(loadTracks.fulfilled, (state, action) => {
            state.status = 'received';
            state.list = action.payload.data.data;
            state.meta = action.payload.data.meta;
         })
         .addCase(addTrack.pending, (state) => {
            state.status = 'loading';
            state.error = null;
         })
         .addCase(addTrack.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload ?? 'Failed to add track';
         })
         // add new track on first place in array
         .addCase(addTrack.fulfilled, (state, action) => {
            state.status = 'received';
            state.list.unshift(action.payload);
         })
         .addCase(editTrack.pending, (state) => {
            state.status = 'loading';
            state.error = null;
         })
         .addCase(editTrack.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload ?? 'Failed to update track';
         })
         // change specific track after succesful update on server
         .addCase(editTrack.fulfilled, (state, action) => {
            state.status = 'received';
            const index = state.list.findIndex(
               (track) => track.id === action.payload.id
            );
            if (index !== -1) {
               state.list[index] = action.payload;
            }
         })
         .addCase(uploadTrackFile.pending, (state) => {
            state.status = 'loading';
            state.error = null;
         })
         .addCase(uploadTrackFile.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload ?? 'Failed to update track';
         })
         // Add audiofile link to specific track after succesful update on server
         .addCase(uploadTrackFile.fulfilled, (state, action) => {
            state.status = 'received';
            const index = state.list.findIndex(
               (track) => track.id === action.payload.id
            );
            if (index !== -1) {
               state.list[index] = action.payload;
            }
         })
         .addCase(deleteTrack.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload ?? 'Failed to delete track';
         })
         // Delete specific track after succesful delete on server
         .addCase(deleteTrack.fulfilled, (state, action) => {
            state.status = 'received';
            state.list = state.list.filter(
               (track) => track.id !== action.payload
            );
         })
         .addCase(deleteTracksBulk.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload ?? 'Failed to delete tracks';
         })
         // Delete specific tracks after succesful delete on server
         .addCase(deleteTracksBulk.fulfilled, (state, action) => {
            state.status = 'received';
            const deletedIds = action.payload.data.success;
            state.list = state.list.filter(
               (track) => !deletedIds.includes(track.id)
            );
         })
         .addCase(deleteTrackFile.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload ?? 'Failed to delete track file';
         })
         // Delete audiofile link of specific track after succesful delete on server
         .addCase(deleteTrackFile.fulfilled, (state, action) => {
            state.status = 'received';
            const index = state.list.findIndex(
               (track) => track.id === action.payload.id
            );
            if (index !== -1) {
               state.list[index] = action.payload;
            }
         });
   },
});

export const {
   setFilter,
   setSorting,
   setSearch,
   toggleBulkDeleteMode,
   selectTrack,
   selectAllTracks,
   unselectTrack,
   clearSelectedTracks,
} = trackListSlice.actions;
