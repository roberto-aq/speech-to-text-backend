import type { Request, Response } from 'express';
import { apiKeyStore } from '../config/apiKeyStore';

export class SettingsController {
	constructor() {}

	public async getApiKey(req: Request, res: Response) {
		res.status(200).json({
			message: 'API Settings',
			apiKey: apiKeyStore.getApiKey(),
		});
	}

	public async updateApiKey(req: Request, res: Response) {
		const { newApiKey } = req.body;

		apiKeyStore.setApiKey(newApiKey);
		res.status(200).json({
			message:
				'✅ API Key actualizada correctamente. Y reemplazada en el .env',
		});
	}
}
