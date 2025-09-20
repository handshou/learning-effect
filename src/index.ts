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

const savePokemon = (pokemon: unknown) =>
  Effect.tryPromise(() =>
    fetch("/api/pokemon", { body: JSON.stringify(pokemon) })
  )

const main = fetchRequest.pipe(
  Effect.filterOrFail(
    (response) => response.ok,
    () => new FetchError(),
  ),
  Effect.flatMap(jsonResponse),
  Effect.flatMap(savePokemon),
  Effect.catchTags({
    fetchError: () => Effect.succeed("fetch error"),
    jsonError: () => Effect.succeed("json error"),
    UnknownException: () => Effect.succeed("unknown error"),
  })
)

Effect.runPromise(main).then(console.log)
