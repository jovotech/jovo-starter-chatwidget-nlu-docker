import {
  Component,
  BaseComponent,
  ComponentData,
  ComponentConfig,
  Handle,
  Jovo,
} from '@jovotech/framework';
import { TableReservationData } from './TableReservationComponent';
import { extractSlotsFromEntities } from './util';

export interface CollectTableDataComponentData extends ComponentData {
  // The slots to be filled.
  // This is stored in $component.data until resolved and sent to the parent component
  slots: TableReservationData;

  // This is used so that people don't get stuck in a loop
  unhandledCounter: number;
}

export interface CollectTableDataComponentConfig extends ComponentConfig {
  // If some slots have already been filled by the parent component, they are passed using component config
  slots: TableReservationData;
}

/*
|--------------------------------------------------------------------------
| CollectTableDataComponent
|--------------------------------------------------------------------------
|
| This component is a subcomponent of TableReservationComponent.
| It is responsible for collecting all the data needed for the reservation.
|
*/
@Component({})
export class CollectTableDataComponent extends BaseComponent<
  CollectTableDataComponentData,
  CollectTableDataComponentConfig
> {
  /*
    START is executed when the parent component delegates to this component
    @see https://www.jovo.tech/docs/handlers#start
  */
  START() {
    this.$component.data.unhandledCounter = 0;
    this.$component.data.slots = this.$component.config?.slots || {};

    return this.askForDataOrResolve();
  }

  /*
    This method is used to manage the slot filling.
    When all data is collected, it resolves and sends the data back to the parent component
  */
  askForDataOrResolve() {
    if (!this.$component.data.slots.date) {
      return this.askForDate();
    }
    if (!this.$component.data.slots.numberOfPeople) {
      return this.askForNumberOfPeople();
    }
    if (!this.$component.data.slots.seatingType) {
      return this.askForSeatingType();
    }

    // If all slots are filled, send the data to the parent component
    // @see https://www.jovo.tech/docs/handlers#resolve-a-component
    return this.$resolve('success', this.$component.data.slots);
  }

  askForDate() {
    return this.$send({
      message: 'What day and time?',
      quickReplies: ['tomorrow 1pm', 'next week Tuesday at noon'], // Offer a few examples
      listen: {
        intents: [ 'ReserveTableIntent', 'DateIntent' ], // @see https://www.jovo.tech/docs/nlu#intent-scoping
      },
    });
  }

  askForNumberOfPeople() {
    return this.$send({
      message: 'For how many people?',
      quickReplies: ['2', '3', '4'], // Offer a few examples
      listen: {
        intents: [ 'ReserveTableIntent', 'NumberOfPeopleIntent' ], // @see https://www.jovo.tech/docs/nlu#intent-scoping
      },
    });
  }

  askForSeatingType() {
    return this.$send({
      message: 'Do you prefer inside or outside seating?',
      quickReplies: ['inside', 'outside'],
      listen: {
        intents: [ 'ReserveTableIntent', 'SeatingTypeIntent' ], // @see https://www.jovo.tech/docs/nlu#intent-scoping
      },
    });
  }

  /*
    This handler can be accessed using multiple intents.
    This way, we can potentially fill multiple slots at once.
  */
  @Handle({
    // @see https://www.jovo.tech/docs/handle-decorators#intents
    intents: [
      'ReserveTableIntent', // e.g. "a table outside for 3 people"
      'NumberOfPeopleIntent', // e.g. "3 people"
      'SeatingTypeIntent', // e.g. "outside"
      'DateIntent', // e.g. "tomorrow 3pm"
    ],
    // Only go into this handler if the request contains an entity.
    // @see https://www.jovo.tech/docs/handle-decorators#if
    if: (jovo: Jovo) => !!jovo.$entities,
  })
  fillSlots() {
    this.$component.data.slots = extractSlotsFromEntities(this, this.$component.data.slots);

    this.$send({ message: ['Great!', 'Alright!'] }); // An array of messages results in randomized output
    this.$component.data.unhandledCounter = 0; // Reset counter in case another slot needs to be filled

    return this.askForDataOrResolve();
  }

  /*
    UNHANDLED gets executed if the user input doesn't match one of the handlers in this component
    @see https://www.jovo.tech/docs/handlers#unhandled
  */
  UNHANDLED() {
    this.$component.data.unhandledCounter++;
    console.log(this.$input);

    // Don't go into UNHANDLED twice, so that users don't get stuck in a loop
    if (this.$component.data.unhandledCounter > 1) {
      return this.$resolve('dismiss');
    }

    this.$send('Apologies, could you please try to rephrase?');
    return this.askForDataOrResolve();
  }
}
