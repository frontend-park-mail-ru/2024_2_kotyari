import RenderManager from '../router/render-manager.js';
import { AuthManager } from '../client/auth/auth.js';
import HistoryManager from '../router/history.js';
import { Router } from '../router/new-router.js';
import { ROUTES } from '../route-manager/routes.js';
import { RouteHandler } from '../route-manager/route-handler.js';

const routeHandler = new RouteHandler();
const renderer = new RenderManager('main');
const authService = new AuthManager();
const historyManager = new HistoryManager();

const router = new Router(ROUTES, routeHandler, renderer, authService, historyManager);

// Инициализируем роутер
router.init();
