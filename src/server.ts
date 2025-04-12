import cors from 'cors';

import express, { Router } from 'express';

interface Options {
	port: number;
	public_path?: string;
	routes: Router;
}

export class Server {
	private app: express.Application = express();
	private readonly port: number;
	private readonly routes: Router;

	constructor({ port, routes }: Options) {
		this.port = port;
		this.routes = routes;
	}

	async start() {
		// * Middlewares
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		// Habilitar las cors
		this.app.use(cors());

		// * Routes
		this.app.use(this.routes);

		this.app.listen(this.port, () => {
			console.log(`Server is running on port ${this.port}`);
		});
	}
}
