import fs from 'fs'; // No se porque da error


import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GameCollection } from '../src/gestion.js';
import { Videogame, Plataforma, Genero } from '../src/type.js'; 



describe('GameCollection (Gestión del Sistema de Ficheros)', () => {
  const usuarioTest = 'usuario_vitest';
  const rutaTest = `./data/${usuarioTest}`;
  let coleccion: GameCollection;

  // Creamos un juego de prueba base para usar en todos los tests
  const juegoPrueba: Videogame = {
    id: 1,
    nombre: 'Hollow Knight',
    descripcion: 'Metroidvania épico',
    plataforma: Plataforma.PC,
    genero: Genero.Aventura,
    desarrolladora: 'Team Cherry',
    lanzamiento: 2017,
    multijugador: false,
    horas: 40,
    valor: 15
  };

  beforeEach(() => {
    // Inicializamos la colección
    coleccion = new GameCollection(usuarioTest);
    // Espiamos la consola para comprobar si se imprimen los mensajes
    vi.spyOn(console, 'log').mockImplementation(() => {}); 
  });

  afterEach(() => {
    // Limpiamos el disco duro borrando la carpeta del usuario de prueba
    if (fs.existsSync(rutaTest)) {
      fs.rmSync(rutaTest, { recursive: true, force: true });
    }
    // Restauramos la consola 
    vi.restoreAllMocks();
  });

  describe('Método addGame', () => {
    it('Debería añadir un juego nuevo y crear su archivo JSON', () => {
      coleccion.addGame(juegoPrueba);

      const rutaArchivo = `${rutaTest}/1.json`;
      expect(fs.existsSync(rutaArchivo)).toBe(true);

      // Verificamos que contenga la frase de éxito
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('New videogame added'));
    });

    it('Debería mostrar un error si el juego ya existe', () => {
      // Lo añadimos la primera vez
      coleccion.addGame(juegoPrueba);
      // Intentamos añadir el mismo de nuevo
      coleccion.addGame(juegoPrueba);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Videogame already exists'));
    });
  });

  describe('Método updateGame', () => {
    it('Debería actualizar un juego existente', () => {
      // Preparamos: añadimos el juego original
      coleccion.addGame(juegoPrueba);

      // Ejecutamos: creamos una versión modificada 
      const juegoModificado = { ...juegoPrueba, valor: 30 };
      coleccion.updateGame(juegoModificado);

      // Comprobamos el archivo
      const contenido = fs.readFileSync(`${rutaTest}/1.json`, 'utf-8');
      const juegoGuardado = JSON.parse(contenido);
      
      expect(juegoGuardado.valor).toBe(30);
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Videogame updated'));
    });

    it('Debería mostrar error al actualizar un juego que no existe', () => {
      coleccion.updateGame(juegoPrueba); // No lo hemos añadido previamente

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Videogame not found'));
    });
  });

  describe('Método removeGame', () => {
    it('Debería borrar el archivo de un juego existente', () => {
      coleccion.addGame(juegoPrueba);
      const rutaArchivo = `${rutaTest}/1.json`;
      
      // Asegurarnos de que se creó
      expect(fs.existsSync(rutaArchivo)).toBe(true);

      // Borramos
      coleccion.removeGame(1);

      // Comprobamos que ya no existe
      expect(fs.existsSync(rutaArchivo)).toBe(false);
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Videogame removed'));
    });

    it('Debería mostrar error al borrar un juego inexistente', () => {
      coleccion.removeGame(999);
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Videogame not found'));
    });
  });

  describe('Método readGame', () => {
    it('Debería leer y mostrar la información de un juego existente', () => {
      coleccion.addGame(juegoPrueba);
      coleccion.readGame(1);

      // Debería imprimir el nombre del juego en consola
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Name: Hollow Knight'));
    });

    it('Debería mostrar error al leer un juego que no existe', () => {
      coleccion.readGame(999);
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Videogame not found'));
    });
  });

  describe('Método listGames', () => {
    it('Debería mostrar mensaje de lista vacía si no hay juegos', () => {
      coleccion.listGames();
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No videogames found'));
    });

    it('Debería listar los juegos si existen', () => {
      coleccion.addGame(juegoPrueba);
      coleccion.listGames();

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`${usuarioTest} videogame collection`));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Name: Hollow Knight'));
    });
  });
});