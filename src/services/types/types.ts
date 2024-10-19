

export interface IRenderManager {
  rootElementId: string;

  // Метод для построения основного тела, принимает объект User, возвращает Promise<void>
  buildMain(user?: { name: string; city: string }): Promise<void>;

  // Метод для рендеринга с обработчиками, принимает функцию mainPart, возвращает Promise<void>
  renderWithHandlers(mainPart: () => Promise<void>): Promise<void>;

  // Метод для удаления всех обработчиков
  removeAllHandlers(): void;
}

export interface User {
  name: string;
  city: string;
}
