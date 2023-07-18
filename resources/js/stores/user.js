import useRequest from '../composables/useRequest';
import { message } from 'ant-design-vue';
const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    pagination: {}
  }),
  getters: {
    getUsers: (state) => state.users,
    getPagitnation: (state) => state.pagination,
  },
  actions: {
    async fetchUsers() {
      const resp = await useRequest.get('/users')
      if(resp.resp.status === 200){
        this.users = resp.data.data
        const { current_page, per_page, total } = resp.data;
        this.pagination = { current: current_page, pageSize: per_page, total }
      } else {
        message.error(resp.data?.message)
      }
    },
    async registerUser(data) {
      const resp = await useRequest.post('/users', data)
      if(resp.resp.status === 200){
        message.success(resp.data?.message || "Ажилтан нэмэгдлээ")
        this.users = [...this.users, resp.data.user]
      } else {
        message.error(resp.data?.message || "Алдаа гарлаа")
      }
    },
    async updateUser(data) {
      const resp = await useRequest.put(`/users/${data.id}`, data)
      if(resp.resp.status === 200){
        message.success(resp.data?.message || "Ажилтан засагдлаа")
        const index = this.users.findIndex(item => item.id === resp.data.user.id);
        if (index !== -1) {
          const updatedUsers = [
            ...this.users.slice(0, index),
            resp.data.user,
            ...this.users.slice(index + 1),
          ];
          this.users = updatedUsers;
        }
      } else {
        message.error(resp.data?.message || "Алдаа гарлаа")
      }
    },
    async deleteUser(id) {
      const resp = await useRequest.del(`/users/${id}`)
      if(resp.resp.status === 200){
        message.success(resp.data?.message || "Ажилтан устгагдлаа")
        const temp = this.users.filter(i => i.id !== id)
        this.users = temp
      } else {
        message.error(resp.data?.message || "Алдаа гарлаа")
      }
    }
  },
});
export default useUserStore