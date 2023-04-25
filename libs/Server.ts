import express from 'express';
import next from 'next';

const isDev = process.env.NODE_ENV !== 'production';
const app = next({ dev: isDev });
const handle = app.getRequestHandler();
const server = express();
export class Server {
  async start() {
    app
      .prepare()
      .then(() => {
        server.get('/hi', (req, res) => {
          res.json({ hi: 'hi' });
        });
        server.get('*', (req, res) => {
          return handle(req, res);
        });
        server.listen(3000, (err) => {
          if (err) throw err;
          console.log('server ready on port 3000');
        });
      })
      .catch((exception) => {
        console.error(exception.stack);
        process.exit(1);
      });
  }
}
