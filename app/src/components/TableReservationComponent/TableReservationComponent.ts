import { Component, BaseComponent, Intents, ComponentData } from '@jovotech/framework';
import { GlobalComponent } from '../GlobalComponent';
import { CollectTableDataComponent } from './CollectTableDataComponent';
import { extractSlotsFromEntities } from './util';

// The data that needs to be collected (slot filling) to make a reservation
export interface TableReservationData {
  numberOfPeople?: number; // e.g. "a table for 3"
  seatingType?: 'inside' | 'outside'; // e.g. "a table outside"
  date?: Date;
}

export interface TableReservationComponentData extends ComponentData {
  slots: TableReservationData;
}

/*
|--------------------------------------------------------------------------
| TableReservationComponent
|--------------------------------------------------------------------------
|
| This component is the entry point to the table reservation flow.
| For data collection, it delegates to a subcomponent called CollectTableDataComponent
|
*/
@Component({ components: [CollectTableDataComponent] })
export class TableReservationComponent extends BaseComponent<TableReservationComponentData> {
  /*
    START can either be reached via $redirect/$delegate from another component
    or via a global ReserveTableIntent.
    @see https://www.jovo.tech/docs/handlers#start
  */
  @Intents([{ name: 'ReserveTableIntent', global: true }])
  async START() {
    // If the user entered this handler with e.g. "book a table tomorrow 1pm", the slot can already be used
    this.$component.data.slots = extractSlotsFromEntities(this);

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
    This handler is executed after successful data collection ('success' resolve)
  */
  askForFinalConfirmation(slots?: TableReservationData) {
    if (slots) {
      this.$component.data.slots = slots;
    }

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
