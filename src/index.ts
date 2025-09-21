import { Effect } from "effect"
import { PokeApi, PokeApiLive } from "./PokeApi"

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi
  return yield* pokeApi.getPokemon
})

const runnable = program.pipe(Effect.provideService(PokeApi, PokeApiLive))

const main = runnable.pipe(
  Effect.catchTags({
    fetchError: () => Effect.succeed("fetch error"),
    jsonError: () => Effect.succeed("json error"),
    ParseError: () => Effect.succeed("parse error"),
    ConfigError: () => Effect.succeed("config error"),
  })
)

Effect.runPromise(main).then(console.log)
