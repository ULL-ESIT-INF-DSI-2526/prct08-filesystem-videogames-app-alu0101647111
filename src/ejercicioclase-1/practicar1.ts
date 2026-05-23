import fs from 'fs';
import path from 'node:path';

/**
 * Funcion para reorganizar en un directorio los ficheros según sus extensiones
 * @param dir_name - Nombre del directorio a organizar en subdirectorios por las extensiones de sus ficheros
 */
function dir_extension(dir_name: string): void {
  const fullpath = path.resolve(dir_name);

  if (!fs.existsSync(fullpath)) {
    throw new Error("El directorio indicado no existe");
  }

  if (!fs.statSync(fullpath).isDirectory()) {
    throw new Error("La ruta indicada no es un directorio");
  }

  const archivos = fs.readdirSync(fullpath);

  for (const archivo of archivos) {
    const ruta_completa = path.join(fullpath, archivo);
    const extension = path.extname(archivo).toLowerCase();
    
    const ruta_subdirectorio = path.join(fullpath, extension);
    
    if (!fs.existsSync(ruta_subdirectorio)) {
      fs.mkdirSync(ruta_subdirectorio, {recursive: true});
    }

    const ruta_final = path.join(ruta_subdirectorio, archivo);
    fs.renameSync(ruta_completa, ruta_final);
    console.log('Archivo ${archivo} movido');
  }

}

function main() {
  dir_extension("./prueba");
}

main();