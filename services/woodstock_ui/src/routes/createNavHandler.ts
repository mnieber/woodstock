import { DefaultAuthNavHandler } from '/src/auth/routes';
import { DefaultAtlasesNavHandler } from '/src/atlases/routes';
import { NavHandler } from '/src/routes/navHandler';
import { DefaultFramesNavHandler } from '/src/frames/routes';

export const createNavHandler = () => {
  const navHandler = new NavHandler();
  navHandler.installDefaultNavHandler(new DefaultAtlasesNavHandler());
  navHandler.installDefaultNavHandler(new DefaultAuthNavHandler());
  navHandler.installDefaultNavHandler(new DefaultFramesNavHandler());
  return navHandler;
};
