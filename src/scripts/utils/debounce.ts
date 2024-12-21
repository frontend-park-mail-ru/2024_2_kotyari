

export const debounce = (func: (...args: any[]) => void, delay: number): (...args: any[]) => void => {
  let timeoutId: NodeJS.Timeout | null = null;

return (...args: any[]) => {
  if (timeoutId) {
    clearTimeout(timeoutId); // Убираем предыдущий таймер
  }

  timeoutId = setTimeout(() => {
    func(...args);
  }, delay);
};
}