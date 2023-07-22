import useRequest from "../composables/useRequest";
import { message } from "ant-design-vue";
const useTemplateStore = defineStore("template", {
    state: () => ({
        templates: [],
    }),
    getters: {
        getTemplates: (state) => state.templates,
    },
    actions: {
        async fetchTemplates() {
            const resp = await useRequest.get("/templates");
            if (resp.resp.status === 200) {
                this.templates = resp.data;
            } else {
                message.error(resp.data?.message);
            }
        },
        async getTemplate(id) {
            const resp = await useRequest.get(`/templates/${id}`);
            if (resp.resp.status === 200) {
                return resp.data.template;
            } else {
                message.error(resp.data?.message);
            }
        },
        async storeTemplate(data) {
            const resp = await useRequest.post("/templates", data);
            if (resp.resp.status === 200) {
                message.success(resp.data?.message || "Маягт нэмэгдлээ");
                this.templates = [...this.templates, resp.data.template];
            } else {
                message.error(resp.data?.message || "Алдаа гарлаа");
            }
        },
        async updateTemplate(data) {
            const resp = await useRequest.put(`/templates/${data.id}`, data);
            if (resp.resp.status === 200) {
                message.success(resp.data?.message || "Маягт засагдлаа");
                const index = this.templates.findIndex(
                    (item) => item.id === resp.data.template.id
                );
                if (index !== -1) {
                    const updatedTemplates = [
                        ...this.templates.slice(0, index),
                        resp.data.template,
                        ...this.templates.slice(index + 1),
                    ];
                    this.templates = updatedTemplates;
                }
            } else {
                message.error(resp.data?.message || "Алдаа гарлаа");
            }
        },
        async deleteTemplate(id) {
            const resp = await useRequest.del(`/templates/${id}`);
            if (resp.resp.status === 200) {
                message.success(resp.data?.message || "Маягт устгагдлаа");
                const temp = this.templates.filter((i) => i.id !== id);
                this.templates = temp;
            } else {
                message.error(resp.data?.message || "Алдаа гарлаа");
            }
        },
    },
});
export default useTemplateStore;
