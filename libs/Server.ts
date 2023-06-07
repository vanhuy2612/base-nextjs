import express from 'express';
import next from 'next';
import { NextServer } from 'next/dist/server/next';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { IServer } from './interface';
import Route from './route';
dotenv.config();
const isDev = process.env.NODE_ENV !== 'production';

const app: NextServer = next({ dev: isDev });
const handle = app.getRequestHandler();
const server = express();

const host = process.env.HOST;
const port = parseInt(process.env.PORT || '4000');
export default class Server implements IServer {
  express = express();
  static nextApp: NextServer;

  async nextStart() {
    await app.prepare();
    Server.nextApp = app;
  }

  async start() {
    await this.nextStart();
    
    this.express.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
    this.express.use(bodyParser.json({
      limit: '500mb'
    }));
    const corsConfig = {
      origin: "*"
    }

    this.express.use(cors(corsConfig));
    //fix pre-flight
    this.express.options('*', cors(corsConfig))

    this.express.use(
      (new Route()).get('/', '/page').build(),
      (new Route()).get('/home', '/page/home').build(),
      (new Route()).get('/home/create', '/page/home/create').build(),
    );

    this.express.all('*', (req, res) => {
      res.setHeader(
        "Cache-Control",
        "public, max-age=31536000, immutable",
      );

      return handle(req, res)
    });

    await new Promise<void>(r => this.express.listen(port, host, () => {
      console.log(`server stated: ${host}:${port}`);
      r();
    }))
    // app
    //   .prepare()
    //   .then(() => {
    //     Server.nextApp = app;
    //     createServer(async (req, res) => {
    //       try {
    //         (new Route()).get('/home/index', '/page/home/index').build();
    //       } catch (err) {
    //         console.error('Error occurred handling', req.url, err);
    //         res.statusCode = 500;
    //         res.end('internal server error');
    //       }
    //     })
    //       .once('error', (err) => {
    //         console.error(err);
    //         process.exit(1);
    //       })
    //       .listen(port, () => {
    //         console.log(`> Ready on http://${hostname}:${port}`);
    //       });
    //   })
    //   .catch((exception) => {
    //     console.error(exception.stack);
    //     process.exit(1);
    //   });
  }
}
