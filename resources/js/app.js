import { createHead } from "@vueuse/head";
import Antd from "ant-design-vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import "ant-design-vue/dist/reset.css";
import VueDayjs from "vue3-dayjs-plugin";
import print from "vue3-print-nb";
import PerfectScrollbar from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";

import { registerLayouts } from "./layouts/register";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const head = createHead();
app.use(head);
app.use(createPinia());
app.use(CKEditor);
app.use(router);
app.use(Antd);
app.use(VueDayjs);
app.use(print);
app.use(PerfectScrollbar);
registerLayouts(app);
app.mount("#app");
