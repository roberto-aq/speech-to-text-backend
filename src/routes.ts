import { Router } from 'express';
import filesRouter from './routes/fileRoutes';
import settingsRouter from './routes/settingsRoutes';
import transcriptionsRouter from './routes/transcriptionRoutes';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		router.use('/api/files', filesRouter);
		router.use('/api/settings', settingsRouter);
		router.use('/api/transcriptions', transcriptionsRouter);

		return router;
	}
}
