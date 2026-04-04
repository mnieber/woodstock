import { action, makeObservable, observable } from 'mobx';

export class AppState {
  portals = {};

  @observable isDesktop: boolean = false;

  @action
  setIsDesktop(isDesktop: boolean) {
    this.isDesktop = isDesktop;
  }

  constructor() {
    makeObservable(this);
  }
}
