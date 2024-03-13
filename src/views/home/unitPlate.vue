<template>
	<div class="unitPlate">
		<div class="dh"><img src="../../assets/images/dh.png" alt=""></div>
		<!-- <unitPlateA/> -->
		<unitPlateA/>
		<div class="jr_box">
			<div class="sw_list">
				<div class="title">
					<div>
						FINANCIAL POLICIES FOR ENTERPRISES
						<b>金融惠企政策</b>
					</div>
				</div>
				<!-- <div @click="seeDk(item, 'jrzc', '金融政策')" v-for="item in dkColumn"><span>{{ item.name }}</span></div> -->
				<!-- <el-carousel :interval="4000" type="card" height="200px">
					<el-carousel-item v-for="item in 6" :key="item">
						<h3 text="2xl" justify="center">{{ item }}</h3>
					</el-carousel-item>
				</el-carousel> -->
				<div class="swipers">
					<Swiper3D :source="dkColumnList"></Swiper3D>
				</div>
			</div>
		</div>
		<div class="news">
			<div class="article_list">
				<div @click="jumpZc('金融产品')">
					<span>金融产品</span>
				</div>
				<div @click="jumpDk('贷款政策')">
					<span>我要贷款</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup name="unitPlate">
import unitPlateA from './unitPlate copy.vue'
import { getQuery } from "@/api/report/index";
import { getDictionary } from "@/api/report/dictionary";
import { getFiless } from "@/api/report/form.js";
import useUserStore from '@/store/modules/user'
import Swiper3D from "./components/Swiper3D.vue";
const userStore = useUserStore()
const router = useRouter();
const state = reactive({
	dkColumn: [],
	//栏目formId
	lmformId: '76b8b8f1-ece3-48f6-bc7b-f4f0b3db12ad',
	//文章formId
	wzformId: '78aaec41-7077-49f6-ae2d-647fd22d1369',
	//贷款栏目Id
	dkId: 'a79be166-8bd0-4981-aa3c-d3e836656874',
	//新闻大会资讯栏目Id
	xwdhId: '2f704ad9-b7e0-4939-bf67-a59305ef1837',
	//新闻大会资讯
	xwdhColumn: [],
	//广告位栏目Id
	ggaoId: '32e1052d-bf32-4140-9bd5-7435f2f4d8d6',
	ggaoColumns: [],
	zcparentId: '',
	//商务政策栏目Id
	zcId: '89913bd2-0034-4dab-9107-e5c8f67d4922',
	//金融标签
	tagId: '0d6fcdbc-2fde-44e6-a0d4-bc23a6d87cfe',
	//进入政策id
	jrzcId: '3c206cc8-11b1-4e42-9ebc-19a60bcadc1d',
	swiper: null,
  currentIndex: 0,
	dkColumnList:[]
})
const { dkColumnList, dkColumn, xwdhColumn, xwdhColumns, ggaoColumns, zcparentId, xwdhId, tagId } = toRefs(state)
onMounted(async () => {
	state.dkColumn = await country(state.tagId)
	//await getcgColumns()
	await	getColumn()
})
async function country(dicId) {
	const resp = await getDictionary(dicId)
	const list = resp.data.filter(val => {
		return val.code !== '其他'
	})
	return list
}
//商务政策下栏目
function getcgColumns() {
	const params = {
		_from: 'public',
		formId: state.lmformId,
		isShow: 'true',
		columnId: state.zcId,
		page: 0,
		size: 1
	}
	getQuery(params).then(res => {
		console.log('res.data.content', res.data.content);
		state.zcparentId = res.data.content[0].id
		//金融政策id拿到后请求
		getColumn()
	})
}

function getColumn() {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		customAttribute: '首页',
		parentId: state.jrzcId,
		page: 0,
		size: 5
	}
	getQuery(params).then(res => {
		state.dkColumnList = res.data.content
		state.dkColumnList.map(async val => {
			const resp = await getFiless({ ids: val.data.cover })
			val.data.covers = resp.data[0].url
		})
		console.log('state.dkColumnList',state.dkColumnList);
	})
}
function seeDk(item, type, columnName) {
	console.log('item', item, state.dkColumnList);
	state.dkColumnList.map(val => {
		if (item.code === val.data.financialTag) {
			{
				router.push({ path: "/details", query: { type, id: val.id, formId: val.formId, columnName } });
			}
		}
	})
	//router.push({ path: "/details", query: { type: type, id: item.id, columnName} });
}
function see(item, type, parentId) {
	console.log('item', parentId);
	router.push({ path: "/details", query: { type: type, id: item.id, formId: item.formId, parentId } });
}
function jumpNews(columnName) {
	router.push({ path: "/news", query: { columnName } });
}
function jumpMeeting(columnName) {
	router.push({ path: "/meetingDetails", query: { columnName } });
}
function jumpZc(columnName) {
	//router.push({ path: "/news/list", query: { parentId: state.zcparentId, columnId: state.zcId,columnName } });
	router.push({ path: "/productList", query: { product: state.dkColumn[0].code, columnName: '金融产品' } });
}
function jumpDk(columnName) {
	// router.push({ path: "/news/list", query: { parentId: state.dkId, type: 'dk',columnName } });
	userStore.changeProvide(true)
}

</script>

<style scoped lang="scss">
.unitPlate {
	.dh {
		width: 100%;
		min-height: 412px;

		img {
			width: 100%;
			height: 100%;
			min-height: 412px;
		}
	}

	.jr_box {
		width: 100%;
		height: 712px;
		background: url('../../assets/images/jrzc.png') no-repeat;
		background-size: 100% 100%;
	}
	.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
	.sw_list {
		margin: 0 auto;
		width: 1200px;

		.title {
			padding: 45px 0 32px 0;
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

	.news {
		margin: 60px auto 0;
		width: 1200px;
		display: flex;
		justify-content: space-between;

		.article_list {
			width: 100%;
			display: flex;
			justify-content: space-between;

			div {
				cursor: pointer;
				width: 590px;
				height: 160px;
				background: url('../../assets/images/newCard2.png') no-repeat;
				background-size: 100% 100%;

				span {
					font-size: 40px;
					font-family: Microsoft YaHei, Microsoft YaHei-Bold;
					font-weight: 700;
					text-align: center;
					color: #ffffff;
					letter-spacing: 8px;
					line-height: 160px;
					padding-left: 120px;
				}

				i {
					padding-right: 6px;
					color: #fff;
					font-size: 26px;
				}
			}

			// div:nth-child(even) {
			// 	margin: 0 0 18px 0;
			// }

			div:nth-child(2) {
				background: url('../../assets/images/newCard.png') no-repeat;
				background-size: 100% 100%;
			}
		}

		.el-carousel__item .title {
			position: relative;
			top: -76px;
			width: 630px;
			height: 76px;
			opacity: 0.5;
			background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 8%, #000000 40%);
			white-space: nowrap; // 强制一行显示
			overflow: hidden; // 超出隐藏
			text-overflow: ellipsis;

			span {
				font-size: 16px;
				font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				color: #fff;
				line-height: 76px;
				padding-left: 20px;
			}
		}

		.el-carousel__item img {
			width: 100%;
			height: 100%;
			cursor: pointer;
		}

		.el-carousel__item:nth-child(2n) {
			//background-color: #99a9bf;
		}

		.el-carousel__item:nth-child(2n + 1) {
			//background-color: #d3dce6;
		}

		::v-deep .el-carousel--horizontal {
			height: 264px;
		}

		::v-deep .el-carousel__container {
			height: 264px;

		}

		.lb_list {
			width: 472.5px;
			height: 264px;
			background: rgba(0, 0, 0, 0.00);
		}

		.xq_list {
			width: 360px;

			span {
				display: block;
			}

			b {
				display: block;
				font-size: 15px;
				font-family: Microsoft YaHei, Microsoft YaHei-Bold;
				font-weight: 700;
				color: #00469b;
				letter-spacing: 0.75px;
				line-height: 30px;
			}

			.span1 {
				font-size: 10.5px;
				font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				font-weight: 400;
				color: #999999;
				line-height: 20px;
			}

			.span2 {
				font-size: 12px;
				font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				font-weight: 400;
				color: #666666;
				line-height: 21px;
				margin-bottom: 13px;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden; //溢出内容隐藏
				text-overflow: ellipsis; //文本溢出部分用省略号表示
				display: -webkit-box; //特别显示模式
				-webkit-line-clamp: 2; //行数
				line-clamp: 2;
				-webkit-box-orient: vertical; //盒子中内容竖直排列

			}

			.top {
				padding-bottom: 14px;
				border-bottom: 1px dashed #CECECE;
			}

			.bot {
				div {
					margin-top: 12px;

					b {
						font-size: 13.5px;
						font-family: Microsoft YaHei, Microsoft YaHei-Bold;
						font-weight: 700;
						color: #333333;
						cursor: pointer;
					}

					.span1 {
						font-size: 10.5px;
						font-family: Microsoft YaHei, Microsoft YaHei-Regular;
						font-weight: 400;
						color: #999999;
						line-height: 16.5px;
					}
				}
			}
		}
	}

	.ggao {
		margin: 0 auto;
		width: 1200px;
		height: 135px;

		img {
			width: 100%;
			height: 100%;
		}
	}
}
.swipers{
	position: relative;
	width: 1200px;
	margin: 0 auto;
}
</style>

