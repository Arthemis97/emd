<script setup>
import useClipboard from 'vue-clipboard3'
import useBlankStore from "../stores/blank"
import { message } from 'ant-design-vue';
const blankStore = useBlankStore()
const { toClipboard } = useClipboard()
const { getBlanks } = storeToRefs(blankStore)
const initLoading = ref(false)

const fetchBlanks = async () => {
	await blankStore.fetchBlanks()
}

const showAddDrawer = (row = {}) => {
	useEvent.emit('modal:blank:open', row)
}

const deleteBlank = async (id) => {
	await blankStore.deleteBlank(id)
}

const copyContent = async (content) => {
	try {
        await toClipboard(content)
		message.success('Загвар хуулагдлаа')
      } catch (e) {
        console.error(e)
      }
}

onMounted(() => {
	fetchBlanks()
})
</script>
<template>
	<div class="tw-p-3">
		<a-space class="tw-mb-3">
			<a-button size="small" @click="showAddDrawer()">Нэмэх</a-button>
		</a-space>
		<div class="tw-bg-white">
			<a-list class="demo-loadmore-list" :loading="initLoading" item-layout="horizontal" :data-source="getBlanks">
				<template #renderItem="{ item }">
					<a-list-item>
						<template #actions>
							<a-tooltip>
								<template #title>Загварыг хуулах. Paste хийнэ үү.</template>
								<a key="list-loadmore-edit" @click="copyContent(item.content)">Хуулах</a>
							</a-tooltip>

							<a key="list-loadmore-edit" @click="showAddDrawer(item)">Засах</a>
							<a-popconfirm title="Устгах уу?" ok-text="Тийм" cancel-text="Үгүй"
								@confirm="deleteBlank(item.id)">
								<a key="list-loadmore-more">Устгах</a>
							</a-popconfirm>
						</template>
						<a-list-item-meta>
							<template #title>
								{{ item.name }}
							</template>
						</a-list-item-meta>
					</a-list-item>
				</template>
			</a-list>
		</div>
	</div>
</template>

