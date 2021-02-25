export function addSchedule(state, schedule) {
  if (!schedule.id) {
    schedule.id = state.schedules.length + 1;
  }
  state.schedules = [schedule, ...state.schedules];
}

export function updateSchedule(state, payload) {
  let index = state.schedules.findIndex(el => el.id == payload.id);

  if (index != -1) {
    state.schedules[index] = { ...state.schedules[index], ...payload.data };
  }
}

export function removeSchedules(state, id) {
  state.schedules = state.schedules.filter(el => el.id != id);
}
