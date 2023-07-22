import useRequest from "../composables/useRequest";
import { message } from "ant-design-vue";
const useDocumentStore = defineStore("document", {
    state: () => ({
        documents: [],
        patientDocuments: [],
    }),
    getters: {
        getDocuments: (state) => state.documents,
        getPatientDocuments: (state) => state.patientDocuments,
    },
    actions: {
        async fetchDocuments() {
            const resp = await useRequest.get("/documents");
            if (resp.resp.status === 200) {
                this.documents = resp.data;
            } else {
                message.error(resp.data?.message);
            }
        },
        async storeDocument(data) {
            const resp = await useRequest.post("/documents", data);
            if (resp.resp.status === 200) {
                message.success(resp.data?.message || "Маягт нэмэгдлээ");
                this.documents = [...this.documents, resp.data.document];
            } else {
                message.error(resp.data?.message || "Алдаа гарлаа");
            }
        },
        async fetchDocumentsByPatient(id) {
            const resp = await useRequest.get(`/documents/patient/${id}`);
            if (resp.resp.status === 200) {
                this.patientDocuments = resp.data.document;
                return resp.data.document;
            } else {
                message.error(resp.data?.message || "Алдаа гарлаа");
            }
        },
        async updateDocument(data) {
            const resp = await useRequest.put(`/documents/${data.id}`, data);
            if (resp.resp.status === 200) {
                message.success(resp.data?.message || "Маягт засагдлаа");
                const index = this.documents.findIndex(
                    (item) => item.id === resp.data.document.id
                );
                if (index !== -1) {
                    const updatedDocuments = [
                        ...this.documents.slice(0, index),
                        resp.data.document,
                        ...this.documents.slice(index + 1),
                    ];
                    this.documents = updatedDocuments;
                }
            } else {
                message.error(resp.data?.message || "Алдаа гарлаа");
            }
        },
        async deleteDocument(id) {
            const resp = await useRequest.del(`/documents/${id}`);
            if (resp.resp.status === 200) {
                message.success(resp.data?.message || "Маягт устгагдлаа");
                const temp = this.documents.filter((i) => i.id !== id);
                this.documents = temp;
            } else {
                message.error(resp.data?.message || "Алдаа гарлаа");
            }
        },
    },
});
export default useDocumentStore;
