import fs from 'fs';
import chalk from 'chalk';
export class GameCollection {
    user;
    path;
    constructor(user) {
        this.user = user;
        this.path = `./data/${user}`;
        // Si la carpeta del usuario no existe, la crea
        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path, { recursive: true });
        }
    }
    // Método auxiliar para obtener la ruta exacta del fichero JSON
    getFilePath(id) {
        return `${this.path}/${id}.json`;
    }
    // Lógica para aplicar Chalk según el valor de mercado del juego
    formatValue(value) {
        if (value < 20)
            return chalk.red(value.toString());
        if (value < 40)
            return chalk.yellow(value.toString());
        if (value < 60)
            return chalk.blue(value.toString());
        return chalk.green(value.toString());
    }
    addGame(game) {
        const filePath = this.getFilePath(game.id);
        if (fs.existsSync(filePath)) {
            console.log(chalk.red(`Videogame already exists at ${this.user} collection!`));
        }
        else {
            fs.writeFileSync(filePath, JSON.stringify(game, null, 2));
            console.log(chalk.green(`New videogame added to ${this.user} collection!`));
        }
    }
    listGames() {
        const files = fs.readdirSync(this.path);
        if (files.length === 0) {
            console.log(chalk.red(`No videogames found at ${this.user} collection.`));
            return;
        }
        console.log(`${this.user} videogame collection`);
        files.forEach(file => {
            const data = fs.readFileSync(`${this.path}/${file}`, 'utf8');
            const game = JSON.parse(data);
            this.printGame(game);
        });
    }
    // Muestra un juego concreto por pantalla aplicando el color 
    printGame(game) {
        console.log("--------------------------------");
        console.log(`ID: ${game.id}`);
        console.log(`Name: ${game.nombre}`);
        console.log(`Description: ${game.descripcion}`);
        console.log(`Platform: ${game.plataforma}`);
        console.log(`Genre: ${game.genero}`);
        console.log(`Developer: ${game.desarrolladora}`);
        console.log(`Year: ${game.lanzamiento}`);
        console.log(`Multiplayer: ${game.multijugador}`);
        console.log(`Estimated hours: ${game.horas}`);
        console.log(`Market value: ${this.formatValue(game.valor)}`);
    }
    // Modifica un videojuego existente
    updateGame(game) {
        const filePath = this.getFilePath(game.id);
        if (fs.existsSync(filePath)) {
            // Sobrescribimos el archivo con la nueva información
            fs.writeFileSync(filePath, JSON.stringify(game, null, 2));
            console.log(chalk.green(`Videogame updated at ${this.user} collection!`));
        }
        else {
            console.log(chalk.red(`Videogame not found at ${this.user} collection!`));
        }
    }
    // Elimina un videojuego de la colección
    removeGame(id) {
        const filePath = this.getFilePath(id);
        if (fs.existsSync(filePath)) {
            // fs.unlinkSync borra el archivo del sistema
            fs.unlinkSync(filePath);
            console.log(chalk.green(`Videogame removed from ${this.user} collection!`));
        }
        else {
            console.log(chalk.red(`Videogame not found at ${this.user} collection!`));
        }
    }
    // Lee y muestra la información de un videojuego concreto
    readGame(id) {
        const filePath = this.getFilePath(id);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const game = JSON.parse(data);
            this.printGame(game);
        }
        else {
            console.log(chalk.red(`Videogame not found at ${this.user} collection!`));
        }
    }
}
//# sourceMappingURL=gestion.js.map