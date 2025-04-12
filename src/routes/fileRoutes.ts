import { Router } from 'express';
import { upload } from '../middlewares/multer';
import { FileController } from '../controllers/fileController';

const router = Router();

// Importar e Inicializar el controlador
const fileController = new FileController();

router.post(
	'/upload-audio',
	upload.single('audio'),
	fileController.uploadAudio
);

export default router;
