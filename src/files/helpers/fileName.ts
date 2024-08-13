import { v4 as uuidv4 } from 'uuid';

export const fileName = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('no file'), false);
  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `${uuidv4()}.${fileExtension}`;
  callback(null, fileName);
};
