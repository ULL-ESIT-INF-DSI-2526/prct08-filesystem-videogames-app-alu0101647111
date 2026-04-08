import { Videogame } from './type.js';
export declare class GameCollection {
    private user;
    private path;
    constructor(user: string);
    private getFilePath;
    private formatValue;
    addGame(game: Videogame): void;
    listGames(): void;
    printGame(game: Videogame): void;
    updateGame(game: Videogame): void;
    removeGame(id: number): void;
    readGame(id: number): void;
}
