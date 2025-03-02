import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_SECRET =
	process.env.ENCRYPTION_SECRET || 'supersecretkey'; // Clave secreta para encriptar

class ApiKeyStore {
	private encryptedApiKey: string | null;

	constructor() {
		const initialApiKey = process.env.ASSEMBLYAI_API_KEY || '';
		this.encryptedApiKey = initialApiKey
			? this.encryptApiKey(initialApiKey)
			: null;
	}

	/**
	 * Encripta la API Key antes de almacenarla
     * @param apiKey API Key a encriptar
     * @returns API Key encriptada
	 */
	private encryptApiKey(apiKey: string): string {
		return CryptoJS.AES.encrypt(apiKey, ENCRYPTION_SECRET).toString();
	}

	/**
	 * Desencripta la API Key cuando se necesite
     * @param encryptedApiKey API Key encriptada
     * @returns API Key desencriptada
	 */
	private decryptApiKey(encryptedApiKey: string): string {
		const bytes = CryptoJS.AES.decrypt(
			encryptedApiKey,
			ENCRYPTION_SECRET
		);
		return bytes.toString(CryptoJS.enc.Utf8);
	}

	/**
	 * Guarda una nueva API Key en memoria (encriptada)
	 */
	setApiKey(newApiKey: string) {
		this.encryptedApiKey = this.encryptApiKey(newApiKey);
		console.log('🔑 API Key actualizada de forma segura.');
	}

	/**
	 * Obtiene la API Key desencriptada
	 */
	getApiKey(): string | null {
		return this.encryptedApiKey
			? this.decryptApiKey(this.encryptedApiKey)
			: null;
	}
}

// Instancia única (Singleton) para mantener el estado global
export const apiKeyStore = new ApiKeyStore();
