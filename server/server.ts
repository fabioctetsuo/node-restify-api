import * as Restify from 'restify';
import { environment } from '../config/environment';

export class Server {
  // Propriedade que nos permite referenciar a instancia do server mais tarde
  application: Restify.Server;
  
  // A configuração do Restify em si não é uma Promise
  initRoutes(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = Restify.createServer({
          name: 'meat-api',
          version: '1.0.0'
        });
        
        // plugin queryParser detecta os parametros na url e atribui eles ao objeto query do request
        this.application.use(Restify.plugins.queryParser());

        //Routes
        this.application.get('info', (req, resp, next) => {
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
        
        this.application.get('infos', [
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
        
        this.application.get('/hello', (req, resp, next) => {
          /*
            resp.json({ message: 'hello world' });
            é uma forma abreviada de setar o content type e a mensagem
            que nem é feito abaixo com o contentType e o metodo send().
        
            Outra forma de voce setar os headers da pagina é usando o
            método setHeader do objeto response.
        
            o método status() é usado para controlar o status que deve ser devolvido
            na requisição
          */
          const { nome } = req.query;
          resp.status(400);
          resp.contentType = 'application/json';
          resp.setHeader('Authorization', 'token');
          resp.send({ message: `Ola ${nome}, a namorada mais linda desse universo` });
        
        
          // resp.json({ message: 'hello world' });	
          return next();
        })

        this.application.listen(environment.server.port, () => {
          resolve(this.application);
        })
        
      } catch (e) {
        reject(e);
      }
    })
  }
  
  startServer(): Promise<Server> {
    // Método para startar nosso servidor restify
    // Primeiro inicia as rotas e depois retorna a própria instância
    return this.initRoutes().then(() => this);
  }
}