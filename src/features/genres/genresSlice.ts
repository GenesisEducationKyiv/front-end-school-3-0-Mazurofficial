import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { ExtraType } from '../../types/extra';
import type { Status } from '../../types/status';
import { genresSchema } from './zod_schema';

// Loads a list of all available genres from the API and handles errors if they occur.
export const loadGenres = createAsyncThunk<
   {
      data: string[];
   },
   undefined,
   { extra: ExtraType; rejectValue: string }
>('genres/load', async (_, { extra: { client, api }, rejectWithValue }) => {
   try {
      const result = await client.get(api.ALL_GENRES);
      const parseResult = genresSchema.safeParse(result.data); // Validate response using Zod
      if (!parseResult.success) {
         return rejectWithValue('Invalid Genres Types from server');
      }
      return { data: parseResult.data };
   } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('Unknown error');
   }
});

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

export const genresSlice = createSlice({
   name: 'genres',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(loadGenres.pending, (state) => {
            state.status = 'loading';
            state.error = null;
         })
         .addCase(loadGenres.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload ?? 'Cannot load data';
            console.log(state.error);
         })
         .addCase(loadGenres.fulfilled, (state, action) => {
            state.status = 'received';
            state.genres = action.payload.data;
         });
   },
});
