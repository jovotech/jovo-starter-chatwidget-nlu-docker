import { Component, BaseComponent, Intents, Handle, Jovo } from '@jovotech/framework';
import { GlobalComponent } from '../GlobalComponent';
import { CollectTableDataComponent } from './CollectTableDataComponent';

@Component({ components: [CollectTableDataComponent] })
export class TableReservationComponent extends BaseComponent {
  /*
    START can either be reached via $redirect from another component
    or via a global ReserveTableIntent.
  */
  @Intents([{ name: 'ReserveTableIntent', global: true }])
  async START() {
    await this.$send('Sure, I can help you book a table.');
    return this.collectData();
  }

  collectData() {
    return this.$delegate(CollectTableDataComponent, {
      resolve: {
        success: this.askForFinalConfirmation, // The handler that gets called if 'success' is resolved
        dismiss: this.redirectToOptions, // The handler that gets called if 'dismiss' is resolved
      },
    });
  }

  /*
    This handler can either be reached via deep invocation ("reserve a table outside")
    or via successful data collection ('success' resolve)
  */
  @Handle({
    global: true,
    intents: ['ReserveTableIntent'],
    if: (jovo: Jovo) =>
      jovo.$entities.seatingType?.resolved === 'inside' ||
      jovo.$entities.seatingType?.resolved === 'outside',
  })
  askForFinalConfirmation(seatingType?: string) {
    this.$component.data.seatingType = seatingType || this.$entities.seatingType?.resolved;

    return this.$send({
      message: `Alright! Just to confirm: Should I reserve table ${this.$component.data.seatingType} for you?`,
      quickReplies: ['yes', 'no'],
    });
  }

  /*
    This handler can be used to react to the final confirmation
  */
  @Intents(['YesIntent'])
  confirmReservation() {
    return this.$send({
      message: `Great! We're going to reserve a table for ${this.$component.data.seatingType} seating.`,
      listen: false, // close session
    });
  }

  /*
    This handler is reached either via a 'dismiss' resolve or a NoIntent on final confirmation
  */
  @Intents(['NoIntent'])
  async redirectToOptions() {
    await this.$send('No problem.');
    return this.$redirect(GlobalComponent, 'suggestOptions');
  }
}
