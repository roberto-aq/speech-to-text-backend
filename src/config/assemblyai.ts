import fs from 'fs';
import path from 'path';
import { AssemblyAI } from 'assemblyai';

import { apiKeyStore } from './apiKeyStore';

export const getAssemblyClient = (): AssemblyAI => {
	const apiKey = apiKeyStore.getApiKey();

	if (!apiKey) {
		throw new Error('❌ API Key de AssemblyAI no configurada.');
	}

	return new AssemblyAI({ apiKey });
};

/**
 * Transcribe un archivo de audio utilizando AssemblyAI y guarda la transcripción en un archivo.
 * @param filePath - Ruta del archivo de audio
 * @returns {Promise<string>} - Texto transcrito
 */
export const speechToText = async (
	audioPath: string
): Promise<string> => {
	const client = getAssemblyClient();

	try {
		// Leer el archivo de audio como un buffer
		const audioBuffer = fs.readFileSync(audioPath);

		// Transcribir el audio
		const transcript = await client.transcripts.transcribe({
			audio: audioBuffer,
			language_code: 'es',
		});

		// Definir la ruta de la carpeta y el archivo
		const folderPath = path.join(process.cwd(), 'transcripciones');
		const filePath = path.join(folderPath, 'transcripcion.txt');

		// Crear la carpeta si no existe
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true });
		}

		// Guardar la transcripción en el archivo
		fs.writeFileSync(filePath, transcript.text);

		console.log('Transcripción guardada en:', filePath);
		return transcript.text;
	} catch (error) {
		console.error('Error al transcribir el audio:', error);
		throw new Error('Error al transcribir el audio');
	}
};
