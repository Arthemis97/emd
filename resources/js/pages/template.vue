<script>
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import Topbar from '../components/Topbar.vue';
import { useHead } from 'unhead'
useHead({
    title: 'Загвар',
})
export default {
    name: "App",
    components: { Topbar },
    data() {
        return {
            editor: Editor,
            editorData: "<p>Content of the editor.</p>",
            editorConfig: {}
        };
    },
    methods: {},
    setup() {
        const router = useRouter();
        return {
            router
        };
    }
}
</script>
<template>
    <Topbar>
        <template v-slot:left>
            <div></div>
        </template>
    </Topbar>
    <div class="tw-p-6">
        <div class="tw-flex tw-justify-center">
            <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
        </div>
    </div>
</template>
