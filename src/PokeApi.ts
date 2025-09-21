import { Schema, Context, Effect, Layer } from "effect"
import { FetchError, JsonError } from "./errors"
import { Pokemon } from "./schemas"
import { PokemonCollection } from "./PokemonCollection"
import { BuildPokeApiUrl } from "./BuildPokeApiUrl"

const make = {
    getPokemon: Effect.gen(function* () {
        const pokemonCollection = yield* PokemonCollection
        const buildPokeApiUrl = yield* BuildPokeApiUrl

        const requestUrl = buildPokeApiUrl({
            name: pokemonCollection[0],
        })

        const response = yield* Effect.tryPromise({
            try: () => fetch(requestUrl),
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
}

export class PokeApi extends Context.Tag("PokeApi")<PokeApi, typeof make>() {
    static readonly Live = Layer.succeed(this, make)
    static readonly Test = PokeApi.of({
        getPokemon: Effect.succeed({
            id: 1,
            height: 10,
            weight: 10,
            order: 1,
            name: "myname",
        }),
    })
}


