interface SupabaseError {
	message: string;
	details?: string;
	hint?: string;
	code?: string;
	statusCode?: string | number;
}

export function MapErrosSupabase(error: unknown): {
	status: number;
	message: string;
} {
	if (
		typeof error === 'object' &&
		error !== null &&
		'message' in error
	) {
		const err = error as SupabaseError;

		switch (err.statusCode || err.code) {
			case '403':
			case 403:
			case '42501': // RLS violation (Postgres)
				return {
					status: 403,
					message: '🚫 No autorizado para realizar esta acción.',
				};

			case '401':
			case 401:
				return {
					status: 401,
					message: '🔒 No estás autenticado.',
				};

			case '409':
			case 409:
			case '23505': // Duplicado
				return {
					status: 409,
					message: '⚠️ El registro ya existe.',
				};

			case '400':
			case 400:
				return {
					status: 400,
					message: '❌ Petición inválida.',
				};

			case 'PGRST116':
				return {
					status: 404,
					message: '📄 El registro no fue encontrado.',
				};

			default:
				return {
					status: 500,
					message: err.message || '❌ Error desconocido de Supabase',
				};
		}
	}

	return {
		status: 500,
		message: '❌ Error inesperado al comunicarse con Supabase',
	};
}
