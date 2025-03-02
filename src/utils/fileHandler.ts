import fs from 'fs';
import path from 'path';

/**
 * Guarda un archivo en el sistema de archivos y crea la carpeta si no existe.
 * @param filename - Nombre del archivo
 * @param buffer - Contenido del archivo como Buffer
 * @returns {string} - Ruta donde se guardó el archivo
 */
export const saveFile = (
	filename: string,
	buffer: Buffer
): string => {
	const uploadsDir = path.join(process.cwd(), 'uploads');

	// Verificar si la carpeta 'uploads' existe, si no, crearla
	if (!fs.existsSync(uploadsDir)) {
		fs.mkdirSync(uploadsDir, { recursive: true });
		console.log("📂 Carpeta 'uploads' creada.");
	}

	// Ruta completa del archivo
	const filePath = path.join(uploadsDir, filename);

	// Guardar el archivo en disco
	fs.writeFileSync(filePath, buffer);
	console.log('✅ Archivo guardado en:', filePath);

	return filePath;
};
