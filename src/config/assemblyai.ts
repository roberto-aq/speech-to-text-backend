import fs from 'fs';
import { AssemblyAI } from 'assemblyai';

import { apiKeyStore } from './apiKeyStore';
import {
	AlignmentType,
	Document,
	Packer,
	Paragraph,
	TextRun,
} from 'docx';

interface TranscriptionResult {
	text: string;
	buffer: Buffer;
	filename: string;
	duration_seconds: number | null;
}

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
	audioBuffer: Buffer,
	originalFileName: string
): Promise<TranscriptionResult> => {
	const client = getAssemblyClient();

	try {
		// Transcribir el audio
		const transcript = await client.transcripts.transcribe({
			audio: audioBuffer,
			language_code: 'es',
		});

		const baseName = originalFileName.replace(/\.[^/.]+$/, ''); // elimina extensión
		const text = transcript.text ?? '';
		const duration_seconds = transcript.audio_duration ?? null;
		const filename = `${baseName}-${Date.now()}.docx`;

		// 📝 Crear el documento de Word
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
							spacing: { after: 200 },
						}),
						new Paragraph({
							children: [
								new TextRun({
									text,
									size: 24,
									font: 'Arial',
								}),
							],
							alignment: AlignmentType.JUSTIFIED,
							spacing: { after: 200 },
						}),
					],
				},
			],
		});

		const buffer = await Packer.toBuffer(doc);

		return {
			text,
			buffer,
			filename,
			duration_seconds,
		};
	} catch (error: any) {
		console.log(error);
		throw error.message;
	}
};
