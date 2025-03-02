import multer from "multer";

// Configuración de multer para aceptar cualquier tipo de audio
const storage = multer.memoryStorage(); // Almacena en memoria (puedes usar 'diskStorage' para guardar en el disco)
const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // Limita a 10MB
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith('audio/')) {
			cb(null, true);
		} else {
			cb(new Error('Solo archivos de audio son permitidos'));
		}
	},
});

export default upload;