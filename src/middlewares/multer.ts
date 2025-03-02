import multer from 'multer';
import type { Request } from 'express';

// Configuración de multer para almacenamiento en memoria
const storage = multer.memoryStorage();

const fileFilter = (
	req: Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback
) => {
	if (file.mimetype.startsWith('audio/')) {
		cb(null, true);
	} else {
		cb(new Error('Solo archivos de audio son permitidos'));
	}
};

// Middleware de multer
export const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // Limita a 10MB
	fileFilter,
});
