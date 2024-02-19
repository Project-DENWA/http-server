import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const multerCoverConfig = {
  storage: diskStorage({
    destination: join(__dirname, '..', '..', 'uploads', 'covers'),
    filename: (req, file, callback) => {
      const name: string = file.originalname.split('.')[0];
      const fileExtName = extname(file.originalname);
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      callback(null, `${name}-${randomName}${fileExtName}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(
        new HttpException(
          'Only files with jpg, jpeg and png extensions are allowed',
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        ),
        false,
      );
    }
    callback(null, true);
  },
};