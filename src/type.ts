export enum Plataforma {
  PC = "PC",
  PS5 = "PlayStation 5",
  Xbox = "Xbox Series X/S",
  Switch = "Nintendo Switch",
  SteamDeck = "Steam Deck"
}

export enum Genero {
  Accion = "Acción",
  Aventura = "Aventura",
  Rol = "Rol",
  Estrategia = "Estrategia",
  Deportes = "Deportes",
  Simulacion = "Simulación"
}

export interface Videogame {
  id: number;
  nombre: string;
  descripcion: string;
  plataforma: Plataforma;
  genero: Genero;
  desarrolladora: string;
  lanzamiento: number;
  multijugador: boolean;
  horas: number;
  valor: number;
}