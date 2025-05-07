# PokeRogue
### Rogue-like browser game made using react without any use of canvas, webgl or similar technologies.
### Live Site: [poke-rogue-gules.vercel.app](https://poke-rogue-gules.vercel.app/)

I wanted to see if I could make a web game soley using react routes and front-end code - how easy would this be to implement and what limitation and challenges would I run into in the process. 

This game is the result of that. It has a very simple design: you start with 1 pokemon and play 10 rounds, trying to win all of them. Each round you win you gain 1 of the pokemon you defeated as well as an upgrade from a random selection of 3 and all your pokemon gain 5 levels. If you lose a battle you have to start over. You can find minerals and held items to upgrade your pokemons stats and they evolve as you level them. Data for pokemon and moves is all pulled from [PokeAPI](https://pokeapi.co/).

## Basic Usage
1. Go to the [live site](https://poke-rogue-gules.vercel.app/).
2. Click play!

## Run Locally
1. Clone this repo.
2. Inside the cloned repo run `npm i` to install the dependencies, then run `npm run build` to build the app, and `npm run start` to run it.
3. Visit `localhost:3000` in you web browser to play the game.
