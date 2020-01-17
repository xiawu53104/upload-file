import * as path from 'path';
import * as fse from 'fs-extra';
import { KoaMiddlewareInterface } from 'routing-controllers';
import * as multiparty from 'multiparty';

export class UploadMiddleware implements KoaMiddlewareInterface {
  readonly UPLOAD_DIR = path.resolve(__dirname, '../../static/upload');
  multiparty = new multiparty.Form();

  use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
    this.multiparty.parse(context.req, async (err, fields, files) => {
      if (err) {
        throw err;
      };
      // console.log(JSON.stringify(fields));
      // console.log(files);
      const [chunk] = files.chunk;
      const [hash] = fields.hash;
      const [filename] = fields.filename;
      const chunkDir = `${this.UPLOAD_DIR}/${filename}`;

      if (!fse.existsSync(chunkDir)) {
        await fse.mkdir(chunkDir);
      };

      const destName = `${chunkDir}/${hash}`;
      if (fse.existsSync(destName)) {
        await fse.remove(destName);
      };
      await fse.move(chunk.path, destName);
    });
    return next();
  }
}
