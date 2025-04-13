import type { Request, Response } from 'express';
import { speechToText } from '../config/assemblyai';
import { supabase } from '../lib/supabase';
import { MapErrosSupabase } from '../utils/mapErrorsSupabase';

export class FileController {
	public async uploadAudio(req: Request, res: Response) {
		const { file } = req;
		const userId = req.body.user_id;

		if (!file || !userId) {
			res
				.status(400)
				.json({ message: 'Faltan datos requeridos: file | user_id' });

			return;
		}

		try {
			const { text, buffer, filename, duration_seconds } =
				await speechToText(file.buffer, file.originalname);

			// 📦 Subir a Supabase Storage
			const storagePath = `${userId}/${filename}`;
			const { error: uploadError } = await supabase.storage
				.from('transcripciones')
				.upload(storagePath, buffer, {
					contentType:
						'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					upsert: true,
				});

			if (uploadError) {
				console.error('Error al subir el archivo:', uploadError);
				const { status, message } = MapErrosSupabase(uploadError);
				res.status(status).json({ message });
				return;
			}

			const { data: transcripcion, error: insertError } =
				await supabase
					.from('transcripciones')
					.insert({
						user_id: userId,
						filename,
						storage_path: storagePath,
						duration_seconds,
						language: 'es',
					})
					.select('*')
					.single();

			if (insertError) {
				console.error(
					'Error al insertar la transcripción:',
					insertError
				);
				const { status, message } = MapErrosSupabase(insertError);
				res.status(status).json({ message });
				return;
			}

			res.status(201).json({
				message: '✅ Transcripción exitosa',
				data: transcripcion,
			});

			return;
		} catch (error: any) {
			console.error(error);

			const message =
				typeof error === 'string'
					? error
					: error?.message || 'Error inesperado';

			if (message.includes('unauthorized')) {
				res.status(401).json({
					message:
						'La API Key de AssemblyAI no es válida, por favor actualízala',
				});
				return;
			}

			res.status(500).json({
				message: message,
			});
		}
	}
}
