import { Server } from './server/server';

const server = new Server();
server.startServer().then(server => {
	console.log('Listening on: ', server.application.address());
}).catch(e => {
	console.log('Server failed to start');
	console.log(e);
	process.exit(1);
})