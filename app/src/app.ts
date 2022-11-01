import { AlexaPlatform } from '@jovotech/platform-alexa';
import { CorePlatform } from '@jovotech/platform-core';
import { App } from '@jovotech/framework';

import { GlobalComponent } from './components/GlobalComponent';
import { LoveHatePizzaComponent } from './components/LoveHatePizzaComponent';
import { SnipsNlu } from '@jovotech/nlu-snips';
import { WebPlatform } from '@jovotech/platform-web';
import { TrainSnipsNluPlugin } from './TrainSnipsNluPlugin';
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
  components: [GlobalComponent, LoveHatePizzaComponent],

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
    // Add Jovo plugins here
    new CorePlatform(),
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
