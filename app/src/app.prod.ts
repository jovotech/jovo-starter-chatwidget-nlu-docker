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
  ],
});

export * from './server.express';
