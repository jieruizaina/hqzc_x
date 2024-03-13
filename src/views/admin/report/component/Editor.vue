<template>
	<div id="editor" ref="editor" style="top:64px" />
</template>

<script  setup>
import { ref } from 'vue'
import WangEditor from 'wangeditor'

const { proxy } = getCurrentInstance();
onMounted(() => {
	const editor2 = new WangEditor(proxy.$refs.editor)
	editor2.create()
})
</script>

<style lang="scss" scoped>
::v-deep #editor .w-e-toolbar {
	z-index: 2 !important;
}

::v-deep #editor .w-e-text-container {
	z-index: 1 !important;
}
</style>
