<script setup>
const router = useRouter()
</script>
<template>
	<div class="tw-h-screen tw-w-screen tw-flex tw-items-center tw-justify-center">
		<a-result status="404" title="404" sub-title="Хуудас олдсонгүй">
			<template #extra>
				<a-button type="primary" @click="router.back()">Буцах</a-button>
			</template>
		</a-result>
	</div>
</template>