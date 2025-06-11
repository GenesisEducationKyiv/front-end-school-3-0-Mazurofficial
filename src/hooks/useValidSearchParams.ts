import { useLocation } from 'react-router-dom';
import { pipe, O, D, A } from '@mobily/ts-belt';
import type { TrackQueryT } from '@/features/trackList/schema';

const sortOptions = ['title', 'artist', 'album', 'createdAt'] as const;
const orderOptions = ['asc', 'desc'] as const;

type SortOption = (typeof sortOptions)[number];
type OrderOption = (typeof orderOptions)[number];

export function useValidSearchParams(): {
   params: Partial<TrackQueryT>;
   paramsUrl: URLSearchParams;
} {
   const { search } = useLocation();
   const params = new URLSearchParams(search);

   const getCleanString = (key: string) =>
      pipe(
         O.fromNullable(params.get(key)),
         O.map((s) => s.trim()),
         O.filter((s) => s.length > 0),
         O.getWithDefault<string>('')
      );

   const getValidSort = (
      key: string,
      allowed: readonly SortOption[]
   ): SortOption | '' =>
      pipe(
         getCleanString(key) as SortOption,
         O.filter((v) => allowed.includes(v)),
         O.getWithDefault<SortOption | ''>('')
      );

   const getValidOrder = (
      key: string,
      allowed: readonly OrderOption[]
   ): OrderOption | '' =>
      pipe(
         getCleanString(key) as OrderOption,
         O.filter((v) => allowed.includes(v)),
         O.getWithDefault<OrderOption | ''>('')
      );

   const getNumber = (key: string, defaultValue: number, maxValue: number) =>
      pipe(
         getCleanString(key),
         O.map((v) => parseInt(v, 10)),
         O.filter((v) => v <= maxValue),
         O.getWithDefault<number>(defaultValue)
      );

   const result: Partial<TrackQueryT> = {};

   O.tap(getCleanString('search'), (v) => (result.search = v));
   O.tap(getCleanString('artist'), (v) => (result.artist = v));
   O.tap(getCleanString('genre'), (v) => (result.genre = v));
   O.tap(getNumber('page', 1, 5), (v) => (result.page = v));
   O.tap(getNumber('limit', 10, 50), (v) => (result.limit = v));

   const sortValue = getValidSort('sort', sortOptions);
   if (sortValue !== '') {
      result.sort = sortValue;
   }

   const orderValue = getValidOrder('order', orderOptions);
   if (orderValue !== '') {
      result.order = orderValue;
   }

   // Build back URL from the sanitized object
   const url = pipe(
      result,
      D.toPairs<string | number, string>, // split params object into array with tuples [[key,value],...]
      A.filter(([, value]) => O.isSome(O.fromNullable(value))), // filter nullish parameters
      A.filter(([, value]) => value !== ''), // filter empty strings
      A.filter(([, value]) => !Number.isNaN(value)), // filter NaN values
      (entries) => {
         const searchParams = new URLSearchParams();
         entries.forEach(([key, value]) => {
            searchParams.append(key, String(value));
         });
         return searchParams;
      }
   );

   return { params: result, paramsUrl: url };
}
