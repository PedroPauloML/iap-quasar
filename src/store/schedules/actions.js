export function loadSchedules({ commit, state }) {
  if (!state.schedules.length > 0) {
    let schedules = require("../../data/schedules.json").map(obj => {
      obj.description = obj.description.filter(el => !!el).join("");

      return obj;
    });
    schedules
      .sort((a, b) => a.id - b.id)
      .forEach(schedule => {
        commit("addSchedule", schedule);
      });
  }
}

export function addSchedule({ commit }, schedule) {
  commit("addSchedule", schedule);
}

export function updateSchedule({ commit }, payload) {
  commit("updateSchedule", payload);
}

export function removeSchedule({ commit }, id) {
  commit("removeSchedules", id);
}
