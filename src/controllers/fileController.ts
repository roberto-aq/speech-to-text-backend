import type { Request, Response } from 'express';
import { saveFile } from '../utils/fileHandler';
import { speechToText } from '../config/assemblyai';

export class FileController {
	public async uploadAudio(req: Request, res: Response) {
		const { file } = req;

		if (!file) {
			res.status(400).json('No se ha enviado ningún archivo');
			return;
		}

		try {
			// Guardar el archivo en el sistema de archivos
			const filePath = saveFile(file.originalname, file.buffer);

			const transcribedText = await speechToText(filePath);

			res.status(200).json({
				message: 'Archivo recibido con éxito',
				filename: file.originalname,
				mimetype: file.mimetype,
				size: file.size,
				data: transcribedText,
			});
		} catch (error: any) {
			if (error.includes('unauthorized')) {
				res.status(401).json({
					message:
						'La API Key de AssemblyAI no es válida, por favor actualízala',
				});
				return;
			}
			res.status(500).json({
				message: 'Oucrrió un error inesperado al procesar el archivo',
			});
			throw error;
		}
	}
}
