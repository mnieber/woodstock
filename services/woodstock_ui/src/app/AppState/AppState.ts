import { action, makeObservable, observable } from 'mobx';

export class AppState {
  portals = {};

  constructor() {
    makeObservable(this);
  }
}
