import { Effect } from "effect"

export class PokemonCollection extends Effect.Service<PokemonCollection>()(
    "PokemonCollection",
    {
        succeed: ["Pikachu", "Charmander"]
    }
) {}
