<script setup>
import useUserStore from '../../stores/user';
const userStore = useUserStore()
const open = ref(false)
const title = ref("Ажилтан нэмэх")
const user = ref({
	name: '',
	phone: '',
	type: '',
	password: ''
})
useEvent.on('drawer:user:open', (e) => {
	if(e.id){
		user.value = e
		title.value = 'Ажилтан засварлах'
	} else {
		title.value = 'Ажилтан нэмэх'
	}
	open.value = true
})

const save = async () => {
	if(user.value.id) {
		await userStore.updateUser(user.value)
		open.value = false
		reset()
	} else {
		await userStore.registerUser(user.value)
		open.value = false
		reset()
	}
}

const afterOpenChange = (e) => {
	if(!e) {
		reset();
	}
}

const reset = () => {
	user.value = {
		name: '',
		phone: '',
		type: '',
		password: ''
	}
}
</script>
<template>
	<a-drawer v-model:open="open" :title="title" :destroyOnClose="true" @afterOpenChange="afterOpenChange"
		placement="right">
		<a-form layout="vertical">
			<a-form-item label="Нэр">
				<a-input v-model:value="user.name"></a-input>
			</a-form-item>
			<a-form-item label="Утас">
				<a-input v-model:value="user.phone"></a-input>
			</a-form-item>
			<a-form-item label="Нууц үг">
				<a-input v-model:value="user.password"></a-input>
			</a-form-item>
			<a-form-item label="Эрх">
				<a-select v-model:value="user.type">
					<a-select-option value="admin">Админ</a-select-option>
					<a-select-option value="user">Ажилтан</a-select-option>
				</a-select>
			</a-form-item>
		</a-form>
		<a-button @click="save" class="tw-w-full" type="primary">Хадгалах</a-button>
	</a-drawer>
</template>

