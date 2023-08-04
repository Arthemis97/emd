<script setup>
import usePackageStore from '../../stores/package'
import useTemplateStore from "../../stores/template"
import useDocumentStore from "../../stores/document"
import VueDocumentEditor from 'vue-document-editor'

const templateStore = useTemplateStore()
const packageStore = usePackageStore()
const documentStore = useDocumentStore()
const {getPackages} = storeToRefs(packageStore)

const visible = ref(false)
const printContent = ref("")
const downloadLink = ref("")
const template = ref({
    content: [],
})
const display = ref("vertical")
const printObj = {
    id: "printContent",
    popTitle: 'print',
    beforeOpenCallback(vue) {
    },
    openCallback(vue) {
    },
    closeCallback(vue) {
    }
}

const downloadPdf = (pdfData, filename) => {
     // Convert base64 to a Blob
     const byteCharacters = atob(pdfData);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: 'application/pdf' });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Open the PDF in a new tab
      window.open(url, '_blank');

      // Clean up the URL object after the new tab is opened
      URL.revokeObjectURL(url);
}

const savePdf = async () => {
    const resp = await documentStore.getPDF(template.value.content)
    downloadPdf(resp.data, 'Test')
}


useEvent.on('modal:view:open', async (ids) => {
    const promises = ids.map(async (id) => {
        try {
            const documentResp = await documentStore.fetchDocumentsById(id);
            const templateResp = await templateStore.getTemplate(documentResp.template_id);
            let templateForView = JSON.parse(templateResp.template)[0];
            const parsedData = JSON.parse(JSON.parse(documentResp.data));
            await Promise.all(
                Object.keys(parsedData).map(async (i) => {
                    switch (parsedData[i].type) {
                        case 'InputElement':
                            templateForView = templateForView.replace(parsedData[i].replace, parsedData[i].value);
                            break;
                        case 'Image':
                            templateForView = templateForView.replace(parsedData[i].replace, `<img src="${isBase64Image(parsedData[i].src) ? parsedData[i].src : getImage(`${parsedData[i].src}.png`)}" />`);
                            break;
                        case 'Bold':
                            templateForView = templateForView.replace(parsedData[i].replace, parsedData[i].value ? `<b>${parsedData[i].content}</b>` : parsedData[i].content);
                            break;
                        case 'Round':
                            templateForView = templateForView.replace(parsedData[i].replace, parsedData[i].value ? `<span style="border: 1px solid #000; border-radius: 50%">${parsedData[i].content}</span>` : parsedData[i].content);
                            break;
                        case 'Underline':
                            templateForView = templateForView.replace(parsedData[i].replace, parsedData[i].value ? `<u>${parsedData[i].content}</u>` : parsedData[i].content);
                            break;
                        case 'Checkbox':
                            templateForView = templateForView.replace(parsedData[i].replace, parsedData[i].value ? `<span style="border: 1px solid #000; padding: 0 4px;">✓</span>` : '');
                            break;
                        case 'Select':
                            templateForView = templateForView.replace(parsedData[i].replace, `${parsedData[i].value}`);
                            break;
                        default:
                            break;
                    }
                })
            );
            return templateForView;
        } catch (error) {
            console.error('Error processing id:', id, error);
            return null;
        }
    });

    Promise.all(promises)
        .then((processedTemplates) => {
            template.value.content = processedTemplates.filter((tpl) => tpl !== null);
            useEvent.emit('dropdown:hide')
            visible.value = true;
        })
        .catch((error) => {
            console.error('Error processing templates:', error);
        });
})

</script>
<template>
    <a-modal v-model:open="visible" width="215mm" :footer="null">
        <template #title>
            <a-space>
                <a-button type="primary" v-print="printObj">Хэвлэх</a-button>
                <a-button type="primary" @click="savePdf">Хэвлэх</a-button>
                <a ref="downloadLink" style="display: none;"></a>
            </a-space>
        </template>
        <div class="tw-text-xs tw-flex tw-justify-center">
            <!-- <vue-document-editor id="printContent" v-model:content="template.content" :editable="false" :zoom="1"
                :page_format_mm="page_format_mm" :page_margins="page_margins" :display="display" /> -->
            <!-- <div id="printContent" v-html="template.content"></div> -->
            <div id="printContent" ref="printContent" class="tw-flex tw-flex-col">
                <template v-for="(html, index) in template.content">
                    <div style="width: 210mm; height: auto; padding: 10mm 15mm; margin: 0 auto; box-sizing: border-box; page-break-inside: avoid;"
                        v-html="html" class="tw-bg-white">
                    </div>
                    <hr class="pageBreak tw-w-full">
                </template>
            </div>
        </div>
    </a-modal>
</template>

<style>
@media print {
    .pageBreak {
        display: none;
    }
}
</style>
