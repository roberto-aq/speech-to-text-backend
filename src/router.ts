import { Router } from 'express';
import type { Request, Response } from 'express';
import upload from './config/multer';

const router = Router();

router.post(
	'/audio',
	upload.single('audio'),
	(req: Request, res: Response) => {
		const { file } = req;

		if (!file) {
			res.status(400).json('No se ha enviado ningún archivo');
			return;
		}

		res.status(200).json({
			message: 'Archivo recibido con éxito',
			filename: req.file.originalname,
			mimetype: req.file.mimetype,
			size: req.file.size,
		});
	}
);

export default router;
