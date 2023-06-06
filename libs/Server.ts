import express from 'express';
import { createServer } from 'http';
import next from 'next';
import { NextServer } from 'next/dist/server/next';
import Route from './route';
import { IServer } from './interface';

const isDev = process.env.NODE_ENV !== 'production';
const app: NextServer = next({ dev: isDev });
const handle = app.getRequestHandler();
const server = express();

const hostname = process.env.HOST;
const port = parseInt(process.env.PORT || '4000');
export default class Server implements IServer {
  static nextApp: NextServer;
  async start() {
    app
      .prepare()
      .then(() => {
        Server.nextApp = app;
        createServer(async (req, res) => {
          try {
            (new Route()).get('/home/index', '/page/home/index').build();
          } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
          }
        })
          .once('error', (err) => {
            console.error(err);
            process.exit(1);
          })
          .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
          });
      })
      .catch((exception) => {
        console.error(exception.stack);
        process.exit(1);
      });
  }
}
