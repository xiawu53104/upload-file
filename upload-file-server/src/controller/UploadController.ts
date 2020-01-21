import { Controller, Get, Post, UseBefore, UseAfter } from 'routing-controllers';
import { UploadMiddleware, MergeMiddleware } from '../middleware/index';

@Controller()
export class UploadController {
  @Get('/test')
  getTest () {
    return 'test';
  }

  @Post('/upload')
  @UseBefore(UploadMiddleware)
  uploadFile () {
    return {
      msg: 'upload file success'
    };
  }

  @Post('/merge')
  @UseAfter(MergeMiddleware)
  mergerHandler () {
    return {
      msg: 'merge success'
    }
  }
}
