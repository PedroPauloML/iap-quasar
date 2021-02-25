export function addMessage(state, message) {
  if (!message.id) {
    message.id = state.messages.length + 1;
  }
  state.messages = [message, ...state.messages];
}

export function updateMessage(state, payload) {
  let index = state.messages.findIndex(el => el.id == payload.id);

  if (index != -1) {
    state.messages[index] = { ...state.messages[index], ...payload.data };
  }
}

export function removeMessages(state, id) {
  state.messages = state.messages.filter(el => el.id != id);
}
