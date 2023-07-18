import Cookie from 'js-cookie';
const useAuthStore = defineStore('auth', {
  state: () => ({
    user: Cookie.get('user') ? JSON.parse(Cookie.get('user')) : null,
    token: Cookie.get('token') || null,
  }),
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
  },
  actions: {
    login({ user, token }) {
      Cookie.set('token', token);
      Cookie.set('user', JSON.stringify(user));
      this.user = user;
      this.token = token;
    },
    logout() {
      Cookie.remove('token');
      Cookie.remove('user');
      this.user = null;
      this.token = null;
    },
  },
});
export default useAuthStore