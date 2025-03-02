import { AssemblyAI } from 'assemblyai';
import fs from 'fs';
import path from 'path';

const client = new AssemblyAI({
	apiKey: 'ea448d67c74142998eb196e556de3ea0',
});

/**
 * Transcribe un archivo de audio utilizando AssemblyAI y guarda la transcripción en un archivo.
 * @param filePath - Ruta del archivo de audio
 * @returns {Promise<string>} - Texto transcrito
 */
export const speechToText = async (
	audioPath: string
): Promise<string> => {
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
