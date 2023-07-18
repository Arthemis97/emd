import useRequest from '../composables/useRequest';
import { message } from 'ant-design-vue';
const useBlankStore = defineStore('blank', {
  state: () => ({
    blanks: []
  }),
  getters: {
    getBlanks: (state) => state.blanks
  },
  actions: {
    async fetchBlanks() {
      const resp = await useRequest.get('/blanks')
      if(resp.resp.status === 200){
        this.blanks = resp.data
      } else {
        message.error(resp.data?.message)
      }
    },
    async storeBlank(data) {
      const resp = await useRequest.post('/blanks', data)
      if(resp.resp.status === 200){
        message.success(resp.data?.message || "Ажилтан нэмэгдлээ")
        this.blanks = [...this.blanks, resp.data.blank]
      } else {
        message.error(resp.data?.message || "Алдаа гарлаа")
      }
    },
    async updateBlank(data) {
      const resp = await useRequest.put(`/blanks/${data.id}`, data)
      if(resp.resp.status === 200){
        message.success(resp.data?.message || "Ажилтан засагдлаа")
        const index = this.blanks.findIndex(item => item.id === resp.data.blank.id);
        if (index !== -1) {
          const updatedBlanks = [
            ...this.blanks.slice(0, index),
            resp.data.blank,
            ...this.blanks.slice(index + 1),
          ];
          this.blanks = updatedBlanks;
        }
      } else {
        message.error(resp.data?.message || "Алдаа гарлаа")
      }
    },
    async deleteBlank(id) {
      const resp = await useRequest.del(`/blanks/${id}`)
      if(resp.resp.status === 200){
        message.success(resp.data?.message || "Ажилтан устгагдлаа")
        const temp = this.blanks.filter(i => i.id !== id)
        this.blanks = temp
      } else {
        message.error(resp.data?.message || "Алдаа гарлаа")
      }
    }
  },
});
export default useBlankStore