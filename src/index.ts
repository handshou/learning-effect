import { Effect, Data } from "effect"

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

const main = Effect.gen(function* () {
   const response = yield* fetchRequest 
   if (!response.ok) {
     yield* new FetchError()
   }
   return yield* jsonResponse(response)
})

Effect.runPromise(main).then(console.log)
