import useRequest from "../composables/useRequest";
import { message } from "ant-design-vue";
const usePatientStore = defineStore("patient", {
    state: () => ({
        patients: [],
        pagination: {
            current: 1,
            pageSize: 2,
        },
    }),
    getters: {
        getPatients: (state) => state.patients,
        getPagination: (state) => state.pagination,
    },
    actions: {
        async fetchPatients(filters) {
            const params = new URLSearchParams(filters).toString();
            const pgn = new URLSearchParams({
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }).toString();
            const resp = await useRequest.get(`/patients?${pgn}&${params}`);
            if (resp.resp.status === 200) {
                this.patients = resp.data.data;
                const { current_page, per_page, total } = resp.data;
                this.pagination = {
                    current: current_page,
                    pageSize: per_page,
                    total,
                };
            } else {
                message.error(resp.data?.message);
            }
        },
        setPagination(pgn) {
            this.pagination = pgn;
        },
        async registerPatient(data) {
            const tempdata = data;
            tempdata.rd = tempdata.rd.toLowerCase();
            const resp = await useRequest.post("/patients", tempdata);
            if (resp.resp.status === 200) {
                message.success(resp.data?.message || "Ажилтан нэмэгдлээ");
                this.patients = [...this.patients, resp.data.patient];
            } else {
                message.error(resp.data?.message || "Алдаа гарлаа");
            }
        },
        async findPatient(id) {
            const resp = await useRequest.get(`/patients/${id}`);
            if (resp.resp.status !== 500) {
                return resp.data?.patient;
            } else {
                message.error(resp.data?.message || "Алдаа гарлаа");
            }
        },
        async updatePatient(data) {
            const resp = await useRequest.put(`/patients/${data.id}`, data);
            if (resp.resp.status === 200) {
                message.success(resp.data?.message || "Ажилтан засагдлаа");
                const index = this.patients.findIndex(
                    (item) => item.id === resp.data.patient.id
                );
                if (index !== -1) {
                    const updatedPatients = [
                        ...this.patients.slice(0, index),
                        resp.data.patient,
                        ...this.patients.slice(index + 1),
                    ];
                    this.patients = updatedPatients;
                }
            } else {
                message.error(resp.data?.message || "Алдаа гарлаа");
            }
        },
        async deletePatient(id) {
            const resp = await useRequest.del(`/patients/${id}`);
            if (resp.resp.status === 200) {
                message.success(resp.data?.message || "Ажилтан устгагдлаа");
                const temp = this.patients.filter((i) => i.id !== id);
                this.patients = temp;
            } else {
                message.error(resp.data?.message || "Алдаа гарлаа");
            }
        },
    },
});
export default usePatientStore;
