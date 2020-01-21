import * as path from 'path';
import * as fse from 'fs-extra';
import { KoaMiddlewareInterface } from 'routing-controllers';

export class MergeMiddleware implements KoaMiddlewareInterface {
  readonly UPLOAD_DIR = path.resolve(__dirname, '../../static/upload');

  async use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
    const { filename } = context.request.body;
    const [name, ext] = filename.split('.');
    const chunkDir = `${this.UPLOAD_DIR}/${name}`;
    const uploadedChunks = await fse.readdir(chunkDir);
    const dest = `${this.UPLOAD_DIR}/${filename}`;
    await fse.writeFile(dest, '');
    for (let file of uploadedChunks) {
      fse.appendFileSync(dest, fse.readFileSync(`${chunkDir}/${file}`));
      fse.unlinkSync(`${chunkDir}/${file}`);
    }
    fse.rmdirSync(chunkDir);
    return next();
  }
}
