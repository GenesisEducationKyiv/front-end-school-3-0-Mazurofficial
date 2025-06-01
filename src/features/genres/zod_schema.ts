import z from 'zod';

export const genresSchema = z.array(z.string());
