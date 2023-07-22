<script setup>
import useBlankStore from "../../stores/blank"
const blankStore = useBlankStore()
const visible = ref(false)
const blank = ref({})

useEvent.on('modal:blank:open', (blankItem) => {
	if(blankItem.id) {
		blank.value = blankItem
	} else {
		blank.value = {}
	}
	visible.value = true
})

const save = async () => {
	if(blank.value.id) {
		await blankStore.updateBlank(blank.value)
		visible.value = false
	} else {
		await blankStore.storeBlank(blank.value)
		visible.value = false
	}
}

</script>
<template>
	<a-modal v-model:open="visible" @ok="save" :destroyOnClose="true">
		<a-form layout="vertical">
			<a-form-item label="Нэр">
				<a-input v-model:value="blank.name"></a-input>
			</a-form-item>
			<a-form-item label="Контент">
				<a-textarea v-model:value="blank.content" autoSize></a-textarea>
			</a-form-item>
		</a-form>
	</a-modal>
</template>