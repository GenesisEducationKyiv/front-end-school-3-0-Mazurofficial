import { createAppSlice } from '@/app/createAppSlice';
import type { TrackQueryT } from '../trackList/schema';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: TrackQueryT = {
   sort: undefined,
   order: 'asc',
   search: undefined,
   genre: undefined,
};

export const querySlice = createAppSlice({
   name: 'query',
   initialState,
   reducers: (create) => ({
      setQuery: create.reducer(
         (state, action: PayloadAction<Partial<TrackQueryT>>) => {
            state = {
               ...state,
               ...action.payload,
            };
         }
      ),
      setSorting: create.reducer(
         (state, action: PayloadAction<Partial<TrackQueryT>>) => {
            state = {
               ...state,
               ...action.payload,
            };
         }
      ),
      setFilter: create.reducer(
         (state, action: PayloadAction<Partial<TrackQueryT['genre']>>) => {
            state.genre = action.payload;
            state.page = 1; // Reset page on new sort
         }
      ),
      setSearch: create.reducer(
         (state, action: PayloadAction<TrackQueryT['search']>) => {
            state.search = action.payload;
            state.page = 1;
         }
      ),
   }),
});

export const { setFilter, setQuery, setSorting, setSearch } =
   querySlice.actions;
