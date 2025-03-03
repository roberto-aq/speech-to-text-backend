import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import type { Request, Response } from 'express';

const router = Router();
const transcriptionsDir = path.join(process.cwd(), 'transcripciones');

// 📌 Listar transcripciones disponibles
router.get('/', async (req: Request, res: Response) => {
	try {
		if (!fs.existsSync(transcriptionsDir)) {
			res.status(200).json({
				message: 'No hay transcripciones disponibles.',
				data: [],
			});

			return;
		}

		const files = fs
			.readdirSync(transcriptionsDir)
			.filter(file => file.endsWith('.docx'))
			.map(file => ({
				filename: file,
				createdAt: fs.statSync(path.join(transcriptionsDir, file))
					.birthtime,
			}))
			.sort((a, b) => +b.createdAt - +a.createdAt);

		res.status(200).json({
			message: '✅ Transcripciones disponibles',
			data: files,
		});
	} catch (error) {
		console.error('❌ Error obteniendo transcripciones:', error);
		res
			.status(500)
			.json({ error: 'Error al obtener las transcripciones' });
	}
});

/**
 * 📌 Descargar transcripción
 */
router.get(
	'/download/:filename',
	async (req: Request, res: Response) => {
		const { filename } = req.params;
		const filePath = path.join(transcriptionsDir, filename);

		if (!fs.existsSync(filePath)) {
			res.status(404).json({ error: 'Archivo no encontrado' });
		}

		res.download(filePath, filename, err => {
			if (err) {
				console.error('❌ Error al descargar el archivo:', err);
				res
					.status(500)
					.json({ error: 'Error al descargar el archivo' });
			}
		});
	}
);

export default router;
