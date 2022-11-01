import { app } from './app';
import { FileDb } from '@jovotech/db-filedb';
import { JovoDebugger } from '@jovotech/plugin-debugger';
import { MongoDb } from '@jovotech/db-mongodb';
import { SnipsNlu } from '@jovotech/nlu-snips';
/*
|--------------------------------------------------------------------------
| STAGE CONFIGURATION
|--------------------------------------------------------------------------
|
| This configuration gets merged into the default app config
| Learn more here: www.jovo.tech/docs/staging
|
*/

app.configure({
  plugins: [
    new FileDb({
      pathToFile: '../db/db.json',
    }),
    // new MongoDb({
    //   connectionString: process.env.ME_CONFIG_MONGODB_URL as string,
    //   databaseName: 'jovo',
    // }),
    new JovoDebugger({
      nlu: new SnipsNlu({
        serverUrl: process.env.SNIPS_NLU_URL,
        serverPath: '/engine/parse',
        fallbackLanguage: 'en',
        engineId: 'sample-app',
      }),
    }),
  ],
});

export * from './server.express';
