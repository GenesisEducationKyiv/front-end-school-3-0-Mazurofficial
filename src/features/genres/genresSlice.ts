import type { ExtraType } from '@/types/extra';
import type { Status } from '@/types/status';
import { genresSchema } from './schema';
import { safeApiCall } from '@/utils/safeApiCall';
import { createAppSlice } from '@/app/createAppSlice';
import type { PayloadAction } from '@reduxjs/toolkit';

type GenresSlice = {
   status: Status;
   error: string | null;
   genres: string[];
};

const initialState: GenresSlice = {
   status: 'idle',
   error: null,
   genres: [],
};

export const genresSlice = createAppSlice({
   name: 'genres',
   initialState,
   reducers: (create) => ({
      setGenres: create.reducer((state, action: PayloadAction<string[]>) => {
         state.genres = action.payload;
      }),
      loadGenres: create.asyncThunk<
         {
            data: string[];
         },
         undefined,
         { extra: ExtraType; rejectValue: string }
      >(
         async (_, { extra: { client, api }, rejectWithValue }) => {
            const result = await safeApiCall(
               () => client.get(api.ALL_GENRES),
               genresSchema
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
               console.log(state.error);
            },
            fulfilled: (state, action) => {
               state.status = 'received';
               state.genres = action.payload.data;
            },
         }
      ),
   }),
});

export const { setGenres, loadGenres } = genresSlice.actions;
