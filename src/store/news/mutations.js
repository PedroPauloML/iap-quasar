export function addNews(state, news) {
  if (!news.id) {
    news.id = state.news.length + 1;
  }
  state.news = [news, ...state.news];
}

export function updateNews(state, payload) {
  let index = state.news.findIndex(el => el.id == payload.id);

  if (index != -1) {
    state.news[index] = { ...state.news[index], ...payload.data };
  }
}

export function removeNews(state, id) {
  state.news = state.news.filter(el => el.id != id);
}
