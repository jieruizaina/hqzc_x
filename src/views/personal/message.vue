<template>
	<div class="message">
		<div class="box" v-for="i in 6">

			<div class="mesLef">
				<b>招商银行已通过您提交的鲁贸贷申请</b>
				<span>2023-03-03 17:07:05</span>
			</div>
			<el-button type="primary" color="#00469B" plain round @click="jumpNewslist">立即查看></el-button>
		</div>
	</div>
</template>

<script setup name="message">

</script>

<style scoped lang="scss">
.message {
	.box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px dashed #CCCCCC;
		padding: 20px 0;

		.mesLef {
			b {
				font-size: 18px;
				font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				font-weight: 400;
				color: #333333;
				display: block;
				margin-bottom: 10px;
			}

			span {
				font-size: 14px;
				font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				font-weight: 400;
				color: #999999;
				line-height: 32px;
			}
		}

	}
}
</style>

