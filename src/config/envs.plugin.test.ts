import { envs } from "./envs.plugin"

describe('envs.plugin.ts', () => {
   test('Should return env options', () => {
      expect(envs).toEqual({
         PORT: 3000,
         MAILER_SERVICE: 'gmail',
         MAILER_EMAIL: 'salvmike0@gmail.com',
         MAILER_SECRET_KEY: 'zsnpcvxccwncaavp',
         PROD: false,
         MONGO_URL: 'mongodb://michael:123456@localhost:27017',
         MONGO_DB_NAME: 'NOC-TEST',
         MONGO_USER: 'michael',
         MONGO_PASS: '123456'
      });
   });

   test('Should return error if envs arent found', async()=> {
      jest.resetModules();
      process.env.PORT = 'ABC';
      try {
         await import('./envs.plugin');
         expect(true).toBe(false);
      } catch (error) {
         expect(`${error}`).toContain('"PORT" should be a valid integer');
      }
   });
})