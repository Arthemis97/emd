<script setup>
import { ImportOutlined } from '@ant-design/icons-vue';
import useAuthStore from "../stores/auth"
const authStore = useAuthStore()
const router = useRouter()

const { getUser } = storeToRefs(authStore)

const logout = () => {
	authStore.logout();
	router.push('/login')
}

const showPackageModal = (row = null) => {
	useEvent.emit('modal:package:open', row)
}
</script>
<template>
	<div class="tw-h-10 tw-flex tw-justify-between tw-bg-white tw-shadow tw-items-center tw-text-xs">
		<a-space class="tw-px-4">
			<slot name="left"></slot>
		</a-space>
		<div class="tw-px-4">
			<a-space>
				<a-button @click="router.push('/')" size="small" type="primary">Үйлчлүүлэгч</a-button>
				<a-button @click="showPackageModal()" v-if="getUser && getUser.type === 'admin'" size="small"
					type="primary">Багц</a-button>
				<a-button @click="router.push('/users')" v-if="getUser && getUser.type === 'admin'" size="small"
					type="primary">Ажилтан</a-button>
				<div @click="logout" class="tw-cursor-pointer tw-flex tw-space-x-1">
					<div>{{ getUser ? getUser.name : '' }}</div>
					<import-outlined />
				</div>
			</a-space>
		</div>
	</div>
</template>
