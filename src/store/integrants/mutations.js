export function addIntegrant(state, integrant) {
  if (!integrant.id) {
    integrant.id = state.integrants.length + 1;
  }
  state.integrants = [integrant, ...state.integrants];
}

export function updateIntegrant(state, payload) {
  let index = state.integrants.findIndex(el => el.id == payload.id);

  if (index != -1) {
    state.integrants[index] = {
      ...state.integrants[index],
      ...payload.data
    };
  }
}

export function removeIntegrants(state, id) {
  state.integrants = state.integrants.filter(el => el.id != id);
}
