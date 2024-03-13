<template>
	<div class="newList">
		<headers :columnName="columnName" />
		<div class="mbxs">
			<div class="mbx">
				<div class="mbxleft">
					<div class="icon">
						<el-icon>
							<LocationFilled />
						</el-icon>
						<span>当前位置：</span>
					</div>
					<el-breadcrumb :separator-icon="ArrowRight">
						<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>列表页</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
				<div class="mbxright" v-if="isRight">
					<el-menu background-color="transparent" :default-active="activeIndex" :collapse-transition=false class="el-menu-demo" mode="horizontal"
						@select="handleSelect" active-text-color="#00469B">
						<el-menu-item :index="item.id" v-for="item in zcColumns">{{ item.name }}</el-menu-item>
						<!-- <el-menu-item index="2">视频播报</el-menu-item>
						<el-menu-item index="3">商务政策</el-menu-item>
						<el-menu-item index="4">峰会镜头</el-menu-item> -->
					</el-menu>
				</div>
			</div>
		</div>

		<div class="dhzx zfz">
			<div class="title">
				<div v-if="titleList.data">
					{{ titleList.data.nameEn }}
					<b>{{ titleList.name }}</b>
				</div>
			</div>
			<div class="dhzx_list">
				<div class="card" v-for="item in articles" :key="item">
					<div class="le_card" v-if="item.data && item.data.covers"><img :src="item.data.covers" alt=""></div>
					<div class="ri_card">
						<b @click="see(item, 'news')">{{ item.name }}</b>
						<span class="span" v-if="item.data && item.data.summary">{{ item.data.summary }}</span>
						<div class="but">
							<span>{{ parseTime(item.createdAt) }}</span>
							<el-button type="primary" color="#00469B" plain round @click="see(item, 'news')">查看详情></el-button>
						</div>
					</div>
				</div>
				<el-empty :image-size="200" v-if="!articles.length"/>
				<div class="paginations">
					<el-pagination background layout="total,prev, pager, next" :total="total" :page-count="pageCount" class="mt-4"
						@current-change="changeCurrent" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup name="newList">
import headers from '../../components/header.vue'
import { getQuery, getDetail, patchDetail, getFavorites, putFavorites, deleteFavorites } from "@/api/report/index";
import { ref } from 'vue'
import { getFiless } from "@/api/report/form.js";
const route = useRoute()
const router = useRouter();
const state = reactive({
	//栏目formId
	lmformId: '76b8b8f1-ece3-48f6-bc7b-f4f0b3db12ad',
	//文章formId
	wzformId: '78aaec41-7077-49f6-ae2d-647fd22d1369',
	//贷款栏目Id
	dkId: 'a79be166-8bd0-4981-aa3c-d3e836656874',
	//合作银行Id
	yhId: '23573f45-30ba-4997-aa75-797638f97b04',
	articles: [],
	isRight: false,
	titleList: [],
	total: 1,
	pageCount: 1,
	//多栏目列表
	zcColumns: [],
	zcArticles: [],
	activeIndex: '',
	columnName: '新闻中心',
	columnList: [],
	//进入政策id
	jrzcId:'3c206cc8-11b1-4e42-9ebc-19a60bcadc1d'
})
const { articles, isRight, titleList, wzformId, total, pageCount, zcColumns, activeIndex, columnName, columnList } = toRefs(state)
//同栏目切换
watch(() => route.query.parentId, () => {
	if (route.query.columnId) {
		init1()
	}
	if (route.query.columnName) {
		state.columnName = route.query.columnName
	}
})
//搜索时
watch(() => route.query.name, () => {
	init2()
	if (route.query.columnName) {
		state.columnName = route.query.columnName
	}
})
onActivated(() => {
	if (route.query.columnId) {
		init1()
	} else {
		init2()
	}
	if (route.query.columnName) {
		state.columnName = route.query.columnName
	}
})
function init1() {
	state.isRight = true
	state.activeIndex = route.query.parentId
	//多栏目
	getcgColumns(route.query.columnId)
	//栏目对应文章
	getArticles(state.activeIndex)
}
function init2() {
	state.isRight = false
	state.activeIndex = route.query.parentId
	//栏目详情(搜索时没父级id)
	if (state.activeIndex) {
		getDetails(state.activeIndex)
	}
	//搜索时请求所有主栏目信息
	if (route.query.name) {
		getColumns()
	}
	//栏目对应文章
	getArticles(state.activeIndex)
}

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
function getcgColumns(columnId) {
	const params = {
		_from: 'public',
		formId: state.lmformId,
		isShow: 'true',
		columnId: columnId,
		page: 0,
		size: 6
	}
	getQuery(params).then(res => {
		state.zcColumns = res.data.content
	})
}
function getDetails(id) {
	getDetail(id).then(res => {
		const list = res.data
		state.titleList = list
	})
}
function getArticles(parentId, page) {
	var params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		page: page ? page : 0,
		size: 10
	}
	if (route.query.name) {
		params.name = route.query.name
	}
	if (parentId) {
		params.parentId = parentId
	}
	getQuery(params).then(res => {
		state.articles = res.data.content
		state.articles.map(async val => {
			Reflect.set(val.data, 'covers', '')
			if (val.data.cover) {
				const resp = await getFiless({ ids: val.data.cover })
				val.data.covers = resp.data[0].url
			}
		})
		state.total = res.data.totalElements
		state.pageCount = res.data.totalPages
	})
}
function changeCurrent(val) {
	getArticles(state.activeIndex, val - 1)
}

const handleSelect = (key, keyPath) => {
	state.activeIndex = key
	getArticles(key)
}
function see(item, type) {
	if (route.query.type) {
		type = route.query.type
	}
	var columnName = '商务政策'
	state.columnList.map(val=>{
		if(item.data.columnID.includes(val.id)){
			columnName = val.name
		}
	})
	// if (item.parentId === state.dkId) {
	// 	type = 'dk'
	// } else if (item.parentId === state.yhId) {
	// 	type = 'bank'
	// }
	// router.push({ path: "/details", query: { type: type, id: item.id, formId: item.formId, parentId: item.parentId ,columnName} });
	
	const query = { type: type, id: item.id, formId: item.formId,columnName}
			if (item.data.columnID.includes(state.jrzcId)) {
        query.type = 'jrzc'
      } else if (item.data.columnID.includes(state.dkId)) {
        query.type = 'dk'
      } else if (item.data.columnID.includes(state.yhId)) {
        query.type = 'bank'
      }
      router.push({
        path: '/details',
				query
      })
}

</script>

<style scoped lang="scss">
.newList {

	.mbxs {
		min-width: 1200px;
		height: 57px;
		background: #ffffff;

		.mbx {
			margin: 0 auto;
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 1200px;
			height: 100%;
			border-bottom: 1px solid #DEDEDE;

			::v-deep .el-breadcrumb {
				font-size: 14px;
				line-height: normal;
			}

			.mbxleft {
				display: flex;

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

			.mbxright {
				width: 720px;
			}
		}
	}

	.zfz {
		width: 1200px;
		margin: 0 auto;

		.title {
			padding: 45px 0;
			display: flex;
			justify-content: space-between;

			div {
				min-width: 600px;
				font-size: 48px;
				font-family: Microsoft YaHei, Microsoft YaHei-Bold;
				font-weight: 700;
				text-align: left;
				color: #d2dcf1;
				position: relative;

				b {
					font-size: 42px;
					font-family: Microsoft YaHei, Microsoft YaHei-Bold;
					font-weight: 700;
					text-align: center;
					color: #333333;
					position: absolute;
					left: 0;
					top: -14px;
				}
			}
		}
	}

	.dhzx {
		.dhzx_list {
			.card {
				padding: 40px 0;
				display: flex;
				justify-content: space-between;
				border-bottom: 1px dashed #E1E1E1;

				.le_card {
					width: 260px;
					height: 146px;
					margin-right: 16px;

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
						line-height: 24px;
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
				padding-top: 0;
			}

			.paginations {
				padding: 40px 0;
				display: flex;
				justify-content: center;
			}
		}
	}
}
</style>

