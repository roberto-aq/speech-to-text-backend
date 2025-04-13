import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { supabase } from '../lib/supabase';
import { MapErrosSupabase } from '../utils/mapErrorsSupabase';

// Directorio de subida de archivos
const uploadsDir = path.join(process.cwd(), 'uploads');

const transcriptionsDir = path.join(process.cwd(), 'transcripciones');

export class TranscriptionController {
	/**
	 * @param req
	 * @param res
	 * @returns {Promise<void>}
	 * @description Este método obtiene una lista de transcripciones disponibles en el directorio de transcripciones.
	 */
	public async getTranscriptionsByUserId(
		req: Request,
		res: Response
	) {
		const userId = req.params.userId;

		if (!userId) {
			res
				.status(400)
				.json({ error: 'ID de usuario no proporcionado' });
			return;
		}

		try {
			const { data: transcriptions, error } = await supabase
				.from('transcripciones')
				.select('*')
				.eq('user_id', userId)
				.order('created_at', { ascending: false });

			if (error) {
				console.log('Error al obtener transcripciones:', error);
				const { status, message } = MapErrosSupabase(error);
				res.status(status).json({ error: message });
				return;
			}

			res.status(200).json(transcriptions);
			return;
		} catch (error) {
			console.error('Error servidor:', error);
			res.status(500).json({
				error: 'Error inesperado - Revisar logs',
			});
			return;
		}
	}

	/**
	 * @param req
	 * @param res
	 * @returns {Promise<void>}
	 * @description Este método descarga una transcripción específica.
	 */
	public async downloadTranscription(req: Request, res: Response) {
		const { transcriptionId } = req.params;
		const { userId } = req.query as { userId: string };

		const { data: transcription, error } = await supabase
			.from('transcripciones')
			.select('filename, user_id')
			.eq('id', transcriptionId)
			.single();

		if (error) {
			console.error('Error al obtener el archivo:', error);
			const { status, message } = MapErrosSupabase(error);
			res.status(status).json({ error: message });
			return;
		}
		const filePath = `${userId}/${transcription.filename}`;
		const { data: file } = supabase.storage
			.from('transcripciones')
			.getPublicUrl(filePath);

		if (!file) {
			res.status(404).json({ error: 'Archivo no encontrado' });
			return;
		}

		res.status(200).json({
			message: 'Archivo encontrado',
			url: file.publicUrl,
			filename: transcription.filename,
		});
	}

	public async deleteTranscription(req: Request, res: Response) {
		const { transcriptionId } = req.params;
		// const { userId } = req.query as { userId: string };

		try {
			// 1. Obtener la transcripción
			const { data: transcription, error: getError } = await supabase
				.from('transcripciones')
				.select('id, filename, user_id')
				.eq('id', transcriptionId)
				.single();

			if (getError || !transcription) {
				console.error('Error al obtener transcripción:', getError);
				const { status, message } = MapErrosSupabase(getError);
				res.status(status).json({ error: message });
				return;
			}

			const filePath = `${transcription.user_id}/${transcription.filename}`;

			// 2. Eliminar archivo del bucket
			const { error: storageError } = await supabase.storage
				.from('transcripciones')
				.remove([filePath]);

			if (storageError) {
				console.error('Error al eliminar archivo:', storageError);
				const { status, message } = MapErrosSupabase(storageError);
				res.status(status).json({ error: message });
				return;
			}

			// 3. Eliminar registro de la base de datos
			const { error: dbError } = await supabase
				.from('transcripciones')
				.delete()
				.eq('id', transcriptionId);

			if (dbError) {
				console.error('Error al eliminar transcripción:', dbError);
				const { status, message } = MapErrosSupabase(dbError);
				res.status(status).json({ error: message });
				return;
			}

			res.status(200).json({
				message: `✅ Transcripción con el nombre de: "${transcription.filename}" fue eliminada exitosamente`,
				transcriptionId: transcription.id,
			});
			return;
		} catch (error) {
			console.error('Error al eliminar transcripción:', error);
			res.status(500).json({
				error: 'Error inesperado al eliminar la transcripción',
			});
			return;
		}
	}
}
