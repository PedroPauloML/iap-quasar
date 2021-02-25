export default ({ app, router, store, Vue }) => {
  Vue.mixin({
    computed: {
      userSigned() {
        return (
          !!store.state.user.user &&
          Object.keys(store.state.user.user).length > 0
        );
      }
    }
  });
};
