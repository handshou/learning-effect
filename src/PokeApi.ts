import { Context, Effect, type ParseResult } from "effect"
import type { ConfigError } from "effect/ConfigError"
import type { FetchError, JsonError } from "./errors"
import type { Pokemon } from "./schemas"

export interface PokeApi {
    readonly getPokemon: Effect.Effect<
        Pokemon,
        FetchError | JsonError | ParseResult.ParseError | ConfigError
    >
}

export const PokeApi = Context.GenericTag<PokeApi>("PokeApi")
