<script setup>
import draggable from 'vuedraggable';

const visible = ref(false)
const images = ref([])
const buffer = ref("")
const patient = ref({})
const loading = ref(false)
const downloadLink = ref("")
const dragOptions = {
  animation: 150,
};

const handleOk = async () => {
	loading.value = true
	const response = await fetch('http://localhost:4000/order', {
        method: 'POST',
		headers: {
            'Content-Type': 'application/json'
		},
        body: JSON.stringify({
			indexes: images.value.map(i => i.index),
			buffer: buffer.value
		})
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
	visible.value = false
	useEvent.emit('view:input:reset')
}
useEvent.on('modal:pdfpages:open', (e) => {
	images.value = e.images.map((data, index) => ({
		index: index,
		data: data
	}));
	buffer.value = e.buffer
	patient.value = e.patient
	visible.value = true
});
</script>
<template>
	<a-modal v-model:open="visible" title="PDF файлын хуудас солих" width="1000px">
		<template #footer>
			<a-button type="primary" :loading="loading" @click="handleOk">Илгээх</a-button>
		</template>
		<a ref="downloadLink" style="display: none;"></a>
		<draggable v-model="images" :options="dragOptions" item-key="id" class="tw-grid tw-grid-cols-6 tw-gap-4">
			<template #item="{ element }">
				<div class="tw-relative">
					<div
						class="tw-absolute tw-text-center tw-top-2 tw-left-2 tw-font-bold tw-bg-blue-500 tw-text-white tw-w-5 tw-h-5">
						{{ element.index }}</div>
					<img :src="`data:image/png;base64,${element.data}`" alt="" class="tw-shadow-lg tw-max-w-full" />
				</div>
			</template>
		</draggable>
	</a-modal>
</template>