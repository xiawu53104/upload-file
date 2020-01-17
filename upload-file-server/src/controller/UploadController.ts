import { Controller, Get, Post, UseBefore } from 'routing-controllers';
import { UploadMiddleware } from '../middleware/UploadMiddleware';

@Controller()
export class UploadController {
  @Get('/test')
  getTest () {
    return 'test';
  }

  @Post('/upload')
  @UseBefore(UploadMiddleware)
  uploadFile () {
    return 'ok';
  }
}
