<template>
	<div class="details">
		<headers :columnName="columnName" />
		<navigation />
		<div class="content">
			<div class="boxs">
				<div class="box">
					<div class="left_box" :style="'width:' + leWidth">
						<div class="header">
							<div class="title">
								<b>{{ projects.name }}</b>
							</div>
							<div class="ftitle">
								<div class="fcon">
									<el-icon>
										<Compass />
									</el-icon>
									<span>来源：{{ projects.data && projects.data.articleSource ? projects.data.articleSource : '未知' }}</span>
								</div>
								<div class="fcon">
									<el-icon>
										<View />
									</el-icon>
									<span>浏览：{{ projects.data && projects.data.pageview ? projects.data.pageview : 0 }}</span>
								</div>
								<div class="fcon">
									<el-icon>
										<Pointer />
									</el-icon>
									<span>点赞：{{ projects.data && projects.data.likes ? projects.data.likes : 0 }}</span>
								</div>
								<div class="fcon">
									<el-icon>
										<Clock />
									</el-icon>
									<span>发布时间：{{ parseTime(projects.createdAt) }}</span>
								</div>
							</div>
						</div>
						<div class="main">
							<content v-if="isContent" :list='projects' />
							<bankContent v-if="isBankContent" :list='projects' />
							<div class="but">
								<el-button v-show="isDz" type="primary" plain round color="#00469B" v-if='!isLikes' @click="putLikes">
									<el-icon>
										<Pointer />
									</el-icon><span>点赞</span></el-button>
								<el-button v-show="isDz" type="primary" round color="#00469B" v-else @click="deleteLikes">
									<el-icon>
										<Pointer />
									</el-icon><span>已点赞</span></el-button>
								<el-button type="primary" plain round color="#00469B" v-if='!isFollow' @click="putFavoritess"><el-icon>
										<Star />
									</el-icon><span>收藏</span></el-button>
								<el-button type="primary" round color="#00469B" v-else @click="deleteFavoritess"><el-icon>
										<Star />
									</el-icon><span>已收藏</span></el-button>
								<el-button type="primary" round color="#00469B" v-if="isSq"
									@click="sqProject(projects)"><span>立即申请</span></el-button>
								<el-button type="primary" round color="#00469B" v-if="isZc"
									@click="zcProject(projects)"><span>相关产品</span></el-button>
							</div>
							<div class="tags">
								<div class="letag" v-if="projects.data && projects.data.tag && projects.data.tag.length">
									<span class="span1">标签：</span>
									<span class="span2" v-for="item in projects.data.tag" :key='item'>{{ item }}</span>
								</div>
								<div class="letag" v-else>
									<span class="span1">标签：</span>
									<span class="span2">未知</span>
								</div>
								<div class="fx letag">
									<span class="span1">分享：</span>
									<Share :QZone="false" :url="href"></Share>
									<!-- <img src="../../assets/images/qq.png" alt="">
									<img src="../../assets/images/wex.png" alt="">
									<img src="../../assets/images/web.png" alt=""> -->
								</div>
							</div>
						</div>
						<div class="footer">
							<div class="xinx">
								<span>未经允许不得转载</span>
								<el-button type="primary" plain round color="#00469B" v-copyText="href"
									v-copyText:callback="copyTextSuccess">复制文本链接</el-button>
							</div>
							<!-- <div class="sxp">
								<div>
									<span>上一篇</span>
									<b>金融助力商务发展对接大会诚邀您的参...</b>
								</div>
								<div>
									<span>下一篇</span>
									<b>金融助力商务发展对接大会诚邀您的参...</b>
								</div>
							</div> -->
						</div>
					</div>
					<div class="right_box" v-if="riWidth">
						<div class="top_dh" v-if="route.query.columnId">
							<el-menu background-color="transparent" :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
								@select="handleSelect" active-text-color="#00469B">
								<el-menu-item :index="item.id" v-for="item in zcColumns">{{ item.name }}</el-menu-item>
							</el-menu>
							<div class="conr">
								<div v-for="(item, inx) in  zcArticles" :key="inx" @click="see(item, 'news')">
									<b>{{ Number(inx) + 1 }}</b><span>{{ item.name }}</span>
								</div>
							</div>
						</div>
						<div class="btn_dh top_dh" v-if="route.query.parentId">
							<div class="title">
								<b>相关资讯</b>
							</div>
							<div class="conr">
								<div v-for="(item, index) in articles" :key="index" @click="see(item, 'news')">
									<b>{{ Number(index) + 1 }}</b><span>{{ item.name }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup name="details">
import { Share } from 'vue3-social-share';
import 'vue3-social-share/lib/index.css'
import headers from '../../components/header.vue'
import navigation from '../../components/navigation.vue'
import content from './content.vue'
import bankContent from './bankContent.vue'
import { useRoute } from 'vue-router';
import { ref } from 'vue'
import { getToken } from '@/utils/auth'
import { ElMessageBox, ElMessage } from "element-plus";
import { getQuery, getDetail, patchDetail, getFavorites, putFavorites, deleteFavorites, patchNoDetail } from "@/api/report/index";
import { getFiless } from "@/api/report/form.js";
import useUserStore from '@/store/modules/user'
const { proxy } = getCurrentInstance();
const route = useRoute()
const router = useRouter();
const userStore = useUserStore()
const state = reactive({
	leWidth: '868px',
	riWidth: false,
	isContent: false,
	isBankContent: false,
	isSq: false,
	isZc: false,
	isDz: false,
	projects: '',
	isFollow: false,
	isLikes: false,
	href: location.href,
	articles: [],
	//文章formId
	wzformId: '78aaec41-7077-49f6-ae2d-647fd22d1369',
	//栏目formId
	lmformId: '76b8b8f1-ece3-48f6-bc7b-f4f0b3db12ad',
	//多栏目列表
	zcColumns: [],
	zcArticles: [],
	activeIndex: '',
	//贷款formId
	formId: '2df5be1e-3971-44be-94bb-c526625c78e0',
	columnName: '新闻中心'
})
const { isDz, isZc, columnName, leWidth, riWidth, isContent, isBankContent, projects, isSq, isFollow, isLikes, href, articles, zcColumns, zcArticles, activeIndex } = toRefs(state)

// const activeIndex = ref('1')
const handleSelect = (key, keyPath) => {
	console.log(key, keyPath)
	state.activeIndex = key
	getZcArticles(key)
}
watch(() => route.query.id, () => {
	init()
})
onMounted(() => {
	init()
})
function init() {
	console.log('route', router.currentRoute.value.fullPath);
	//贷款页面
	if (route.query.type === 'dk') {
		state.leWidth = '1200px'
		state.riWidth = false
		state.isContent = true
		state.isBankContent = false
		state.isSq = true
		state.isZc = false
		state.isDz = true
		//新闻页面
	} else if (route.query.type === 'news') {
		state.leWidth = '1200px'
		state.riWidth = false
		state.isContent = true
		state.isBankContent = false
		state.isSq = false
		state.isZc = false
		state.isDz = true
		//银行页面
	} else if (route.query.type === 'bank') {
		state.leWidth = '1200px'
		state.riWidth = false
		state.isContent = false
		state.isBankContent = true
		state.isSq = false
		state.isZc = false
		state.isDz = false
	} else if (route.query.type === 'jrzc') {
		state.leWidth = '1200px'
		state.riWidth = false
		state.isContent = true
		state.isBankContent = false
		state.isSq = false
		state.isDz = true
		state.isZc = true
	} else {
		state.leWidth = '1200px'
		state.riWidth = false
		state.isContent = true
		state.isBankContent = false
		state.isSq = false
		state.isZc = false
		state.isDz = true
	}
	if (route.query.id) {
		//详情
		getDetails(route.query.id)
		//收藏列表
		if (getToken()) {
			getFavoritess(route.query.id)
		}
	}

	if (route.query.columnId) {
		getcgColumns(route.query.columnId)
	}
	if (route.query.parentId) {
		getArticles(route.query.parentId)
	}
	if (route.query.columnName) {
		state.columnName = route.query.columnName
	}
}
//相关列表（除去相关推荐的）
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
		state.zcColumns = res.data.content.filter(val => {
			return val.id !== route.query.parentId
		})
		state.activeIndex = state.zcColumns[0].id
		getZcArticles(state.activeIndex)
		console.log('state.zcColumns', state.zcColumns);
	})
}
//相关推荐
function getArticles(parentId) {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		parentId,
		page: 0,
		size: 10
	}
	getQuery(params).then(res => {
		console.log('res.data.content', res.data.content);
		state.articles = res.data.content
		state.articles.map(async val => {
			if (val.data.cover) {
				const resp = await getFiless({ ids: val.data.cover })
				// val.data.covers = resp.data[0].url
				val.data.covers = resp.data[0].url
			}
		})
	})
}
//相关列表
function getZcArticles(parentId) {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		parentId,
		page: 0,
		size: 10
	}
	getQuery(params).then(res => {
		state.zcArticles = res.data.content
		state.zcArticles.map(async val => {
			if (val.data.cover) {
				const resp = await getFiless({ ids: val.data.cover })
				// val.data.covers = resp.data[0].url
				val.data.covers = resp.data[0].url
			}
		})
	})
}
function sqProject(item) {
	// if (getToken()) {
	// 	router.push({ path: "/report", query: { parentId: item.id, parentName: item.name ,formId:state.formId} });
	// } else {
	// 	proxy.$modal.msgError("请先登录！");
	// 	userStore.changeLogin(true)
	// }
	const params = {
		parentID: item.id, parentName: item.name, loanType: [item.data.financialTag, item.id], auditor: item.data.auditor
	}
	userStore.changeProvideList(params)
	userStore.changeProvide(true)
}

function zcProject(item) {
	router.push({ path: "/productList", query: { product: item.data.financialTag, columnName: '金融产品' } });
}
function copyTextSuccess() {
	proxy.$modal.msgSuccess("复制成功");
}
function getDetails(id) {
	getDetail(id).then(res => {
		const list = res.data
		Object.keys(list.data).map(val => {
			if (val === 'tag' && list.data.tag) {
				list.data.tag = list.data.tag.split(',')
			} else if (val === 'likesUserId' && list.data.likesUserId) {
				let likes = list.data.likesUserId.split(',')
				if (likes.includes(localStorage.userId)) {
					state.isLikes = true
				} else {
					state.isLikes = false
				}
			}
		})
		state.projects = list
		//增加浏览量
		patchDetails(id, res.data.data.pageview)
		state.projects.data.pageview = Number(state.projects.data.pageview) + 1
	})
}
//点赞
function putLikes() {
	var num = 1
	if (state.projects.data.likes) {
		num = Number(state.projects.data.likes) + 1
	}
	var likesUserId = localStorage.userId
	if (state.projects.data.likesUserId) {
		likesUserId = likesUserId + ',' + localStorage.userId
		console.log('likesUserId', likesUserId);
	}
	console.log('likesUserId2', likesUserId);
	patchDetail(route.query.id, { likes: num, likesUserId }).then(res => {
		console.log('likesUserId3', likesUserId);
		state.projects.data.likes = num
		state.projects.data.likesUserId = likesUserId
		state.isLikes = true
	})
}
//取消点赞
function deleteLikes() {
	var num = 0
	if (state.projects.data.likes) {
		num = Number(state.projects.data.likes) - 1
	}
	console.log('state.projects.data.likesUserId', state.projects.data.likesUserId);
	var likes = state.projects.data.likesUserId.split(',')
	console.log('localStorage.userId', localStorage.userId);
	var likesUserIds = likes.filter(val => {
		return val !== localStorage.userId
	})
	patchDetail(route.query.id, { likes: num, likesUserId: likesUserIds.join(',') }).then(res => {
		state.projects.data.likes = num
		state.projects.data.likesUserId = likesUserIds.join(',')
		state.isLikes = false
	})
}
function putFavoritess() {
	putFavorites(route.query.id).then(res => {
		ElMessage({
			message: '已收藏！',
			type: 'success',
		})
		state.isFollow = true
	})
}
function deleteFavoritess() {
	deleteFavorites(route.query.id).then(res => {
		ElMessage({
			message: '收藏已取消！',
			type: 'success',
		})
		state.isFollow = false
	})
}
function getFavoritess(id) {
	const followList = []
	getFavorites().then(res => {
		console.log(res, 'res');
		const followListData = res.data.content
		followListData.map(function (val) {
			followList.push(val.modelId)
		})
		if (followList.includes(id)) {
			state.isFollow = true
		} else {
			state.isFollow = false
		}
	})
}
function patchDetails(id, pageview) {
	let num
	if (pageview) {
		num = Number(pageview) + 1
	} else {
		num = 1
	}
	patchNoDetail(id, { pageview: num }).then(res => {
	})
}
function see(item, type) {
	if (route.query.type) {
		type = route.query.type
	}
	if (route.query.columnId) {
		router.push({ path: "/details", query: { type: type, id: item.id, formId: item.formId, columnId: route.query.columnId, parentId: state.activeIndex, columnName: route.query.columnName ? route.query.columnName : '新闻中心' } });
	} else if (route.query.parentId) {
		router.push({ path: "/details", query: { type: type, id: item.id, formId: item.formId, parentId: route.query.parentId, columnName: route.query.columnName ? route.query.columnName : '新闻中心' } });
	} else {
		router.push({ path: "/details", query: { type: type, id: item.id, formId: item.formId, columnName: route.query.columnName ? route.query.columnName : '新闻中心' } });
	}
}
</script>

<style scoped lang="scss">
.details {
	.boxs {
		min-width: 1200px;
		background: #f5f7fd;
		padding: 20px 0 40px 0;

		.box {
			display: flex;
			justify-content: space-between;
			margin: 0 auto;
			width: 1200px;

			.left_box {
				width: 868px;
				background: #ffffff;
				padding: 30px;

				.header {
					border-bottom: 1px solid #DEDEDE;

					.title {
						font-size: 32px;
						font-family: Microsoft YaHei, Microsoft YaHei-Bold;
						font-weight: 700;
						text-align: center;
						color: #333333;
					}

					.ftitle {
						display: flex;
						padding: 26px 0 22px 0;
						justify-content: center;

						.fcon {
							margin: 0 12px;
							font-size: 14px;
							font-family: Microsoft YaHei, Microsoft YaHei-Regular;
							font-weight: 400;
							text-align: left;
							color: #666666;
							letter-spacing: 0.21px;
							display: flex;
							align-items: center;

							.el-icon {
								font-size: 18px;
								padding-right: 4px;
							}

						}
					}

				}

				.main {

					border-bottom: 1px solid #DEDEDE;


					.but {
						display: flex;
						justify-content: center;

						span {
							padding-right: 8px;
						}
					}

					.tags {
						height: 90px;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.letag {
							.span1 {
								font-size: 16px;
								font-family: Microsoft YaHei, Microsoft YaHei-Regular;
								font-weight: 400;
								text-align: left;
								color: #666666;
								line-height: 30px;
								letter-spacing: 0.24px;
							}

							.span2 {
								font-size: 16px;
								font-family: Microsoft YaHei, Microsoft YaHei-Regular;
								font-weight: 400;
								text-align: left;
								color: #333333;
								padding: 0 12px;
								border-right: 1px solid #B7B7B7;
							}

							.span2:last-child {
								border: none;
							}
						}

						.fx {
							display: flex;
							align-items: center;

							img {
								width: 40px;
								height: 40px;
								border-radius: 50%;
								margin-left: 12px;
							}
						}
					}
				}

				.footer {
					.xinx {
						height: 75px;
						display: flex;
						justify-content: space-between;
						align-items: center;

						span {
							font-size: 16px;
							font-family: Microsoft YaHei, Microsoft YaHei-Regular;
							font-weight: 400;
							text-align: left;
							color: #666666;
							line-height: 30px;
							letter-spacing: 0.24px;
						}
					}

					.sxp {
						display: flex;
						justify-content: space-between;
						align-items: center;

						div {
							display: flex;
							flex-direction: column;
							justify-content: center;
							width: 390px;
							height: 88px;
							background: #f8f8f8;
							padding-left: 20px;

							span {
								display: block;
								font-size: 14px;
								font-family: Microsoft YaHei, Microsoft YaHei-Regular;
								font-weight: 400;
								text-align: left;
								color: #666666;
								line-height: 21px;
								letter-spacing: 0.21px;
								padding-bottom: 6px;

							}

							b {
								font-size: 16px;
								font-family: Microsoft YaHei, Microsoft YaHei-Bold;
								font-weight: 700;
								text-align: left;
								color: #333333;
								line-height: 21px;
								letter-spacing: 0.24px;
							}

						}

					}
				}

			}

			.right_box {
				width: 312px;

				.top_dh {
					background: #ffffff;
					height: 446px;
					padding: 0 20px 20px 20px;

					.el-menu {
						display: flex;
						justify-content: space-around;

						li {
							padding: 0 20px;
							width: 68px;
							font-size: 16px;
							font-family: Microsoft YaHei, Microsoft YaHei-Regular;
							font-weight: 400;
							color: #666666;
						}
					}

					::v-deep .el-menu--horizontal>.el-menu-item.is-active {
						font-size: 16px;
						font-family: Microsoft YaHei, Microsoft YaHei-Bold;
						font-weight: 700;
						color: #00469b;
					}

					.conr {
						div {
							margin-top: 18px;
							display: flex;

							b {
								display: inline-block;
								font-size: 14px;
								font-family: Microsoft YaHei, Microsoft YaHei-Bold;
								font-weight: 700;
								text-align: left;
								color: #999999;
								padding-right: 10px;
							}

							span {
								font-size: 14px;
								font-family: Microsoft YaHei, Microsoft YaHei-Regular;
								font-weight: 400;
								color: #333333;
								cursor: pointer;
								overflow: hidden;
								text-overflow: ellipsis;
								-webkit-line-clamp: 1;
								display: -webkit-box;
								-webkit-box-orient: vertical;
							}
						}

						div:nth-child(1) b {
							color: #FE2D46;
						}

						div:nth-child(2) b {
							color: #FF6600;
						}

						div:nth-child(3) b {
							color: #FAA90E;
						}
					}
				}

				.btn_dh {
					margin-top: 16px;

					.title {
						border-bottom: 1px solid #CCCCCC;
						padding: 20px 0 11px 0;
						font-size: 16px;
						font-family: Microsoft YaHei, Microsoft YaHei-Bold;
						font-weight: 700;
						text-align: left;
						color: #00469b;
						line-height: 16.5px;
					}

					.conr {
						div b {
							color: #999999 !important;
						}
					}
				}
			}
		}
	}
}
</style>

