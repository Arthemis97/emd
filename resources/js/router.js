import useAuthStore from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";
const routes = [
    {
        name: "home",
        path: "/",
        component: () => import("./pages/home.vue"),
        meta: {
            requiresAuth: true,
            layout: "AdminLayout",
        },
    },
    {
        name: "login",
        path: "/login",
        component: () => import("./pages/login.vue"),
        meta: {
            layout: "DefaultLayout",
        },
    },
    {
        name: "template",
        path: "/template",
        component: () => import("./pages/template.vue"),
        meta: {
            requiresAuth: true,
            layout: "AdminLayout",
        },
    },
    {
        name: "users",
        path: "/users",
        component: () => import("./pages/users.vue"),
        meta: {
            requiresAuth: true,
            admin: true,
            layout: "AdminLayout",
        },
    },
    {
        name: "document",
        path: "/document/:id",
        component: () => import("./pages/document.vue"),
        props: true,
        meta: {
            requiresAuth: true,
            admin: true,
            layout: "AdminLayout",
        },
    },

    {
        path: "/:catchAll(.*)",
        component: () => import("./pages/404.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        const authStore = useAuthStore();
        if (authStore.token) {
            if (to.meta.admin) {
                if (authStore.user.type === "admin") {
                    next();
                } else {
                    next({ name: "home" });
                }
            } else {
                next();
            }
        } else {
            next({ name: "login" });
        }
    } else {
        next();
    }
});

export default router;
