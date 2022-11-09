import { Component, BaseComponent, Intents, Handle, Jovo, ComponentData } from '@jovotech/framework';
import { GlobalComponent } from '../GlobalComponent';
import { CollectTableDataComponent } from './CollectTableDataComponent';

// The data that needs to be collected (slot filling) to make a reservation
export interface TableReservationData {
  numberOfPeople?: number; // e.g. "a table for 3"
  seatingType?: 'inside' | 'outside'; // e.g. "a table outside"
}

export interface TableReservationComponentData extends ComponentData {
  slots: TableReservationData;
}

@Component({ components: [CollectTableDataComponent] })
export class TableReservationComponent extends BaseComponent<TableReservationComponentData> {
  /*
    START can either be reached via $redirect/$delegate from another component
    or via a global ReserveTableIntent.
    @see https://www.jovo.tech/docs/handlers#start
  */
  @Intents([{ name: 'ReserveTableIntent', global: true }])
  async START() {
    await this.$send('Sure, I can help you book a table.');
    return this.collectData();
  }

  collectData() {
    // We delegate to a subcomponent that takes care of collecting all the data
    // After successful collection, it resolves to 'success', which executes the askForFinalConfirmation handler
    // @see https://www.jovo.tech/docs/handlers#delegate-to-components
    return this.$delegate(CollectTableDataComponent, {
      config: {
        slots: this.$component.data.slots,
      },
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
      // TODO: numberOfPeople
  })
  askForFinalConfirmation(slots?: TableReservationData) {
    if (slots) {
      this.$component.data.slots = slots;
    }
    // TODO: Extract from entities
    // this.$component.data.slots = slots || {
    //   numberOfPeople: parseInt(this.$entities.numberOfPeople?.resolved), // string?
    //   seatingType: this.$entities.seatingType?.resolved,
    // };

    return this.$send({
      message: `Just to confirm: Should I reserve a table ${this.$component.data.slots.seatingType} for ${this.$component.data.slots.numberOfPeople} people for you?`,
      quickReplies: ['yes', 'no'],
    });
  }

  /*
    This handler can be used to react to the final confirmation
  */
  @Intents(['YesIntent'])
  confirmReservation() {
    return this.$send({
      message: `Great! We're going to reserve an ${this.$component.data.slots.seatingType} table for ${this.$component.data.slots.numberOfPeople} people.`,
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
