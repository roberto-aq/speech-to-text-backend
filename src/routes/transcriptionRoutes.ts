import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import type { Request, Response } from 'express';

// Directorio de subida de archivos
const uploadsDir = path.join(process.cwd(), 'uploads');

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

/**
 * 📌 Eliminar transcripción
 */
router.delete(
	'/delete/:filename',
	async (req: Request, res: Response) => {
		try {
			const { filename } = req.params;

			// 🚨 Validar que el filename no contenga rutas maliciosas
			if (filename.includes('..') || path.isAbsolute(filename)) {
				res.status(400).json({ error: 'Nombre de archivo inválido' });
				return;
			}

			const filePath = path.join(transcriptionsDir, filename);
			const resolvedPath = path.resolve(filePath);

			// Validar que el archivo esté dentro del directorio permitido
			if (!resolvedPath.startsWith(path.resolve(transcriptionsDir))) {
				res.status(403).json({ error: 'Acceso no permitido' });
				return;
			}

			if (!fs.existsSync(resolvedPath)) {
				res.status(404).json({ error: 'Archivo no encontrado' });
				return;
			}

			fs.unlinkSync(resolvedPath);

			// 🔊 Eliminar audios relacionados en "uploads/"
			const baseName = path.parse(filename).name;
			const audioFiles = fs.readdirSync(uploadsDir);
			const deletedAudios: string[] = [];

			audioFiles.forEach(file => {
				const nameWithoutExt = path.parse(file).name;
				if (nameWithoutExt === baseName) {
					const audioPath = path.join(uploadsDir, file);
					fs.unlinkSync(audioPath);
					deletedAudios.push(file);
				}
			});

			res.status(200).json({
				message: `✅ Transcripción "${filename}" eliminada.`,
				audioDeleted: deletedAudios.length > 0,
				deletedAudios,
			});
		} catch (error) {
			console.error('❌ Error al eliminar el archivo:', error);
			res.status(500).json({ error: 'Error al eliminar el archivo' });
		}
	}
);

export default router;
