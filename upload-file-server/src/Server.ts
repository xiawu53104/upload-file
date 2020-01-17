import * as path from 'path';
import * as Koa from 'koa';
import * as bodyparser from 'koa-bodyparser';
import * as staticServer from 'koa-static';
import { useKoaServer } from 'routing-controllers';

import {
  UploadController
} from './controller'

export default class Server {
  private app: Koa;

  constructor () {
    this.app = new Koa();
    this.init();
  }

  private init () {
    this.app.use(bodyparser());
    this.app.use(staticServer(path.resolve(__dirname, '../static')));
    useKoaServer(this.app, {
      controllers: [UploadController]
    })
  }

  public start (port: number = 8089) {
    this.app.listen(port, () => {
      console.log(`server is running on http://localhost:${port}`)
    });
  }
}

