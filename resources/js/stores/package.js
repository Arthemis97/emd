import useRequest from "../composables/useRequest";
import { message } from "ant-design-vue";
const usePackageStore = defineStore("package", {
    state: () => ({
        packages: [],
    }),
    getters: {
        getPackages: (state) => state.packages,
    },
    actions: {
        async fetchPackages() {
            const resp = await useRequest.get("/packages");
            if (resp.resp.status === 200) {
                this.packages = resp.data;
            } else {
                message.error(resp.data?.message);
            }
        },
        async storePackage(data) {
            const resp = await useRequest.post("/packages", data);
            if (resp.resp.status === 200) {
                message.success(resp.data?.message || "Багц нэмэгдлээ");
                this.packages = [...this.packages, resp.data.package];
            } else {
                message.error(resp.data?.message || "Алдаа гарлаа");
            }
        },
        async updatePackage(data) {
            const resp = await useRequest.put(`/packages/${data.id}`, data);
            if (resp.resp.status === 200) {
                message.success(resp.data?.message || "Багц засагдлаа");
                const index = this.packages.findIndex(
                    (item) => item.id === resp.data.package.id
                );
                if (index !== -1) {
                    const updatedPackages = [
                        ...this.packages.slice(0, index),
                        resp.data.package,
                        ...this.packages.slice(index + 1),
                    ];
                    this.packages = updatedPackages;
                }
            } else {
                message.error(resp.data?.message || "Алдаа гарлаа");
            }
        },
        async deletePackage(id) {
            const resp = await useRequest.del(`/packages/${id}`);
            if (resp.resp.status === 200) {
                message.success(resp.data?.message || "Багц устгагдлаа");
                const temp = this.packages.filter((i) => i.id !== id);
                this.packages = temp;
            } else {
                message.error(resp.data?.message || "Алдаа гарлаа");
            }
        },
    },
});
export default usePackageStore;
