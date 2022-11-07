import { App } from '@jovotech/framework';
import { WebPlatform } from '@jovotech/platform-web';
import { SnipsNlu } from '@jovotech/nlu-snips';
import { TrainSnipsNluPlugin } from './TrainSnipsNluPlugin';

import { GlobalComponent } from './components/GlobalComponent';
import { TableReservationComponent } from './components/TableReservationComponent/TableReservationComponent';

/*
|--------------------------------------------------------------------------
| APP CONFIGURATION
|--------------------------------------------------------------------------
|
| All relevant components, plugins, and configurations for your Jovo app
| Learn more here: www.jovo.tech/docs/app-config
|
*/
const app = new App({
  /*
  |--------------------------------------------------------------------------
  | Components
  |--------------------------------------------------------------------------
  |
  | Components contain the Jovo app logic
  | Learn more here: www.jovo.tech/docs/components
  |
  */
  components: [TableReservationComponent, GlobalComponent],

  /*
  |--------------------------------------------------------------------------
  | Plugins
  |--------------------------------------------------------------------------
  |
  | Includes platforms, database integrations, third-party plugins, and more
  | Learn more here: www.jovo.tech/marketplace
  |
  */
  plugins: [
    new WebPlatform({
      plugins: [
        new TrainSnipsNluPlugin(),
        new SnipsNlu({
          serverUrl: process.env.SNIPS_NLU_URL,
          serverPath: '/engine/parse',
          engineId: 'sample-app',
          fallbackLanguage: 'en',
        }),
      ],
    }),
  ],

  /*
  |--------------------------------------------------------------------------
  | Other options
  |--------------------------------------------------------------------------
  |
  | Includes all other configuration options like logging
  | Learn more here: www.jovo.tech/docs/app-config
  |
  */
  logging: true,
});

export { app };
