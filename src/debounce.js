export const useDebounce = (action = () => {}, timeout = 2000) => {
  let timer;

  return (text) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      action(text);
    }, timeout);
  };
};
