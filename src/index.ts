import { Effect } from "effect"

interface FetchError {
  readonly _tag: 'fetchError'
}

interface JsonError {
  readonly _tag: 'jsonError'
}

const fetchRequest = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
  catch: (): FetchError => ({ _tag: "fetchError" }),
})

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: (): JsonError => ({ _tag: "jsonError" }),
})

const savePokemon = (pokemon: unknown) =>
  Effect.tryPromise(() =>
    fetch("/api/pokemon", { body: JSON.stringify(pokemon) })
  )

const main = fetchRequest.pipe(
  Effect.flatMap(jsonResponse),
  Effect.flatMap(savePokemon),
  Effect.catchTags({
    fetchError: () => Effect.succeed("fetch error"),
    jsonError: () => Effect.succeed("json error"),
    UnknownException: () => Effect.succeed("unknown error"),
  })
)

Effect.runPromise(main).then(console.log)
