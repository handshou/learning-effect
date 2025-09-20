import { Effect, Data, Schema } from "effect"

const Pokemon = Schema.Struct({
  id: Schema.Number,
  order: Schema.Number,
  name: Schema.String,
  height: Schema.Number,
  weight: Schema.Number,
})

const decodePokemon = Schema.decodeUnknown(Pokemon)

class FetchError extends Data.TaggedError("fetchError")<Readonly<{}>>{}

class JsonError extends Data.TaggedError("jsonError")<Readonly<{}>>{}

const fetchRequest = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
  catch: () => new FetchError(),
})

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: () => new JsonError(), 
})

const program = Effect.gen(function* () {
   const response = yield* fetchRequest 
   if (!response.ok) {
     yield* new FetchError()
   }
   return yield* jsonResponse(response)
})

const main = program.pipe(
  Effect.catchTags({
    fetchError: () => Effect.log("fetch error"),
    jsonError: () => Effect.log("json error"),
  })
)

Effect.runPromise(main).then(console.log)
