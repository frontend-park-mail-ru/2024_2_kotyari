
export default class HistoryManager {
  constructor() {
    // Подписка на событие изменения истории
    window.onpopstate = (event) => {
      const path = event.state ? event.state.path : window.location.pathname;
      this.handlePopState(path);
    };
  }

  // Установка слушателя для обработки popstate событий
  onPopState(callback) {
    this.handlePopState = callback;
  }

  // Метод для изменения URL и добавления нового состояния в историю
  navigate(path) {
    if (path !== window.location.pathname){
      window.history.pushState(null, null, path);
      this.handlePopState(path);
    }
  }
}
