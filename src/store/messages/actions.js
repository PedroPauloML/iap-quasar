export function loadMessages({ commit, state }) {
  if (!state.messages.length > 0) {
    let messages = require("../../data/messages.json").map(obj => {
      obj.content = obj.content.filter(el => !!el).join("");

      return obj;
    });
    messages
      .sort((a, b) => a.id - b.id)
      .forEach(message => {
        commit("addMessage", message);
      });
  }
}

export function addMessage({ commit }, message) {
  commit("addMessage", message);
}

export function updateMessage({ commit }, payload) {
  commit("updateMessage", payload);
}

export function removeMessages({ commit }, id) {
  commit("removeMessages", id);
}
