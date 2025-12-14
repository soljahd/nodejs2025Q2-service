export const appConfig = {
  port: Number(process.env['PORT']),
  validationPipe: {
    whitelist: true,
    forbidNonWhitelisted: true,
  },
};
