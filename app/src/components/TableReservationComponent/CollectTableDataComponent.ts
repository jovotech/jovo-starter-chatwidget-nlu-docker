import {
  Component,
  BaseComponent,
  ComponentData,
  ComponentConfig,
  Handle,
  Jovo,
} from '@jovotech/framework';
import { TableReservationData } from './TableReservationComponent';

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

  askForNumberOfPeople() {
    return this.$send({
      message: 'For how many people?',
      quickReplies: ['2', '3', '4'], // Offer a few examples
    });
  }

  askForSeatingType() {
    return this.$send({
      message: 'Do you prefer inside or outside seating?',
      quickReplies: ['inside', 'outside'],
    });
  }

  /*
    This handler can be accessed using multiple intents.
    This way, we can potentially fill multiple slots at once.
    @see https://www.jovo.tech/docs/handlers#start
  */
  @Handle({
    intents: [
      'ReserveTableIntent', // e.g. "a table outside for 3 people"
      'NumberOfPeopleIntent', // e.g. "3 people"
      'SeatingTypeIntent', // e.g. "outside"
    ],
    // Only go into this handler if the request contains an entity.
    // @see https://www.jovo.tech/docs/handle-decorators#if
    if: (jovo: Jovo) => !!jovo.$entities,
  })
  fillSlots() {
    if (this.$entities.numberOfPeople) {
      this.$component.data.slots.numberOfPeople = parseInt(
        `${this.$entities.numberOfPeople.resolved}`,
      );
    }
    if (this.$entities.seatingType) {
      this.$component.data.slots.seatingType = this.$entities.seatingType.resolved as TableReservationData['seatingType'];
    }

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

    // Don't go into UNHANDLED twice, so that users don't get stuck in a loop
    if (this.$component.data.unhandledCounter > 1) {
      return this.$resolve('dismiss');
    }

    return this.askForDataOrResolve();
  }
}
