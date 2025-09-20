import { Data } from "effect"

export class FetchError extends Data.TaggedError("fetchError")<Readonly<{}>>{}
export class JsonError extends Data.TaggedError("jsonError")<Readonly<{}>>{}
