import { Config, Schema, Context, Effect, type ParseResult } from "effect"
import type { ConfigError } from "effect/ConfigError"
import { FetchError, JsonError } from "./errors"
import { Pokemon } from "./schemas"

interface _PokeApi1 {
    readonly _: unique symbol
}

interface _PokeApi2 {
    readonly _: unique symbol
}

export interface PokeApi {
    readonly getPokemon: Effect.Effect<
        Pokemon,
        FetchError | JsonError | ParseResult.ParseError | ConfigError
    >
}

export const PokeApi = Context.GenericTag<_PokeApi1, PokeApi>("PokeApi1")

export const PokeApi2 = Context.GenericTag<_PokeApi2, PokeApi>("PokeApi2")

export const PokeApiLive = PokeApi.of({
    getPokemon: Effect.gen(function* () {
        const baseUrl = yield* Config.string("BASE_URL")
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
})

export const PokeApiTest = PokeApi.of({
    getPokemon: Effect.succeed({
        id: 1,
        height: 10,
        weight: 10,
        order: 1,
        name: "myname",
    }),
})
