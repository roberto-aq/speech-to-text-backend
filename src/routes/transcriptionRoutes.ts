import { Router } from 'express';

import { TranscriptionController } from '../controllers/transcriptionController';

const router = Router();

// Importar e inicializar controlador
const transcriptionController = new TranscriptionController();

router.get('/', transcriptionController.getTranscriptions);

/**
 * 📌 Descargar transcripción
 */
router.get(
	'/download/:filename',
	transcriptionController.downloadTranscription
);

/**
 * 📌 Eliminar transcripción
 */
router.delete(
	'/delete/:filename',
	transcriptionController.deleteTranscription
);

export default router;
