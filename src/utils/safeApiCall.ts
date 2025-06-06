import type { Result } from 'neverthrow';
import { ok, err } from 'neverthrow';
import type { ZodSchema } from 'zod';
import type { AxiosResponse } from 'axios';

export const safeApiCall = async <T>(
   apiCall: () => Promise<AxiosResponse>,
   schema?: ZodSchema<T>
): Promise<Result<T, string>> => {
   try {
      const response = await apiCall();

      if (schema) {
         const parse = schema.safeParse(response.data);
         if (!parse.success) {
            return err('Invalid response format');
         }
         return ok(parse.data);
      }

      return ok(response.data as T);
   } catch (error) {
      if (error instanceof Error) {
         return err(error.message);
      }
      return err('Unknown error');
   }
};
