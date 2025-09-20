import { Effect } from "effect"

const fetchRequest = Effect.tryPromise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp/")
)

const jsonResponse = (response: Response) =>
  Effect.tryPromise(() => response.json())

const savePokemon = (pokemon: unknown) =>
  Effect.tryPromise(() =>
    fetch("/api/pokemon", { body: JSON.stringify(pokemon) })
  )

const main = Effect.flatMap(
  Effect.flatMap(fetchRequest, jsonResponse),
  savePokemon
)

Effect.runPromise(main).then(console.log)
