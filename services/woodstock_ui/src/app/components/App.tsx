import { NodesStateProvider } from '/src/treeview/components/NodesStateProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import * as R from 'ramda';
import { queryClient } from '/src/api/queryClient';
import { AuthStateProvider } from '/src/auth/components/AuthStateProvider';
import { AuthSwitch } from '/src/auth/components/AuthSwitch';
import { AtlasStateProvider } from '/src/atlases/components/AtlasStateProvider';
import { AtlasesStateProvider } from '/src/atlases/components/AtlasesStateProvider';
import { MainSwitch } from '/src/frames/components/MainSwitch';
import { DashboardFrame } from '/src/frames/components/DashboardFrame';
import { MainView } from '/src/frames/components/MainView';
import { L } from '/src/frames/layout';
import { NavStateProvider } from '/src/routes/components/NavStateProvider';
import { cn } from '/src/utils/classnames';
import { AppStateProvider } from '/src/app/components/AppStateProvider';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthStateProvider>
        <NavStateProvider>
          <AppStateProvider>
            <AppBody>
              <DashboardFrame>
                <AuthSwitch />
                <AtlasesStateProvider>
                  <AtlasStateProvider>
                    <NodesStateProvider>
                      <MainView className="">
                        <MainSwitch />
                      </MainView>
                    </NodesStateProvider>
                  </AtlasStateProvider>
                </AtlasesStateProvider>
              </DashboardFrame>
            </AppBody>
          </AppStateProvider>
        </NavStateProvider>
      </AuthStateProvider>
    </QueryClientProvider>
  );
};

const AppBody = (props: React.PropsWithChildren<{}>) => {
  return (
    <div
      id="App"
      className={cn('App', [
        R.values({
          root: L.col.banner(),
          // 320px = breakpoints.xs
          size: `min-width-[320px] h-screen w-full`,
          scroll: 'overflow-x-hidden',
        }),
      ])}
      tabIndex={0}
      ref={(x: any) => x?.focus()}
    >
      {props.children}
    </div>
  );
};
