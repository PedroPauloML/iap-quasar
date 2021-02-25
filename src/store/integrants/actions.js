export function loadIntegrants({ commit, state }) {
  if (!state.integrants.length > 0) {
    let integrants = require("../../data/integrants.json");
    integrants
      .sort((a, b) => a.id - b.id)
      .forEach(integrant => {
        commit("addIntegrant", integrant);
      });
  }
}

export function addIntegrant({ commit }, integrant) {
  commit("addIntegrant", integrant);
}

export function updateIntegrant({ commit }, payload) {
  commit("updateIntegrant", payload);
}

export function removeIntegrant({ commit }, id) {
  commit("removeIntegrants", id);
}
