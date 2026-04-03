import { makeObservable } from 'mobx';

export class AppState {
  portals = {};

  constructor() {
    makeObservable(this);
  }
}
