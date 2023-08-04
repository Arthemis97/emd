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
const emit = defineEmits();
const setData = (e) => {
	emit('update:modelValue', {
		...props.propperties,
		...{ value: e.target.checked }
	});
};
</script>
<template>
	<a-form-item :label="propperties.label" class="tw-mb-0">
		<a-checkbox v-model:checked="modelValue.value" @change="setData">{{ propperties.label }}</a-checkbox>
	</a-form-item>
</template>