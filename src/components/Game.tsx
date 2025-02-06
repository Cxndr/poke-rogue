"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pokemon, PokemonClient } from "pokenode-ts";
const api = new PokemonClient();

export default function Game() {

  const [selectedMon, setSelectedMon] = useState(false);

  const [options, setOptions] = useState<Pokemon[]>([]);



  useEffect(() => {
    async function setChoice() {
      const option1 = await api.getPokemonByName("bulbasaur")
        .catch((err: Error) => { console.log(err);})
      const option2 = await api.getPokemonByName("squirtle")
        .catch((err: Error) => { console.log(err);})
      const option3 = await api.getPokemonByName("charmander")
        .catch((err: Error) => { console.log(err);})
      setOptions([option1, option2, option3].filter((option): option is Pokemon => option !== undefined));
    }
    setChoice();
  }, []);


  const selectMonClick = () => {
    setSelectedMon(true);
  }

    return (
        <div className="h-full flex items-center justify-center">
          
          {!selectedMon && (
            <div>
              <h1>Select your starting Pokemon</h1>
              <div className="flex flex-row gap-4">
              {options.map((option) => (
                <div key={option.id} className="flex flex-col items-center justify-center">
                  <Image src={option.sprites.front_default ?? ""} alt={option.name} width={96} height={96} />
                  <p>{option.name}</p>
                  <button onClick={() => selectMonClick()}>Select</button>
                </div>
              ))}
              </div>
            </div>
          )}

        </div>
    )
}