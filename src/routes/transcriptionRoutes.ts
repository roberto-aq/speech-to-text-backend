import { Router } from 'express';

import { TranscriptionController } from '../controllers/transcriptionController';

const router = Router();

// Importar e inicializar controlador
const transcriptionController = new TranscriptionController();

router.get(
	'/:userId',
	transcriptionController.getTranscriptionsByUserId
);
/**
 * 📌 Descargar transcripción
 */
router.get(
	'/download/:transcriptionId',
	transcriptionController.downloadTranscription
);
/**
 * 📌 Eliminar transcripción
 */
router.delete(
	'/:transcriptionId',
	transcriptionController.deleteTranscription
);

export default router;
