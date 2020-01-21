import * as path from 'path';
import * as fse from 'fs-extra';
import { KoaMiddlewareInterface } from 'routing-controllers';
import * as multiparty from 'multiparty';

export class UploadMiddleware implements KoaMiddlewareInterface {
  readonly UPLOAD_DIR = path.resolve(__dirname, '../../static/upload');

  use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
    let form = new multiparty.Form({
      uploadDir: this.UPLOAD_DIR
    });
    form.parse(context.req, async (err, fields, files) => {
      if (err) {
        throw err;
      };
      const [chunk] = files.chunk;
      const [hash] = fields.hash;
      const [filename] = fields.filename;
      const [name, ext] = filename.split('.');
      const chunkDir = `${this.UPLOAD_DIR}/${name}`;

      if (!fse.existsSync(chunkDir)) {
        await fse.mkdir(chunkDir);
      };
      let destName = `${chunkDir}/${hash}`;
      if (fse.existsSync(destName)) {
        await fse.remove(destName);
      };
      await fse.move(chunk.path, destName);
    });
    return next();
  }
}

