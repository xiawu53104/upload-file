
import 'reflect-metadata';
import Server from './Server';
import { Container } from 'typedi';

function start () {
  const app = Container.get(Server);
  app.start(8089);
}

start();
