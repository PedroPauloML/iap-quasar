export function loadNews({ commit, state }) {
  if (!state.news.length > 0) {
    let news = require("../../data/news.json").map(obj => {
      obj.content = obj.content.filter(el => !!el).join("");

      return obj;
    });
    news
      .sort((a, b) => a.id - b.id)
      .forEach(n => {
        commit("addNews", n);
      });
  }
}

export function addNews({ commit }, news) {
  commit("addNews", news);
}

export function updateNews({ commit }, payload) {
  commit("updateNews", payload);
}

export function removeNews({ commit }, id) {
  commit("removeNews", id);
}
