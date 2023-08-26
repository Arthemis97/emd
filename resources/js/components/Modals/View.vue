<script setup>
import html2pdf from "html2pdf.js"
import usePackageStore from '../../stores/package'
import useTemplateStore from "../../stores/template"
import useDocumentStore from "../../stores/document"

const templateStore = useTemplateStore()
const packageStore = usePackageStore()
const documentStore = useDocumentStore()
const {getPackages} = storeToRefs(packageStore)

const visible = ref(false)
const patient = ref({})
const loading = ref(false)
const printContent = ref("")
const downloadLink = ref("")
const fileInput = ref("")
const images = ref([])
const template = ref({
    content: [],
})
const printDoc = async () => {
    loading.value = true
    const formData = new FormData();
    const timestamp = new Date().getTime(); 
    const randomPart = Math.floor(Math.random() * 10000); 
    const uniqueId = `${timestamp}${randomPart}`;
    for (const html of template.value.content) {
        formData.append('html[]', html);
    }
    for (const img of images.value) {
        const base64 = await imageUrlToBase64(getPicture(img))
        formData.append('html[]', `<img style="max-width: 100%;" src="${base64}" />`);
    }
    formData.append('temp', uniqueId);

    const response = await fetch(`${apiUrl()}/api/local/generate`, {
        method: 'POST',
        body: formData
      });
      
    const resp = await response.json()
    const byteNumbersArray = resp.buffer.split(',').map(Number);
    const uint8Array = new Uint8Array(byteNumbersArray);
    const blob = new Blob([uint8Array], { type: 'application/pdf' });

    const url = URL.createObjectURL(blob);
    downloadLink.value.href = url;
    downloadLink.value.download = `${patient.value.last_name} ${patient.value.first_name} - ${patient.value.rd}.pdf`;
    downloadLink.value.click();
    URL.revokeObjectURL(url);
    loading.value = false
}


const fileSelected = async (e) => {
    if(e.target.files.length == 0){
        fileInput.value.value = null
        return;
    }
    loading.value = true
    const formData = new FormData();
    const timestamp = new Date().getTime(); 
    const randomPart = Math.floor(Math.random() * 10000); 
    const uniqueId = `${timestamp}${randomPart}`;
    for (const file of Array.from(e.target.files)) {
        formData.append('files[]', file);
    }
    for (const html of template.value.content) {
        formData.append('html[]', html);
    }
    for (const img of images.value) {
        const base64 = await imageUrlToBase64(getPicture(img))
        formData.append('html[]', `<img style="max-width: 100%;" src="${base64}" />`);
    }
    formData.append('temp', uniqueId);

    const response = await fetch(`${apiUrl()}/api/local/generate`, {
        method: 'POST',
        body: formData
      });
      
    const resp = await response.json()

    useEvent.emit('modal:pdfpages:open', {images: resp.thumbnails, buffer: resp.buffer, patient: patient.value})
    loading.value = false
}

const savePdf = async () => {
    fileInput.value.click();
}

useEvent.on('view:input:reset', () => {
    fileInput.value.value = null
})

useEvent.on('modal:view:open', async (idsWithImages) => {
    images.value = idsWithImages.images
    patient.value = idsWithImages.patient
    const docsAndTemplates = await documentStore.getByIds(idsWithImages.ids);
    
    const promises = docsAndTemplates.document.map(async (document) => {
        try {
            let templateForView = document.template.template ? JSON.parse(document.template.template)[0] : '';
            const parsedData = JSON.parse(JSON.parse(document.data));
            await Promise.all(
                Object.keys(parsedData).map(async (i) => {
                    switch (parsedData[i].type) {
                        case 'InputElement':
                            templateForView = templateForView.replace(parsedData[i].replace, parsedData[i].value);
                            break;
                        case 'Image':
                            templateForView = templateForView.replace(parsedData[i].replace, `<img src="${isBase64Image(parsedData[i].src) ? parsedData[i].src : getImage(`${parsedData[i].src}.png`)}" style="${parsedData[i].width ? 'width: ' + parsedData[i].width + 'px' : ''}" />`);
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
                            templateForView = templateForView.replace(parsedData[i].replace, parsedData[i].value ? `<span style="border: 1px solid #000; width: 14px; height: 14px; display: inline-block; font-weight: bold; font-size: 12px; text-align: center;">✓</span>` : '');
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
                <a-button type="primary" @click="printDoc" :loading="loading">Хэвлэх</a-button>
                <a-button type="primary" @click="savePdf" :loading="loading">Нэмэлт PDF</a-button>
                <a ref="downloadLink" style="display: none;"></a>
                <input ref="fileInput" style="display: none;" type="file" multiple accept="application/pdf"
                    @change="fileSelected" />
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
                <template v-for="img in images" :key="img">
                    <img :src="img" class="tw-max-w-full tw-max-h-[297mm]" />
                    <hr class="pageBreak tw-w-full">
                </template>
            </div>
        </div>
    </a-modal>
</template>