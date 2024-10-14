import { CLICK_CLASSES, RenderManager } from '../router/render-manager.js';
import { AuthManager } from '../client/auth.js';
import HistoryManager from '../router/history.js';
import { Router } from '../router/new-router.js';
import { RouteConfig } from '../router/route-config.js';
import { RouteHandler } from '../router/route-handler.js';
import { AddDropDown } from '../../scripts/layouts/header/header.js';

const historyManager = new HistoryManager();

const authService = new AuthManager();
const user = authService.isAuthenticated('');

const renderer = new RenderManager('main');

renderer.buildMain(await user)
  .then(() => {
    const routeHandler = new RoucteHandler(renderer, authService);
    const new_router = new Router(RouteConfig, routeHandler, authService, historyManager);

    new_router.init();

    let anchors = document.querySelectorAll(`[router=${CLICK_CLASSES.stability}]`);
    for (let anchor of anchors) anchor.onclick = new_router.handler;

  }).then(() => {
    AddDropDown();
  })
  .catch((err) => {
    console.error(err);
  });
