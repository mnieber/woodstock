import { AppState } from '/src/app/AppState/AppState';
import { useBuilder } from '/src/utils/hooks/useBuilder';

export const useAppState = () => {
  const appState = useBuilder(() => {
    return new AppState();
  }) as AppState;

  return {
    appState,
  };
};
