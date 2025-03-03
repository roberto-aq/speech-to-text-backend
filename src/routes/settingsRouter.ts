import { Router } from 'express';
import type { Request, Response } from 'express';
import 'dotenv/config';
import { apiKeyStore } from '../config/apiKeyStore';
import { body } from 'express-validator';
import { handleInputErrors } from '../middlewares/validation';

const router = Router();

router.get('/api-key', async (req: Request, res: Response) => {
	res.status(200).json({
		message: 'API Settings',
		apiKey: apiKeyStore.getApiKey(),
	});
});

router.post(
	'/update-api-key',
	body('newApiKey')
		.isString()
		.isLength({ min: 1 })
		.withMessage('❌ Debes proporcionar una nueva API Key'),
	handleInputErrors,
	(req: Request, res: Response) => {
		const { newApiKey } = req.body;

		apiKeyStore.setApiKey(newApiKey);
		res.status(200).json({
			message:
				'✅ API Key actualizada correctamente. Y reemplazada en el .env',
		});
	}
);

export default router;
