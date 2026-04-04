import { data, operation } from 'skandha';

export type ViewModeT = 'list' | 'tree';

export class ViewMode {
  static className = () => 'ViewMode';

  @data mode: ViewModeT = 'list';

  @operation setMode(mode: ViewModeT) {
    this.mode = mode;
  }

  @operation toggleMode() {
    this.mode = this.mode === 'list' ? 'tree' : 'list';
  }
}
