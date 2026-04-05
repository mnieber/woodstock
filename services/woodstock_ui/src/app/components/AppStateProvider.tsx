import { observer } from 'mobx-react-lite';
import React from 'react';
import { AppContext } from '/src/app/hooks/useAppContext';
import { createGetProps } from '/src/utils/createGetProps';
import { useAppState } from '/src/app/hooks/useAppState';

export type PropsT = React.PropsWithChildren<{}>;

export const AppStateProvider = observer((props: PropsT) => {
  const { appState } = useAppState();

  const getAppContext = () => {
    return createGetProps({
      appState: () => appState,
    });
  };

  return (
    <AppContext.Provider value={getAppContext()}>
      {props.children}
    </AppContext.Provider>
  );
});
