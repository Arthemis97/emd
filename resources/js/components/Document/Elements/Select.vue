<script setup>
const props = defineProps({
  propperties: {
    type: Object,
    required: true
  },
  modelValue: {
	type: Object,
    required: true
  }
})
const options = computed(() => {
	return props.modelValue.options.split(',')
})
const emit = defineEmits();
const setData = (e) => {
	emit('update:modelValue', {
		...props.propperties,
		...{ value: props.modelValue.value }
	});
};
</script>
<template>
	<a-form-item :label="propperties.label" class="tw-mb-0">
		<a-select v-model:value="modelValue.value" @change="setData">
			<a-select-option v-for="(m, m_index) in options" :key="m_index" :value="m">{{ m
			}}</a-select-option>
		</a-select>
	</a-form-item>
</template>