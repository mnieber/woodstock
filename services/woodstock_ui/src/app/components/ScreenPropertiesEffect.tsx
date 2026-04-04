import { observer } from 'mobx-react-lite';
import React from 'react';
import { withContextProps } from 'react-props-from-context';
import { appCtx } from '/src/app/hooks/useAppContext';

type PropsT = {};

const ContextProps = {
  appState: appCtx.appState,
};

export const ScreenPropertiesEffect = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    React.useEffect(() => {
      const mediaQuery = window.matchMedia('(min-width: 1024px)');

      // Set initial value
      props.appState.setIsDesktop(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => {
        props.appState.setIsDesktop(e.matches);
      };

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handler);
        return () => mediaQuery.removeListener(handler);
      }
    }, []);

    return null;
  }, ContextProps)
);
