import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';

export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  HOME: 'home',
  CONTRACT_DETAILS: 'contract_details',
  FAVORITES: 'favorites',
  PROFILE: 'profile',
} as const;

export const VIEWS = {
  MAIN: 'main',
};

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.HOME, '/', []),
      createPanel(DEFAULT_VIEW_PANELS.CONTRACT_DETAILS, '/contract/:id', []),
      createPanel(DEFAULT_VIEW_PANELS.FAVORITES, '/favorites', []),
      createPanel(DEFAULT_VIEW_PANELS.PROFILE, '/profile', []),
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
