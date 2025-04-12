import { Router } from 'express';

import { body } from 'express-validator';
import { handleInputErrors } from '../middlewares/validation';
import { SettingsController } from '../controllers/settingsController';

const router = Router();

// Importar e Inicializar el controlador
const settingsController = new SettingsController();

// * RUTAS
router.get('/api-key', settingsController.getApiKey);
router.post(
	'/update-api-key',
	body('newApiKey')
		.isString()
		.isLength({ min: 1 })
		.withMessage('❌ Debes proporcionar una nueva API Key'),
	handleInputErrors,
	settingsController.updateApiKey
);

export default router;
