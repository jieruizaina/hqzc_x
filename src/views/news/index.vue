<template>
  <div class="details">
		<headers :columnName="columnName"/>
		<content/>
  </div>
</template>

<script setup name="details">
import headers from '../../components/header.vue'
import content from './content.vue'
const route = useRoute();
const state = reactive({
	columnName:'新闻中心'
})
const { columnName} = toRefs(state)
onMounted(() => {
	if(route.query.columnName){
		state.columnName = route.query.columnName
	}
})
</script>

<style scoped lang="scss">
.details {

}
</style>

