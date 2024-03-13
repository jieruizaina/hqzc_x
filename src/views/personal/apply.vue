<template>
	<div class="apply">
		<el-table :data="application" border style="width: 100%">
			<el-table-column label="贷款" width="180">
				<template #default="scope">
					{{ scope.row.data ? scope.row.data.parentName :''}}
				</template>
			</el-table-column>
			<el-table-column label="企业名称" width="180">
				<template #default="scope">
						{{  scope.row.data ? scope.row.data.corporation:''}}
				</template>
			</el-table-column>
			<el-table-column label="姓名" width="80">
				<template #default="scope">
						{{  scope.row.data ? scope.row.data.name:''}}
				</template>
			</el-table-column>
			<el-table-column label="手机号" width="120">
				<template #default="scope">
						{{  scope.row.data ? scope.row.data.tel:''}}
				</template>
			</el-table-column>
			<el-table-column label="申请时间" width="180">
				<template #default="scope">
					{{ parseTimes(scope.row.createdAt) }}
				</template>
			</el-table-column>
			<el-table-column label="申请状态" width="100">
				<template #default="scope">
					{{ stateToName(scope.row.status) }}
				</template>
			</el-table-column>
			<el-table-column label="终止原因" width="180">
				<template #default="scope">
					<span v-show="scope.row.status == '-5'" v-for="(reason, inx) in scope.row.processes" :key="inx">{{
						reason.message
					}}</span>
					<span v-show="scope.row.status != '-5'">/</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="120">
				<template #default="scope">
					<el-button link type="danger" @click="getRecall(scope.row)" v-if="scope.row.status == '5'">撤销申请</el-button>
					<el-button link type="success" v-if="scope.row.status == '-5' || scope.row.status == '0'" @click="sqProject(scope.row)">重新编辑</el-button>
					<el-button link type="warning" @click="score(scope.row)" v-if="scope.row.status == '10'">{{
						scope.row.data.isShow ? '立即评分' : "我的评分" }}</el-button>
					<!-- <el-button link type="primary" @click="handleClick(scope.row)">查看详情</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="我的评分" v-model="open" width="400px" append-to-body>
			<el-row class="rows">
				<el-col class="cols">
					<b>满意度：</b><el-rate v-model="form.serviceAttitude" clearable size="large" />{{form.serviceAttitude==1||form.serviceAttitude==2?'不满意':form.serviceAttitude==3 ?'一般':form.serviceAttitude!=0?'满意':''}}
				</el-col>
				
				<el-col class="buts" v-if="isShow">
					<el-button type="primary" color="#00469B" round @click="patch">提交</el-button>
				</el-col>
			</el-row>
		</el-dialog>

		<el-dialog title="详情" v-model="openDetail" width="1000px" append-to-body>

			<el-row class="details_box">

				<el-col :span="8" :key='inx' v-for="(projectInfo, inx) in newProjectInfo" class="boxs"
					:id="projectInfo.type === 'hidden' && projectInfo.code.includes('addTitle') ? 'titles' : ''" v-show="(projectInfo.type === 'hidden' && projectInfo.code.includes('addTitle')) || (projectInfo.value && projectInfo.type !== 'hidden' && projectInfo.code !== 'tags' && projectInfo.type !== 'files' && projectInfo.type !== 'file' && projectInfo.code !== 'name') || ((projectInfo.type === 'files' || projectInfo.type === 'file') && projectInfo.value)">

					<div class="title_box" v-if="projectInfo.type === 'hidden' && projectInfo.code.includes('addTitle')">
						<div class="bank"></div>
						<p>{{ projectInfo.name }}</p>
					</div>
					<div
						v-else-if="projectInfo.value && projectInfo.type !== 'hidden' && projectInfo.code !== 'tags' && projectInfo.type !== 'files' && projectInfo.type !== 'file' && projectInfo.code !== 'name'"
						:key="projectInfo.code" class="content_box">
						<p class="_title">{{ projectInfo.name }}：</p>
						<p v-if="projectInfo.type === 'rich-textarea'" v-html="projectInfo.value" class="_content" />
						<p v-else class="_content">
							{{ projectInfo.value }}
						</p>
					</div>
					<div v-if="(projectInfo.type === 'files' || projectInfo.type === 'file') && projectInfo.value"
						:key="projectInfo.code" class="content_box">
						<p class="_title">{{ projectInfo.name }}：</p>
						<div v-for="(item, inx) in projectInfo.value">
							<el-image style="width: 100px; height: 100px" :src="item.url" :zoom-rate="1.2"
								:preview-src-list="[item.url]" :initial-index="4" fit="cover" v-if="item.suffix !== 'pdf'" />
							<a v-else   @click="downFile(item.url)"><img style="width: 100px; height: 100px" src="../../assets/images/pdf.png"/></a>
							<div>
							</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</el-dialog>
	</div>
</template>

<script setup name="apply">
import {
	getQuery,
	getDetail,
	patchDetail,
	getFavorites,
	putFavorites,
	deleteFavorites,
	patchNoDetail, recall
} from '@/api/report/index'
import {
	getFields
} from '@/api/report/form.js'
import details from '@/utils/details';
import dictionary from '@/utils/dictionary';
import { ElLoading, ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
const route = useRoute()
const router = useRouter();
const state = reactive({
	pdf: '@/assets/images/pdf.png',
	dkformId: '2df5be1e-3971-44be-94bb-c526625c78e0',
	total: 1,
	pageCount: 1,
	//   分页
	currentPage: 1,
	application: [],
	open: false,
	form: {
		serviceAttitude: '',
		responseTime: '',
		serviceQuality: '',
		speciality: ''
	},
	isShow: false,
	id: '',
	openDetail: false,
	newProjectInfo: '',
	projectInfoObj: '',
	dkformId: '2df5be1e-3971-44be-94bb-c526625c78e0',
})
const { application, open, form, isShow, openDetail, newProjectInfo,pdf } = toRefs(state)

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
// })
onMounted(() => {
	getApplication()
})
function downFile(url, fileName, suffix) {
	const link = document.createElement('a');
	link.style.display = 'none';
	link.href = url;
	link.target = '_blank';
	document.body.appendChild(link);
	link.click();
	link.remove();
}
//! 合并数据
async function MergeData() {
	// 获取表单数据
	const dataListObj = await getDataList();
	// 合并和兑换数据
	state.newProjectInfo = await details.detailsData(dataListObj, state.projectInfoObj);
}
// 获取表单数据，用于提取字段名称
async function getDataList() {
	return await getFields(state.dkformId)
}
async function handleClick(item) {
	state.projectInfoObj = item
	await MergeData()
	state.openDetail = true
}
function jupm(item) {
	router.push({
		path: '/report-details',
		query: {
			formId: item.formId,
			id: item.id
		}
	})
}
function score(item) {
	// router.push({
	// 	path: '/user/score',
	// 	query: {
	// 		id: item.id
	// 	}
	// })
	state.open = true
	state.form.serviceAttitude = item.data.serviceAttitude
	state.form.responseTime = item.data.responseTime
	state.form.serviceQuality = item.data.serviceQuality
	state.form.speciality = item.data.speciality
	state.isShow = item.data.isShow
	state.id = item.id
}
async function getApplication(page) {
	const params = {
		formId: state.dkformId,
		page: page ? page : 0,
		size: 15,
		userId: localStorage.userId
	}
	getQuery(params).then(res => {
		state.application = res.data.content
		state.total = res.data.totalElements
		state.pageCount = res.data.totalPages
		state.application.map(async val => {
			//银行机构
			if (val.data.bankingInstitution) {
				console.log('val.data.bankingInstitution',val.data.bankingInstitution);
					let codeName = await dictionary.specialCodeToName('8271dfd8-b7c8-43e1-a6fa-9606a340782d', val.data.bankingInstitution.split(','));
					val.data.bankingInstitutions  = codeName 
			} else if (val.data.guaranteeInstitution) {
				let codeName = await dictionary.specialCodeToName('8271dfd8-b7c8-43e1-a6fa-9606a340782d', val.data.guaranteeInstitution.split(','));
				val.data.guaranteeInstitutions  = codeName 
			}
			if (val.data.serviceAttitude === null || val.data.serviceAttitude === undefined) {
				val.data.isShow = true
			} else {
				val.data.isShow = false
			}
		})
		console.log('state.application', state.application);
	})
}
function changeCurrent(val) {
	getApplication(val - 1)
}
function getRecall(item) {
	recall(item.id).then(() => {
		ElMessage({
			message: '撤销申请成功！',
			type: 'success',
		})
		state.application.map(async val => {
			if (val.id === item.id) {
				val.status = 0
			}
		})
	})
}
function sqProject(item) {
	const params ={
		formId: item.formId, id: item.id
	}
	userStore.changeProvideList(params)
	userStore.changeProvide(true)
	//router.push({ path: '/report', query: { formId: item.formId, id: item.id, parentId: item.data.parentID, parentName: item.data.parentName } })
}

function patch() {
	patchDetail(state.id, state.form).then(res => {
		ElMessage({
			message: '评分成功！',
			type: 'success',
		})
		getApplication()
		state.open = false
	})
}
</script>

<style scoped lang="scss">
.apply {}

::v-deep .el-dialog__body {
	display: none;
}

.rows {
	padding: 0 20px;

	.cols {
		display: flex;
		align-items: center;

		b {
			display: block;
			width: 80px;
		}
	}

	.buts {
		width: 300px;
		height: 40px;
		margin-top: 20px;

		button {
			width: 100%;
			height: 100%;
		}
	}
}

.title_box {
	display: flex;
	align-items: center;
	border-bottom: 1px solid #E9E9E9;

	div {
		width: 6px;
		height: 18px;
		background: #00469b;
		border-radius: 3px;
		margin-right: 8px;
	}

	p {
		font-size: 18px;
		font-family: Microsoft YaHei, Microsoft YaHei-Bold;
		font-weight: 700;
		color: #333333;
		line-height: 44px;
	}
}

#titles {
	max-width: 100% !important;
	flex: 0 0 100% !important
}
</style>

