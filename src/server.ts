import http from 'http';
import app from './app';
import dotenv from 'dotenv';
import { socketManager } from './socketManager';

dotenv.config();

const server = http.createServer(app);

socketManager.init(server);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

server.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
