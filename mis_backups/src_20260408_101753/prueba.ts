import * as fs from 'node:fs';
import * as path from 'node:path';

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function getTimestamp(): string {
const now = new Date();
const pad = (n: number) => n.toString().padStart(2, '0');

const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

return `${date}_${time}`;
}

function getDirectorySize(dirPath: string): number {
let size = 0;
const files = fs.readdirSync(dirPath);

for (const file of files) {
const fullPath = path.join(dirPath, file);
const stats = fs.statSync(fullPath);

if (stats.isDirectory()) {
size += getDirectorySize(fullPath);
} else {
size += stats.size;
}
}
return size;
}

function countFiles(dirPath: string): number {
let count = 0;
const files = fs.readdirSync(dirPath);

for (const file of files) {
const fullPath = path.join(dirPath, file);
const stats = fs.statSync(fullPath);

if (stats.isDirectory()) {
count += countFiles(fullPath);
} else {
count++;
}
}
return count;
}

// ==========================================
// FUNCIONES PRINCIPALES
// ==========================================

function createBackup(sourceDir: string, destDir: string): void {
const absoluteSource = path.resolve(sourceDir);
const absoluteDest = path.resolve(destDir);

if (!fs.existsSync(absoluteSource)) {
throw new Error(`Error: El directorio origen '${absoluteSource}' no existe.`);
}
if (!fs.statSync(absoluteSource).isDirectory()) {
throw new Error(`Error: La ruta origen '${absoluteSource}' no es un directorio.`);
}

if (!fs.existsSync(absoluteDest)) {
fs.mkdirSync(absoluteDest, { recursive: true });
}

const folderName = path.basename(absoluteSource);
const backupName = `${folderName}_${getTimestamp()}`;
const backupPath = path.join(absoluteDest, backupName);

fs.cpSync(absoluteSource, backupPath, { recursive: true });
console.log(`Copia de seguridad creada en: ${backupPath}`);
}

function listBackups(destDir: string): void {
const absoluteDest = path.resolve(destDir);

if (!fs.existsSync(absoluteDest)) {
console.log(`El directorio '${absoluteDest}' no existe o está vacío.`);
return;
}

const elements = fs.readdirSync(absoluteDest);
const backups = [];

for (const element of elements) {
const fullPath = path.join(absoluteDest, element);
const stats = fs.statSync(fullPath);

if (stats.isDirectory()) {
backups.push({
name: element,
size: getDirectorySize(fullPath),
date: stats.birthtime
});
}
}

if (backups.length === 0) {
console.log("No hay copias de seguridad disponibles.");
return;
}

backups.sort((a, b) => b.date.getTime() - a.date.getTime());

console.log(`Copias de seguridad en '${absoluteDest}':`);
backups.forEach((b, index) => {
const sizeMB = (b.size / (1024 * 1024)).toFixed(2);
console.log(`${index + 1}. ${b.name} | Tamaño: ${sizeMB} MB | Fecha: ${b.date.toLocaleString()}`);
});
}

function restoreBackup(backupPath: string, targetDir: string): void {
const absoluteBackup = path.resolve(backupPath);
const absoluteTarget = path.resolve(targetDir);

if (!fs.existsSync(absoluteBackup)) {
throw new Error(`Error: La copia de seguridad '${absoluteBackup}' no existe.`);
}

if (fs.existsSync(absoluteTarget)) {
if (fs.readdirSync(absoluteTarget).length > 0) {
throw new Error(`Error: El directorio destino '${absoluteTarget}' no está vacío.`);
}
} else {
fs.mkdirSync(absoluteTarget, { recursive: true });
}

fs.cpSync(absoluteBackup, absoluteTarget, { recursive: true });

const numFiles = countFiles(absoluteTarget);
console.log(`Restauración completada. Ficheros restaurados: ${numFiles}`);
}

// ==========================================
// EJECUCIÓN PRINCIPAL (MAIN)
// ==========================================


function main() {
try {
// 1. Definimos las rutas (puedes cambiarlas para probar)
const rutaOrigen = './src';
const rutaDestinoBackups = './mis_backups';
const rutaRestauracion = './restaurado';

console.log("--- 1. CREANDO COPIA DE SEGURIDAD ---");
createBackup(rutaOrigen, rutaDestinoBackups);

console.log("\n--- 2. LISTANDO COPIAS DISPONIBLES ---");
listBackups(rutaDestinoBackups);

// Para probar la restauración de forma automática, leemos la carpeta que acabamos de crear:
console.log("\n--- 3. RESTAURANDO LA COPIA MÁS RECIENTE ---");
const copiasDisponibles = fs.readdirSync(rutaDestinoBackups);
if (copiasDisponibles.length > 0) {
// Tomamos la primera carpeta que encontremos
const rutaCopiaARestaurar = path.join(rutaDestinoBackups, copiasDisponibles[0]);
restoreBackup(rutaCopiaARestaurar, rutaRestauracion);
}

} catch (error: unknown) {
if (error instanceof Error) {
console.error(error.message);
} else {
console.error("Ha ocurrido un error desconocido.");
}
}
}

// Llamamos a la función main para ejecutar el código
main();