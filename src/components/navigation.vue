<template>
	<div class="mbxs">
		<div class="mbx">
			<div class="icon">
				<el-icon>
					<LocationFilled />
				</el-icon>
				<span>当前位置：</span>
			</div>
			<el-breadcrumb :separator-icon="ArrowRight">
				<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>{{state.name}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	</div>
</template>

<script setup name="navigation">
import { ArrowRight } from '@element-plus/icons-vue'
const route = useRoute()
const state = reactive({
name:'详情'
})
onMounted(() => {
	if(window.location.pathname === '/meetingDetails'){
		state.name = '大会概况'
	}else if(window.location.pathname === '/personal'){
		state.name = '个人中心'
	}else if(window.location.pathname === '/report'){
		state.name = '填报'
	}
	console.log('route',route.query,window.location.pathname);
})
</script>

<style scoped lang="scss">
.mbxs {
	min-width: 1200px;
	height: 57px;
	background: #ffffff;

	.mbx {
		margin: 0 auto;
		display: flex;
		align-items: center;
		width: 1200px;
		height: 100%;
		border-bottom: 1px solid #DEDEDE;

		::v-deep .el-breadcrumb {
			font-size: 14px;
			line-height: normal;
		}

		.icon {
			font-size: 14px;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: 400;
			color: #666666;
			display: flex;
			align-items: center;
			margin-right: 4px;

			.el-icon {
				font-size: 20px;
				color: #00469B;
			}
		}
	}
}
</style>

