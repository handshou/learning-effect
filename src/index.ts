import { Effect, Layer } from "effect"
import { PokeApi } from "./PokeApi"
import { PokemonCollection } from "./PokemonCollection"
import { BuildPokeApiUrl } from "./BuildPokeApiUrl"
import { PokeApiUrl } from "./PokeApiUrl"

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi
  return yield* pokeApi.getPokemon
})

const MainLayer = Layer.mergeAll(
  PokeApi.Live,
  PokemonCollection.Live,
  BuildPokeApiUrl.Live.pipe(Layer.provide(PokeApiUrl.Live)),
  PokeApiUrl.Live,
)

const runnable = program.pipe(Effect.provide(MainLayer))

const main = runnable.pipe(
  Effect.catchTags({
    fetchError: () => Effect.succeed("fetch error"),
    jsonError: () => Effect.succeed("json error"),
    ParseError: () => Effect.succeed("parse error"),
    ConfigError: () => Effect.succeed("config error"),
  })
)

Effect.runPromise(main).then(console.log)
