import { Effect, Data, Schema, Config } from "effect"

const config = Config.string("BASE_URL")

class Pokemon extends Schema.Class<Pokemon>("Pokemon")({
  id: Schema.Number,
  order: Schema.Number,
  name: Schema.String,
  height: Schema.Number,
  weight: Schema.Number,
}) {}

class FetchError extends Data.TaggedError("fetchError")<Readonly<{}>>{}

class JsonError extends Data.TaggedError("jsonError")<Readonly<{}>>{}

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
