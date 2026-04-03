import { NavHandler } from '/src/routes/navHandler';
import { DefaultFramesNavHandler } from '/src/frames/routes';
import { DefaultTracesNavHandler } from '/src/traces/routes';

export const createNavHandler = () => {
  const navHandler = new NavHandler();
  navHandler.installDefaultNavHandler(new DefaultFramesNavHandler());
  navHandler.installDefaultNavHandler(new DefaultTracesNavHandler());
  return navHandler;
};
