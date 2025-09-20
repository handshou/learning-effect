import { Effect, Schema, Config } from "effect"
import { FetchError, JsonError } from "./errors"
import { Pokemon } from "./schemas"

const config = Config.string("BASE_URL")

const getPokemon = Effect.gen(function* () {
  const baseUrl = yield* config
  const response = yield* Effect.tryPromise({
    try: () => fetch(`${baseUrl}/api/v2/pokemon/garchomp/`),
    catch: () => new FetchError(),
  })
  if (!response.ok) {
    return yield* new FetchError()
  }
  const json = yield* Effect.tryPromise({
    try: () => response.json(),
    catch: () => new JsonError(), 
  })

  return yield* Schema.decodeUnknown(Pokemon)(json)
})

const main = getPokemon.pipe(
  Effect.catchTags({
    fetchError: () => Effect.succeed("fetch error"),
    jsonError: () => Effect.succeed("json error"),
    ParseError: () => Effect.succeed("parse error"),
    ConfigError: () => Effect.succeed("config error"),
  })
)

Effect.runPromise(main).then(console.log)
