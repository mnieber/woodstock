import { withCbs, type CallbackMap } from 'aspiration';
import { data, input, operation, stub } from 'skandha';
import * as R from 'ramda';

export class Expansion {
  static className = () => 'Expansion';

  callbackMap = {} as CallbackMap<{
    toggle: {};
  }>;

  @input expandableIds: Array<string> = stub;
  @data isExpandedByItemId: { [key: string]: boolean } = {};

  @operation toggle(args: { itemId: string; value?: boolean }) {
    return withCbs(this.callbackMap, 'toggle', args, (cbs) => {
      this.isExpandedByItemId[args.itemId] = R.isNil(args.value)
        ? !this.isExpandedByItemId[args.itemId]
        : args.value;
    });
  }

  isExpanded(itemId: string): boolean {
    return !!this.isExpandedByItemId[itemId];
  }
}
