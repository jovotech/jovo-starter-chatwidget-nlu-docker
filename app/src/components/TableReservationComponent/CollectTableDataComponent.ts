import { Component, BaseComponent, Intents, ComponentData, ComponentConfig, Handle, Jovo } from '@jovotech/framework';
import { TableReservationData } from './TableReservationComponent';

export interface TableReservationComponentData extends ComponentData {
  // The slots to be filled.
  // This is stored in $component.data until resolved and sent to the parent component
  slots: TableReservationData;

  // This is used so that people don't get stuck in a loop
  unhandledCounter: number;
}

export interface TableReservationComponentDataConfig extends ComponentConfig {
  // If some slots have already been filled by the parent component, they are passed using component config
  slots: TableReservationData;
}

@Component({})
export class CollectTableDataComponent extends BaseComponent<TableReservationComponentData, TableReservationComponentDataConfig> {
  START() {
    this.$component.data.unhandledCounter = 0;
    this.$component.data.slots = this.$component.config?.slots || {};

    return this.askForDataOrResolve();    
  }

  askForDataOrResolve() {
    if (!this.$component.data.slots.numberOfPeople) {
      return this.askForNumberOfPeople()
    }
    if (!this.$component.data.slots.seatingType) {
      return this.askForSeatingType()
    }

    // If all slots are filled, send the data to the parent component
    return this.$resolve('success', this.$component.data.slots);
  }

  askForNumberOfPeople() {
    return this.$send({
      message: 'For how many people?',
      quickReplies: ['2', '3', '4'],
    });
  }

  askForSeatingType() {
    return this.$send({
      message: 'Do you prefer inside or outside seating?',
      quickReplies: ['inside', 'outside'],
    });
  }

  @Handle({
    // We can access this handler using multiple intents to allow for variations
    intents: [
      'ReserveTableIntent', // e.g. "a table outside for 3 people"
      'NumberOfPeopleIntent', // e.g. "3 people"
      'SeatingTypeIntent' // e.g. "outside"
    ],
    // Only go into this handler if the request contains an entity.
    // Otherwise, it goes into UNHANDLED
    if: (jovo: Jovo) => !!jovo.$entities 
  })
  @Intents(['ReserveTableIntent', 'NumberOfPeopleIntent', 'SeatingTypeIntent'])
  collectData() {
    if (this.$entities.numberOfPeople) {
      this.$component.data.slots.numberOfPeople = parseInt(`${this.$entities.numberOfPeople.resolved}`);
    }
    if (this.$entities.seatingType) {
      this.$component.data.slots.seatingType = this.$entities.seatingType.resolved as TableReservationData['seatingType'];
    }

    this.$send({ message: ['Great!', 'Alright!'] }); // An array of messages results in randomized output
    this.$component.data.unhandledCounter = 0; // Reset counter in case another slot needs to be filled
    
    return this.askForDataOrResolve();
  }

  @Intents(['HelpIntent'])
  UNHANDLED() {
    this.$component.data.unhandledCounter++;

    if (this.$component.data.unhandledCounter > 1) {
      return this.$resolve('dismiss');
    }

    return this.askForDataOrResolve();
  }
}
