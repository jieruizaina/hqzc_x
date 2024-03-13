<template>
	<div class="newList">
		<!-- <headers :columnName="columnName" /> -->
		
		<el-carousel class="my-swipe" >
      		<el-carousel-item v-for="(item,inx) in articlesHome" :key="inx" v-show="item.data && item.data.pcCover">
        		<img :src="item.data.pcCover" alt="" @click="see(item, 'dk')">
      		</el-carousel-item>
			<el-carousel-item>
				<img src="../../assets/images/pcCovers.png" alt="" @click="seeKj()">
			</el-carousel-item>
    	</el-carousel>
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
				<div class="mbxright">
					<!-- <div v-for="(index,item) in zcColumns" :key="index" :index="item.code">
						<p>1:{{ index }}</p>
					</div> -->
					<el-menu background-color="transparent" :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
						@select="handleSelect" active-text-color="#00469B">
						<el-menu-item  v-for="(item,index) in zcColumns" :key="index" :index="item.code">{{ item.name }}</el-menu-item>
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
						<b @click="see(item, 'dk')">{{ item.name }}</b>
						<span class="span" v-if="item.data && item.data.summary">{{ item.data.summary }}</span>
						<div class="but">
							<span>{{ parseTime(item.createdAt) }}</span>
							<el-button type="primary" color="#00469B" plain round @click="see(item, 'dk')">查看详情></el-button>
						</div>
					</div>
				</div>
				<el-empty :image-size="200" v-if="!articles.length" />
				<div class="paginations">
					<el-pagination background layout="total, prev, pager, next" :total="total" @size-change="handleSizeChange"
						:page-count="pageCount" class="mt-4" @current-change="changeCurrent" />
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
import { getDictionary } from "@/api/report/dictionary";
const route = useRoute()
const router = useRouter();
const state = reactive({
	//栏目formId
	lmformId: '76b8b8f1-ece3-48f6-bc7b-f4f0b3db12ad',
	//文章formId
	cpformId: '8f0c3a76-d2ae-42f6-b863-d831017f51ae',
	//贷款栏目Id
	dkId: 'a79be166-8bd0-4981-aa3c-d3e836656874',
	//合作银行Id
	yhId: '23573f45-30ba-4997-aa75-797638f97b04',
	//跨境人民币id
	kjId: '03e73192-d9d9-48fb-9fa4-b3b1709d7424',
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
	//金融标签
	tagId: '0d6fcdbc-2fde-44e6-a0d4-bc23a6d87cfe',
	articlesHome:[]
})
const { articles, isRight, titleList, cpformId, total, pageCount, zcColumns, activeIndex, columnName, columnList,articlesHome,kjId } = toRefs(state)

watch(() => route, (to, from) => {
	//从五大政策过来的
	if (from && from.query.type === 'jrzc') {
		init1()
	}
	if (from && from.name !== 'Details') {
		init1()
	}
}, { deep: true, immediate: true }
)

onActivated(() => {
	init1()
	if (route.query.columnName) {
		state.columnName = route.query.columnName
	}
})
const handleSizeChange = (val) => {
	console.log(`${val} items per page`)
}
async function init1() {
	state.isRight = true
	state.activeIndex = route.query.product
	//多栏目
	//getcgColumns(route.query.columnId)

	state.zcColumns = await country(state.tagId)
	console.log('state.zcColumns', state.zcColumns);
	//栏目对应文章
	getArticles(state.activeIndex)
	getArticlesHome()
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
	getArticlesHome()
}

async function country(dicId) {
	const resp = await getDictionary(dicId)
	return resp.data
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
function getArticlesHome(page) {
      const params = {
        _from: 'public',
        formId: state.cpformId,
        isShow: 'true',
		setHome: 'true',
        page: page ? page : 0,
        size: 3
      }
	  let _this=this
      getQuery(params).then(res => {
        state.articlesHome = res.data.content
		console.log(this);
		state.articlesHome.map(async val => {
			console.log(val.data.pcCover);
			if (val.data.pcCover) {
				const resp = await getFiless({ ids: val.data.pcCover })
				val.data.pcCover = resp.data[0].url
			}
		})
      })
    }
function getArticles(financialTag, page) {
	var params = {
		_from: 'public',
		formId: state.cpformId,
		isShow: 'true',
		page: page ? page : 0,
		size: 10
	}
	if (route.query.name) {
		params.name = route.query.name
	}
	if (financialTag) {
		params.financialTag = financialTag
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
		console.log('state.zcColumns', state.articles);
		state.total = res.data.totalElements
		state.pageCount = res.data.totalPages
	})
}
function changeCurrent(val) {
	getArticles(state.activeIndex, val - 1)
}

const handleSelect = (key, keyPath) => {
	console.log('key', key, keyPath);
	state.activeIndex = key
	getArticles(key)
}
function see(item, type) {
	if (route.query.type) {
		type = route.query.type
	}
	console.log(item.data.columnName);
	router.push({ path: '/details', query: { type: type, id: item.id, formId: item.formId,columnName:item.data.columnName } })
}
function seeKj() {
			router.push({ path: "/crossRmb", query: { parentId: state.kjId } })
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
				width: 690px;
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
.my-swipe {
	width: 100%;
	min-height: 66.41px;
	img{
		width: 100%;
		height: 100%;
	}
}
</style>

