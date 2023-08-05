<script setup>
import usePackageStore from "../../stores/package"
const packageStore = usePackageStore()
const visible = ref(false)
const addVisible = ref(false)
const pkg = ref({})
const initLoading = ref(false)
const { getPackages } = storeToRefs(packageStore)

useEvent.on('modal:package:open', async () => {
	await packageStore.fetchPackages()
	visible.value = true
})

const savePackage = async (item) => {
	if(item.id) {
		await packageStore.updatePackage(item)
		pkg.value = {}
	} else {
		await packageStore.storePackage(pkg.value)
		addVisible.value = false
		pkg.value = {}
	}
}

const deletePackage = async (id) => {
	await packageStore.deletePackage(id)
}

const afterClose = async () => {
	addVisible.value = false
	editVisible.value = false
}
</script>
<template>
	<a-modal v-model:open="visible">
		<a-space class="tw-mb-3">
			<a-dropdown :trigger="['click']" :open="addVisible" @afterClose="afterClose()" style="z-index: 10000">
				<a-button size="small" @click="addVisible = !addVisible">Нэмэх</a-button>
				<template #overlay>
					<div class="tw-shadow tw-w-52 tw-py-2 tw-px-3 tw-bg-white">
						<a-form layout="vertical">
							<a-form-item label="Нэр">
								<a-input v-model:value="pkg.name" />
							</a-form-item>
							<a-button size="small" class="tw-w-full tw-mb-2" @click="addVisible = false">Цуцлах</a-button>
							<a-button size="small" type="primary" class="tw-w-full" @click="savePackage">Хадгалах</a-button>
						</a-form>
					</div>
				</template>
			</a-dropdown>

		</a-space>
		<div class="tw-bg-white">
			<a-list class="demo-loadmore-list" :loading="initLoading" item-layout="horizontal" :data-source="getPackages">
				<template #renderItem="{ item }">
					<a-list-item>
						<template #actions>
							<a key="list-loadmore-edit" @click="savePackage(item)">Хадгалах</a>

							<a-popconfirm title="Устгах уу?" ok-text="Тийм" cancel-text="Үгүй"
								@confirm="deletePackage(item.id)">
								<a key="list-loadmore-more">Устгах</a>
							</a-popconfirm>
						</template>
						<a-list-item-meta>
							<template #title>
								<a-input v-model:value="item.name"></a-input>
							</template>
						</a-list-item-meta>
					</a-list-item>
				</template>
			</a-list>
		</div>
	</a-modal>
</template>