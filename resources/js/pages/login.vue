<script setup>
import useRequest from '../composables/useRequest.js';
import { message } from 'ant-design-vue';
import useAuthStore from '../stores/auth'
import { useHead } from 'unhead'

const authStore = useAuthStore()
const router = useRouter();
const phone = ref('')
const password = ref('')
const loading = ref(false)

useHead({
    title: 'Нэвтрэх',
})

const login = async () => {
	loading.value = true
	const response = await useRequest.post('/login', {
        phone: phone.value,
        password: password.value
      })
	  if(response.resp.status === 200) {
		authStore.login({
			user: response.data.user,
			token: response.data.token
		})
		loading.value = false
		router.push('/')
		message.success(response.data?.message || "Амжилттай нэвтэрлээ");
	  } else {
		loading.value = false
		message.error(response.data?.message || "Алдаа гарлаа");
	  }
}
</script>
<template>
	<div class="tw-min-h-screen tw-bg-gray-100 tw-flex tw-flex-col tw-justify-center sm:tw-py-12">
		<div class="tw-p-10 xs:tw-p-0 tw-mx-auto md:tw-w-full md:tw-max-w-md">
			<h1 class="tw-font-bold tw-text-center tw-text-2xl tw-mb-5">EPIMON</h1>
			<div class="tw-bg-white tw-shadow tw-w-full tw-rounded-lg tw-divide-y tw-divide-gray-200">
				<a-form layout="vertical" class="tw-px-5 tw-py-7">
					<a-form-item label="Утасны дугаар">
						<a-input v-model:value="phone" class="tw-w-full" size="large"></a-input>
					</a-form-item>
					<a-form-item label="Нууц үг">
						<a-input v-model:value="password" class="tw-w-full" size="large" type="password"></a-input>
					</a-form-item>
					<a-button @click="login()" :loading="loading" type="primary" class="tw-w-full"
						size="large">Нэвтрэх</a-button>
				</a-form>
			</div>
		</div>
	</div>
</template>
