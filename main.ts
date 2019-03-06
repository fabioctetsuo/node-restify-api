import { createServer, plugins } from 'restify';

const server = createServer({
	name: 'meat-api',
	version: '1.0.0'
});

// plugin queryParser detecta os parametros na url e atribui eles ao objeto query do request
server.use(plugins.queryParser());

server.get('info', (req, resp, next) => {
	resp.json({
		browser: req.userAgent(),
		method: req.method,
		url: req.url,
		path: req.path(),
		query: req.query
	});
	return next();
	/* next pode ser usada para identificar que terminei a requisição e pode encerrar
		ou quando voce tem um array de callbacks, voce pode usar ela para passar ou nao
		para o proximo callback
	*/
});

server.get('infos', [
	(req, resp, next) => {
		const { cancelar } = req.query;
		if (cancelar && cancelar === 'true') {
			let error: any = new Error();
			error.statusCode = 400;
			error.message = 'Houve uma falha na requisição';
			return next(error);
		}
		else return next();
	},
	(req, resp, next) => {
		const time = req.time();
		resp.json({
			request: 'SUCCESS',
			requestTime: time,
		})
		return next();
	}
]);

server.get('/hello', (req, resp, next) => {
	/*
		resp.json({ message: 'hello world' });
		é uma forma abreviada de setar o content type e a mensagem
		que nem é feito abaixo com o contentType e o metodo send().

		Outra forma de voce setar os headers da pagina é usando o
		método setHeader do objeto response.

		o método status() é usado para controlar o status que deve ser devolvido
		na requisição
	*/
	resp.status(400);
	resp.contentType = 'application/json';
	resp.setHeader('Authorization', 'token');
	resp.send({ message: 'hello world' });


	// resp.json({ message: 'hello world' });	
	return next();
})

server.listen(3000, () => {
	console.log('API is running on: http://localhost:3000');
})