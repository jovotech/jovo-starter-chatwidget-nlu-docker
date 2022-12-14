import { Component, BaseComponent, Global, Intents } from '@jovotech/framework';
import { TableReservationComponent } from './TableReservationComponent/TableReservationComponent';

/*
|--------------------------------------------------------------------------
| Global Component
|--------------------------------------------------------------------------
|
| The global component handlers can be reached from anywhere in the app
| Learn more here: www.jovo.tech/docs/components#global-components
|
*/
@Global()
@Component()
export class GlobalComponent extends BaseComponent {
  @Intents(['HelloIntent'])
  async LAUNCH() {
    await this.$send('Hello there!');
    return this.suggestOptions();
  }

  /*
    This handler can be reached either via a global HelpIntent or via direct calls, e.g. from LAUNCH above.
  */
  @Intents(['HelpIntent'])
  suggestOptions() {
    return this.$send({
      message: 'I can help you with one of the following tasks:',
      quickReplies: ['reserve a table', 'order something'],
    });
  }

  /*
    This handler shows how a component can redirect to another component.
  */
  @Intents(['OrderIntent'])
  async redirectToReservation() {
    await this.$send(`We don't support this feature yet, but I can help you book a table!`);

    // @see https://www.jovo.tech/docs/handlers#redirect-to-components
    return this.$redirect(TableReservationComponent, 'collectData');
  }

  /*
    The global UNHANDLED gets called whenever there is no match in any component.
    @see https://www.jovo.tech/docs/handlers#unhandled
  */
  async UNHANDLED() {
    await this.$send(`Apologies, I couldn't process your last message.`);
    return this.suggestOptions();
  }
}
