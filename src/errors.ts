import { Data } from 'effect'

export class FetchError extends Data.TaggedError('fetchError')<
  Readonly<Record<string, never>>
> {}
export class JsonError extends Data.TaggedError('jsonError')<
  Readonly<Record<string, never>>
> {}
