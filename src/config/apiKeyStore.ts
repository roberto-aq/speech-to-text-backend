import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';

dotenv.config();

const ENCRYPTION_SECRET =
	process.env.ENCRYPTION_SECRET || 'supersecretkey'; // Clave de encriptación
const ENV_FILE_PATH = path.join(process.cwd(), '.env'); // Ruta del archivo .env dinámico

class ApiKeyStore {
	private encryptedApiKey: string | null;

	constructor() {
		// Cargar la API Key desde el .env al iniciar el servidor
		const initialApiKey = process.env.ASSEMBLYAI_API_KEY || '';
		this.encryptedApiKey = initialApiKey
			? this.encryptApiKey(initialApiKey)
			: null;
	}

	/**
	 * Encripta la API Key antes de almacenarla
	 */
	private encryptApiKey(apiKey: string): string {
		return CryptoJS.AES.encrypt(apiKey, ENCRYPTION_SECRET).toString();
	}

	/**
	 * Desencripta la API Key cuando se necesite
	 */
	private decryptApiKey(encryptedApiKey: string): string {
		const bytes = CryptoJS.AES.decrypt(
			encryptedApiKey,
			ENCRYPTION_SECRET
		);
		return bytes.toString(CryptoJS.enc.Utf8);
	}

	/**
	 * Guarda la API Key en memoria y en el archivo .env
	 */
	setApiKey(newApiKey: string) {
		this.encryptedApiKey = this.encryptApiKey(newApiKey);
		console.log('🔑 API Key actualizada y persistida.');

		// Guardar la nueva API Key en el .env
		this.updateEnvFile(newApiKey);
	}

	/**
	 * Obtiene la API Key desencriptada
	 */
	getApiKey(): string | null {
		return this.encryptedApiKey
			? this.decryptApiKey(this.encryptedApiKey)
			: null;
	}

	/**
	 * Actualiza el archivo .env con la nueva API Key
	 */
	private updateEnvFile(newApiKey: string) {
		let envData = '';

		// Leer el contenido actual del archivo .env si existe
		if (fs.existsSync(ENV_FILE_PATH)) {
			envData = fs.readFileSync(ENV_FILE_PATH, 'utf8');
		}

		// Reemplazar o agregar la API Key en el archivo .env
		const newEnvData = envData.includes('ASSEMBLYAI_API_KEY=')
			? envData.replace(
					/ASSEMBLYAI_API_KEY=.*/,
					`ASSEMBLYAI_API_KEY=${newApiKey}`
			  )
			: envData + `\nASSEMBLYAI_API_KEY=${newApiKey}`;

		fs.writeFileSync(ENV_FILE_PATH, newEnvData.trim(), 'utf8');
		console.log('✅ API Key guardada en el archivo .env');
	}
}

// Instancia única (Singleton) para mantener el estado global
export const apiKeyStore = new ApiKeyStore();
