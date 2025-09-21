import { Effect, Layer, ManagedRuntime } from 'effect'
import { PokeApi } from './PokeApi'

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi
  return yield* pokeApi.getPokemon
})

const MainLayer = Layer.mergeAll(PokeApi.Default)

const PokemonRuntime = ManagedRuntime.make(MainLayer)

const main = program.pipe(
  Effect.catchTags({
    fetchError: () => Effect.succeed('fetch error'),
    jsonError: () => Effect.succeed('json error'),
    ParseError: () => Effect.succeed('parse error'),
  }),
)

PokemonRuntime.runPromise(main).then(console.log)
