import { message } from "ant-design-vue";
import useAuthStore from "../stores/auth";
const BASE_API_URL = "http://localhost:8000/api";

const useRequest = {
    async get(url) {
        const authStore = useAuthStore();
        const headers = {
            Accept: "application/json",
        };
        if (authStore.token) {
            headers.Authorization = `Bearer ${authStore.token}`;
        }
        const resp = await fetch(`${BASE_API_URL}${url}`, {
            method: "GET",
            headers: headers,
        });
        if (resp.status === 200) {
            const respdata = await resp.json();
            return { resp: resp, data: respdata };
        } else if (resp.status === 401) {
            useEvent.emit("logout");
            message.error("Та дахин нэвтэрнэ үү");
        } else {
            return { resp: resp, data: null };
        }
    },
    async post(url, data, type = "application/json") {
        const authStore = useAuthStore();
        const headers = {
            Accept: "application/json",
        };
        let payload = JSON.stringify(data);
        if (authStore.token) {
            headers.Authorization = `Bearer ${authStore.token}`;
        }
        if (type) {
            headers["Content-Type"] = type;
        } else {
            payload = data;
        }
        const resp = await fetch(`${BASE_API_URL}${url}`, {
            method: "POST",
            headers: headers,
            body: payload,
        });
        if (resp.status !== 500) {
            const respdata = await resp.json();
            return { resp: resp, data: respdata };
        } else if (resp.status === 401) {
            useEvent.emit("logout");
            message.error("Та дахин нэвтэрнэ үү");
        } else {
            return { resp: resp, data: null };
        }
    },
    async put(url, data, type = "application/json") {
        const authStore = useAuthStore();
        const headers = {
            Accept: "application/json",
        };
        let payload = JSON.stringify(data);
        if (authStore.token) {
            headers.Authorization = `Bearer ${authStore.token}`;
        }
        if (type) {
            headers["Content-Type"] = type;
        } else {
            payload = data;
        }
        const resp = await fetch(`${BASE_API_URL}${url}`, {
            method: "PUT",
            headers: headers,
            body: payload,
        });
        if (resp.status === 200) {
            const respdata = await resp.json();
            return { resp: resp, data: respdata };
        } else if (resp.status === 401) {
            useEvent.emit("logout");
            message.error("Та дахин нэвтэрнэ үү");
        } else {
            return { resp: resp, data: null };
        }
    },
    async del(url) {
        const authStore = useAuthStore();
        const headers = {
            Accept: "application/json",
        };
        if (authStore.token) {
            headers.Authorization = `Bearer ${authStore.token}`;
        }
        const resp = await fetch(`${BASE_API_URL}${url}`, {
            method: "DELETE",
            headers: headers,
        });
        if (resp.status === 200) {
            const respdata = await resp.json();
            return { resp: resp, data: respdata };
        } else if (resp.status === 401) {
            useEvent.emit("logout");
            message.error("Та дахин нэвтэрнэ үү");
        } else {
            return { resp: resp, data: null };
        }
    },
};

export default useRequest;
