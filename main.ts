import { createServer } from 'restify';

const server = createServer({
	name: 'meat-api',
	version: '1.0.0'
});

server.get('/hello', (req, resp, next) => {
	resp.json({ message: 'hello world' });
	return next();
})

server.listen(3000, () => {
	console.log('API is running on: http://localhost:3000');
})