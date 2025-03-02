import { Router } from 'express';
import type { Request, Response } from 'express';
import { upload } from './middlewares/multer';
import path from 'path';
import fs from 'fs';
import { speechToText } from './config/assemblyai';
import { saveFile } from './utils/fileHandler';

const router = Router();

router.post(
	'/upload-audio',
	upload.single('audio'),
	async (req: Request, res: Response) => {
		const { file } = req;

		if (!file) {
			res.status(400).json('No se ha enviado ningún archivo');
			return;
		}

		try {
			// Guardar el archivo en el sistema de archivos
			const filePath = saveFile(file.originalname, file.buffer);

			// const transcribedText = await speechToText(filePath);

			res.status(200).json({
				message: 'Archivo recibido con éxito',
				filename: file.originalname,
				mimetype: file.mimetype,
				size: file.size,
				// data: transcribedText,
			});
		} catch (error) {
			console.log('Error procesando el audio: ', error);
			res.status(500).json({
				message: 'Oucrrió un error inesperado al procesar el archivo',
			});
		}
	}
);

export default router;
