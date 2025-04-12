import fs from 'fs';
import path from 'path';
import { AssemblyAI } from 'assemblyai';

import { apiKeyStore } from './apiKeyStore';
import {
	AlignmentType,
	Document,
	Packer,
	Paragraph,
	TextRun,
} from 'docx';

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
		// Crear la carpeta si no existe
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true });
		}

		// 📝 Definir el nombre del archivo (mismo nombre del audio)
		const filename = path.basename(
			audioPath,
			path.extname(audioPath)
		);
		const docxPath = path.join(folderPath, `${filename}.docx`);

		// ✍️ Crear el documento de Word con la transcripción
		const doc = new Document({
			sections: [
				{
					children: [
						new Paragraph({
							children: [
								new TextRun({
									text: 'Transcripción',
									bold: true,
									size: 32,
									font: 'Arial',
								}),
							],
							alignment: AlignmentType.CENTER,
							spacing: {
								after: 200,
							},
						}),
						// Transcripción
						new Paragraph({
							children: [
								new TextRun({
									text: transcript.text ?? '',
									size: 24,
									font: 'Arial',
								}),
							],
							alignment: AlignmentType.JUSTIFIED,
							spacing: {
								after: 200,
							},
						}),
					],
				},
			],
		});

		// Guardar el archivo .docx
		const buffer = await Packer.toBuffer(doc);
		fs.writeFileSync(docxPath, buffer);

		console.log('✅ Transcripción guardada en:', docxPath);
		return transcript.text ?? '';
	} catch (error: any) {
		console.log(error);
		throw error.message;
	}
};
