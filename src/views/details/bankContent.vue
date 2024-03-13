<template>
	<div class="content">
		<div class="jgjs zfzs">
			<b class="b">一、机构介绍</b>
				<div class="ddu" v-if="props.list.data && props.list.data.summary">
				<span>{{ props.list.data && props.list.data.summary ? props.list.data.summary : '' }}</span>
			</div>
			<div class="nrong">
				<span v-if="props.list.data" v-html="props.list.data.content"></span>
			</div>
		</div>
		<div class="cpfw zfzs"  v-if="props.list.data && props.list.data.productServe">
			<b class="b">二、产品服务</b>
			<div v-for="(item,inx) in dkList" :key="inx">
				<span class="span1">
					{{ item.name }}
				</span>
				<span
					class="span">{{ item.data.summary }}</span>
				<div class="btns">
					<el-button type="primary" color="#00469B" plain round @click="see(item, 'dk')">查看详情></el-button>
					
					<el-button type="primary" color="#00469B" round  @click="sqProject(item)">立即申请</el-button>
				</div>
			</div>
		</div>
		<!-- <div class="fuwd zfzs">
			<b class="b">三、服务网点</b>
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="date" label="序号" width="180" />
				<el-table-column prop="name" label="地区" width="180" />
				<el-table-column prop="address" label="机构名称" />
				<el-table-column prop="name" label="负责人" width="180" />
				<el-table-column prop="name" label="联系方式" width="180" />
				<el-table-column fixed="right" label="操作" width="180">
					<template #default>
						<el-button link type="primary" @click="handleClick">企业核实</el-button>
						<el-button link type="success">一键拨号</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="clxz zfzs">
			<b class="b">四、材料下载</b>
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="date" label="序号" width="180" />
				<el-table-column prop="name" label="材料名称" />
				<el-table-column fixed="right" label="操作" width="180">
					<template #default>
						<el-button link type="primary" @click="handleClick">下载</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div> -->
	</div>
</template>

<script setup name="content">
import {
	getQuery,
	getDetail,
	patchDetail,
	getFavorites,
	putFavorites,
	deleteFavorites,
	patchNoDetail
} from '@/api/report/index'
import { getToken } from '@/utils/auth'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
const route = useRoute()
const router = useRouter();
const tableData = [
	{
		date: '2016-05-03',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles',
	},
	{
		date: '2016-05-02',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles',
	},
	{
		date: '2016-05-04',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles',
	},
]
const state = reactive({
	//文章formId
	wzformId: '78aaec41-7077-49f6-ae2d-647fd22d1369',
	dkList: [],
	dkformId: '2df5be1e-3971-44be-94bb-c526625c78e0',
})
const { dkList } = toRefs(state)
const props = defineProps({
	list: {
		type: Object,
		default: ''
	}
});

watch(() => props.list,async (val) => {
	if (val.data && val.data.productServe) {
		 const list = val.data.productServe.split(',')
		for (let inx = 0; inx < list.length; inx++) {
			const resp = await getDetails(list[inx])
			if(resp && resp.data.isShow == 'true'){
				state.dkList.push(resp)
			}
		}
	}
})
 onMounted(async() => {
})
async function getDetails(id) {
	const res = await getDetail(id)
	const list = res.data
	return list
}
function see(item, type) {
	console.log('item', item);
	router.push({ path: "/details", query: { type: type, id: item.id, formId: item.formId ,columnName:'贷款政策'} });
}
function sqProject(item) {
	// if (getToken()) {
	// 	router.push({ path: '/report', query: { parentId: item.id, parentName: item.name, formId: state.dkformId } })
	// } else {
	// 	proxy.$modal.msgError("请先登录！");
	// 	userStore.changeLogin(true)
	// }
	const params ={
		parentID: item.id, parentName: item.name, loanType: [item.data.financialTag, item.id], auditor: item.data.auditor
	}
	userStore.changeProvideList(params)
	userStore.changeProvide(true)
}
</script>

<style scoped lang="scss">
.content {
	.zfzs {
		margin-top: 18px;

		.b {
			display: block;
			font-size: 16px;
			font-family: Microsoft YaHei, Microsoft YaHei-Bold;
			font-weight: 700;
			color: #333333;
			line-height: 40px;
			letter-spacing: 0.32px;
		}

		.span {
			display: block;
			font-size: 16px;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: 400;
			color: #333333;
			line-height: 38px;
			letter-spacing: 0.32px;
		}
	}

	.jgjs {}

	.cpfw {

		.span1 {
			display: block;
			line-height: 40px;
		}

		.btns {
			display: flex;
			justify-content: flex-end;
		}
	}

	.clxz {
		margin-bottom: 32px;
	}

	.ddu {
		padding: 18px;
		background: #f8f8f8;
		margin-top: 24px;

		span {
			font-size: 16px;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: 400;
			color: #333333;
			line-height: 21px;
			letter-spacing: 0.24px;
		}
	}

	.nrong {
		margin: 30px 0;

		::v-deep img{
			max-width: 100%;
		}
		::v-deep video{
			display: block;
			max-width: 100%;
			margin: 0 auto;
		}
	}
}
</style>

