import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { GameCollection } from './gestion.js';
import { Plataforma, Videogame, Genero } from './type.js'; 

yargs(hideBin(process.argv))
  // 1. COMANDO ADD
  .command('add', 'Añadir un videojuego', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true },
    name: { type: 'string', demandOption: true },
    desc: { type: 'string', demandOption: true },
    platform: { type: 'string', demandOption: true },
    genre: { type: 'string', demandOption: true },
    developer: { type: 'string', demandOption: true },
    year: { type: 'number', demandOption: true },
    multiplayer: { type: 'boolean', demandOption: true },
    hours: { type: 'number', demandOption: true },
    value: { type: 'number', demandOption: true },
  }, (argv) => {
    const manager = new GameCollection(argv.user);
    manager.addGame({
      id: argv.id,
      nombre: argv.name,
      descripcion: argv.desc,
      plataforma: argv.platform as Plataforma,
      genero: argv.genre as Genero,
      desarrolladora: argv.developer,
      lanzamiento: argv.year,
      multijugador: argv.multiplayer,
      horas: argv.hours,
      valor: argv.value
    } as Videogame);
  })
  
  // 2. COMANDO UPDATE 
  .command('update', 'Modificar un videojuego', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true },
    name: { type: 'string', demandOption: true },
    desc: { type: 'string', demandOption: true },
    platform: { type: 'string', demandOption: true },
    genre: { type: 'string', demandOption: true },
    developer: { type: 'string', demandOption: true },
    year: { type: 'number', demandOption: true },
    multiplayer: { type: 'boolean', demandOption: true },
    hours: { type: 'number', demandOption: true },
    value: { type: 'number', demandOption: true },
  }, (argv) => {
    const manager = new GameCollection(argv.user);
    manager.updateGame({
      id: argv.id,
      nombre: argv.name,
      descripcion: argv.desc,
      plataforma: argv.platform as Plataforma,
      genero: argv.genre as Genero,
      desarrolladora: argv.developer,
      lanzamiento: argv.year,
      multijugador: argv.multiplayer,
      horas: argv.hours,
      valor: argv.value
    } as Videogame);
  })

  // 3. COMANDO LIST
  .command('list', 'Listar juegos de un usuario', {
    user: { type: 'string', demandOption: true }
  }, (argv) => {
    new GameCollection(argv.user).listGames();
  })

  // 4. COMANDO READ (Solo necesita usuario e ID)
  .command('read', 'Leer la información de un videojuego', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true }
  }, (argv) => {
    new GameCollection(argv.user).readGame(argv.id);
  })

  // 5. COMANDO REMOVE (Solo necesita usuario e ID)
  .command('remove', 'Eliminar un videojuego', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true }
  }, (argv) => {
    new GameCollection(argv.user).removeGame(argv.id);
  })

  .help()
  .parse();