<script setup>
const visible = ref(false)
const patientId = ref('')
const imageFile = ref(null)
const images = ref([])
const selected = ref([])
const isAdding = ref(false)
useEvent.on('modal:image:open', (id) => {
	patientId.value = id
	fetchImages()
	visible.value = true
})
useEvent.on('modal:image:adding', (data) => {
	patientId.value = data.patientId
	isAdding.value = data.isAdding
	fetchImages()
	visible.value = true
})
const handleImage = (e) => {
	imageFile.value = e.target.files[0]
}

const handleCheck = (e, img) => {
  const index = selected.value.findIndex((item) => item === `/images/${img.patient_id}/${img.path}`);
  if (e.target.checked) {
    if (index === -1) {
      selected.value.push(`/images/${img.patient_id}/${img.path}`);
    }
  } else {
    if (index !== -1) {
      selected.value.splice(index, 1);
    }
  }
};

const uploadImage = async () => {
	if(imageFile.value) {
		const formData = new FormData();
		formData.append('image', imageFile.value)
		const resp = await useRequest.post(`/images/${patientId.value}`, formData, null)
		images.value = [...images.value, resp.data.image]
		imageFile.value = null
	}
}

const fetchImages = async () => {
	const resp = await useRequest.get(`/images/${patientId.value}`)
	images.value = resp.data.images
}

const deleteImage = async (id) => {
	await useRequest.del(`/images/${id}`)
	const temp = images.value.filter(i => i.id !== id)
	images.value = temp
}
const emitImages = () => {
	useEvent.emit('document:images:received', selected.value)
	afterClose()
}

const afterClose = () => {
	patientId.value = null
	imageFile.value = null
	images.value = []
	visible.value = false
}
</script>
<template>
	<a-modal v-model:open="visible" :footer="null" :destroyOnClose="true" @afterClose="afterClose">
		<div class="tw-pt-6">
			<a-space class="tw-mb-2">
				<a-input type="file" @change="handleImage"></a-input>
				<a-button type="primary" @click="uploadImage">Хуулах</a-button>
				<a-button v-if="isAdding" type="primary" @click="emitImages">Хавсаргах</a-button>
			</a-space>
			<div class="tw-shadow tw-grid tw-grid-cols-4 tw-gap-2 tw-p-2">
				<div v-for="(img, img_index) in images" :key="img_index" class="tw-relative tw-group tw-border">
					<div
						class="tw-absolute tw-w-full tw-h-full tw-bg-black tw-hidden tw-bg-opacity-50 group-hover:tw-flex tw-items-center tw-justify-center">
						<div class="tw-flex tw-flex-col tw-space-y-2">
							<a-button size="small" danger @click="deleteImage(img.id)">Устгах</a-button>
						</div>
					</div>
					<img :src="`/images/${img.patient_id}/${img.path}`" class="tw-w-full tw-h-20 tw-object-cover" />
					<a-checkbox v-if="isAdding" class="tw-absolute tw-left-1 tw-top-1"
						@change="handleCheck($event, img)"></a-checkbox>
				</div>
			</div>
		</div>
	</a-modal>
</template>