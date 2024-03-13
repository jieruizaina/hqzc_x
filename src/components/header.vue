<template>
	<div class="header">
		<!-- <img src="../assets/images/header.png" alt=""> -->
		<div class="title">
			<b>{{ props.columnName }}</b>
		</div>
	</div>
</template>

<script setup name="header">
const props = defineProps({
	columnName: {
		type: String,
		default: '新闻中心'
	},
})
</script>

<style scoped lang="scss">
.header {
	min-width: 1200px;
	min-height: 340px;
	background: url('../assets/images/header.png') no-repeat;
	background-size: 100% 100%;

	// img{
	// 	width: 100%;
	// 	height: 100%;
	// 	min-height: 255px;
	// }
	.title {
		width: 1200px;
		margin: 0 auto;
		line-height: 340px;

		b {
			font-size: 52px;
			font-family: Microsoft YaHei, Microsoft YaHei-Bold;
			font-weight: 700;
			text-align: left;
			color: #ffffff;
			letter-spacing: 5.2px;
		}
	}
}
</style>

