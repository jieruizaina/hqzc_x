<template>
	<div class="collect">

		<div class="card" v-for="(item, index) in followList" :key="index">
			<div class="le_card" v-if="item.payload && item.payload.data && item.payload.data.covers"><img :src="item.payload.data.covers" alt=""></div>
			<div class="ri_card">
				<b @click="see(item, 'news')" v-if="item.payload">{{ item.payload.name }}</b>
				<span class="span" v-if="item.payload && item.payload.data">{{ item.payload.data.summary }}</span>
				<div class="but">
					<span>{{ parseTime(item.createdAt) }}</span>
					<el-button v-if="item.isFollow" type="primary" color="#00469B" round @click="deleteFavoritess(item)"><el-icon
							style="margin-right: 4px;">
							<Star />
						</el-icon> 已收藏</el-button>
					<el-button v-else type="primary" color="#00469B" plain round @click="putFavoritess(item)"><el-icon
							style="margin-right: 4px;">
							<Star />
						</el-icon> 收藏</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup name="collect">
import {
	getQuery,
	getDetail,
	patchDetail,
	getFavorites,
	putFavorites,
	deleteFavorites,
	patchNoDetail
} from '@/api/report/index'
import { getFiless } from '@/api/report/form.js'
import { ElLoading, ElMessage } from 'element-plus'
const route = useRoute()
const router = useRouter();
const state = reactive({
	followList: [],
	//贷款栏目Id
	dkId: 'a79be166-8bd0-4981-aa3c-d3e836656874',
	//合作金融机构Id
	yhId: '23573f45-30ba-4997-aa75-797638f97b04',
	//栏目formId
	lmformId: '76b8b8f1-ece3-48f6-bc7b-f4f0b3db12ad',
	columnList:[],
	//进入政策id
	jrzcId:'3c206cc8-11b1-4e42-9ebc-19a60bcadc1d'
})
const { followList } = toRefs(state)
onMounted(() => {
	getColumns()
	getFavoritess()
})

//政策中心下栏目
function getColumns() {
	const params = {
		_from: 'public',
		formId: state.lmformId,
		isShow: 'true',
		parentId: '0',
		page: 0,
		size: 10
	}
	getQuery(params).then(res => {
		console.log('res.data.content', res.data.content);
		state.columnList = res.data.content
	})
}
function collectClick(val) {
	val.type = !val.type
}
function getFavoritess(id) {
	getFavorites().then(res => {
		console.log(res, 'res')
		state.followList = res.data.content
		state.followList.map(async val => {
			if (val.payload && val.payload.data && val.payload.data.cover) {
				const resp = await getFiless({ ids: val.payload.data.cover })
				val.payload.data.covers = resp.data[0].url
			}
			val.isFollow = true
		})
	})
}

function putFavoritess(item) {
	putFavorites(item.payload.id).then(res => {
		ElMessage({
			message: '已收藏！',
			type: 'success',
		})
		state.followList.map(async val => {
			if (val.payload.id === item.payload.id) {
				val.isFollow = true
			}
		})
	})
}
function deleteFavoritess(item) {
	deleteFavorites(item.payload.id).then(res => {
		ElMessage({
			message: '收藏已取消！',
			type: 'success',
		})
		state.followList.map(async val => {
			if (val.payload.id === item.payload.id) {
				val.isFollow = false
			}
		})
	})
}

function see(item, type) {
	var columnName = '新闻中心'
	state.columnList.map(val=>{
		if(item.payload.data.columnID.includes(val.id)){
			columnName = val.name
		}
	})
	// if (item.payload.parentId === state.dkId) {
	// 	type = 'dk'
	// } else if (item.payload.parentId === state.yhId) {
	// 	type = 'bank'
	// }
	// router.push({ path: "/details", query: { type: type, id: item.payload.id, formId: item.payload.formId, parentId: item.payload.parentId ,columnName} });
	
	const query = { type: type, id: item.payload.id, formId: item.payload.formId,columnName}
			if (item.payload.data.columnID.includes(state.jrzcId)) {
        query.type = 'jrzc'
      } else if (item.payload.data.columnID.includes(state.dkId)) {
        query.type = 'dk'
      } else if (item.payload.data.columnID.includes(state.yhId)) {
        query.type = 'bank'
      }
      router.push({
        path: '/details',
				query
      })
}
</script>

<style scoped lang="scss">
.collect {

	.card {
		margin-bottom: 40px;
		display: flex;
		justify-content: space-between;

		.le_card {
			width: 260px;
			height: 160px;
			margin-right: 12px;

			img {
				width: 100%;
				max-height: 100%;
			}
		}

		.ri_card {
			flex: 1;

			b {
				font-size: 20px;
				font-family: Microsoft YaHei, Microsoft YaHei-Bold;
				font-weight: 700;
				color: #333333;
				display: block;
				margin-bottom: 14px;
				cursor: pointer;
			}

			.span {
				display: block;
				font-size: 14px;
				font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				font-weight: 400;
				text-align: left;
				color: #999999;
				line-height: 28px;
			}

			.but {
				margin-top: 30px;
				display: flex;
				justify-content: space-between;

				span {
					font-size: 16px;
					font-family: Microsoft YaHei, Microsoft YaHei-Regular;
					font-weight: 400;
					color: #999999;
					line-height: 22px;
				}
			}
		}
	}

	.card:nth-child(1) {
		margin-top: 20px;
	}
}
</style>

