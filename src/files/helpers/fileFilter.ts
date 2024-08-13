export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (erro: Error | null, success: boolean) => void,
) => {
  if (!file) return callback(new Error('no file'), false);
  const fileType = file.mimetype.split('/')[1];
  const validExtensions = ['png', 'jpg', 'jpeg'];
  if (!validExtensions.includes(fileType)) {
    return callback(null, true);
  }
  callback(null, false);
};
