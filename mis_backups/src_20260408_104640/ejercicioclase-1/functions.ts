import fs from 'fs';
import path from 'node:path';


// PARA LA PRIMERA FUNCIÓN
/**
 * Funcion para obtener el sufijo que pondremos despues del nombre del directorio al hacer una copia de seguridad
 * @returns 
 */
function getTime(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  return `${date}_${time}`;
}

/**
 * Función que realiza la copia de seguridad de un directorio en un destino indicado
 * @param dirPath -
 * @param destino -
 */
function copiaSeguridad(dirPath: string, destino: string) {
  const fullpathdir = path.resolve(dirPath);
  const fullpathdest = path.resolve(destino);

  if (!fs.existsSync(fullpathdir)) {
    throw new Error("El directorio indicado no existe");
  }
  if (!fs.statSync(fullpathdir).isDirectory) {
    throw new Error("La ruta de origen no es un directorio");
  }

  const folderName = path.basename(fullpathdir);
  const backupName = `${folderName}_${getTime()}`;
  const backupPath = path.join(fullpathdest, backupName);
  
  fs.cpSync(fullpathdir, backupPath, { recursive: true });
  console.log(`Copia de seguridad creada en: ${backupPath}`);
}

// PARA LA SEGUNDA FUNCION
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

/**
 * Funcion para listar las copias de seguridad que hay en un directorio indicado
 * @param destDir - Directorio donde se encuentrasn las copias
 * @returns -
 */
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
    const size = b.size;
    console.log(`${index + 1}. ${b.name} | Tamaño: ${size}  | Fecha: ${b.date.toLocaleString()}`);
  });
}

/**
 * Funcion Auxiliar para contar cuantos ficheros hay en un directorio
 * @param dirPath - Ruta del directorio a contar
 * @returns Número de archivos en el directorio
 */
function countFiles(dirPath: string): number {
  let count = 0;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      count += countFiles(fullPath); 
    } else {
      count += 1; 
    }
  }
  return count;
}

/**
 * Función que restaura una copia de seguridad a un directorio indicado
 * @param copiaPath - Ruta de la copia de seguridad a restaurar
 * @param dirPath - Ruta del directorio donde se restaurará la copia de seguridad
 */
function restaurarConBackups(copiaPath: string, dirPath: string) {
  const fullpathdir = path.resolve(dirPath);
  const fullpathcopia = path.resolve(copiaPath);

  if (!fs.existsSync(fullpathcopia)) {
    throw new Error(`Error: La copia de seguridad '${fullpathcopia}' no existe.`);
  }

  if (!fs.existsSync(fullpathdir)) {
    fs.mkdirSync(fullpathdir, { recursive: true});
  }

  fs.cpSync(copiaPath, fullpathdir, { recursive: true });
  // Poner cuantos ficheros se restauran
  const numFiles = countFiles(fullpathdir);
  console.log(`Restauración completada. Ficheros restaurados: ${numFiles}`);
}


/**
 * Funcion principal para probar las 3 funciones
 */
function main() {
  const rutaOrigen = './src'
  const rutaDestinoBackups = './mis_backups';
  console.log("--- 1. CREANDO COPIA DE SEGURIDAD ---");
  copiaSeguridad(rutaOrigen, rutaDestinoBackups);

  console.log("--- 2. LISTANDO LAS COPIAS DE SEGURIDAD ---");
  listBackups(rutaDestinoBackups);

  console.log("--- 3. RESTAURANDO UNA COPIA DE SEGURIDAD ---");
  const copiaSeleccionada = path.join(rutaDestinoBackups, fs.readdirSync(rutaDestinoBackups)[8]);
  const rutaRestauracion = './restauracion';
  restaurarConBackups(copiaSeleccionada, rutaRestauracion);
}

main();