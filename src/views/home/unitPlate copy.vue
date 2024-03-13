<template>
	<div class="unitPlate">
		<div class="sw_list">
				<div class="title">
					<div>
						LATEST NEWS
						<b>最新消息</b>
					</div>
				</div>
			</div>
		<div class="news">
			<div class="lb_list">
				<el-carousel :interval="5000" arrow="always">
					<el-carousel-item v-for="item in xwdhColumns" :key="item" @click="see(item, 'news',xwdhId)">
						<img :src="item.data.covers" alt="">
						<div text="2xl" justify="center" class="title"></div>
						<div text="2xl" justify="center" class="title_a"><span>{{ item.name }}</span></div>
					</el-carousel-item>
				</el-carousel>
			</div>
			
			<div class="xq_list">
				<div class="top" v-if="xwdhColumn[0]" @click="see(xwdhColumn[0], 'news',xwdhId)">
					<span class="span1" >{{ parseTime(xwdhColumn[0].createdAt) }}</span>
					<b >{{ xwdhColumn[0].name }}</b>
					<span class="span2" >{{ xwdhColumn[0].summary }}</span>
					<!-- <el-button type="primary" plain color="#00469B" >点击查看</el-button> -->
				</div>
				<div class="bot">
					<div v-if="xwdhColumn[1]">
						<span class="span1">{{ parseTime(xwdhColumn[1].createdAt) }}</span>
						<b @click="see(xwdhColumn[1], 'news',xwdhId)">{{ xwdhColumn[1].name }}</b>
					</div>
					<div v-if="xwdhColumn[2]">
						<span class="span1">{{ parseTime(xwdhColumn[2].createdAt) }}</span>
						<b @click="see(xwdhColumn[2], 'news',xwdhId)">{{ xwdhColumn[2].name }}</b>
					</div>
				</div>
				<div class="more">
					<p></p>
					<el-button type="primary" color="#00469B" plain round @click="seelist()">查看更多></el-button>
				</div>
			</div>
		</div>
		<div class="ggao" v-if="ggaoColumns[0] && ggaoColumns[0].data">
			<a :href="ggaoColumns[0].data.href" target="_blank"><img :src="ggaoColumns[0].data.covers" alt=""></a>
		</div>
	</div>
</template>

<script setup name="unitPlate">
import { getQuery } from "@/api/report/index";
import { getDictionary } from "@/api/report/dictionary";
import { getFiless } from "@/api/report/form.js";
import useUserStore from '@/store/modules/user'
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
	//新闻大会资讯轮播图
	xwdhColumns: [],
	//广告位栏目Id
	ggaoId: '32e1052d-bf32-4140-9bd5-7435f2f4d8d6',
	ggaoColumns: [],
	zcparentId: '',
	//商务政策栏目Id
	zcId: '89913bd2-0034-4dab-9107-e5c8f67d4922',
	//金融标签
	tagId:'0d6fcdbc-2fde-44e6-a0d4-bc23a6d87cfe',
	//进入政策id
	jrzcId:'3c206cc8-11b1-4e42-9ebc-19a60bcadc1d',
})
const { dkColumnList,dkColumn, xwdhColumn, xwdhColumns, ggaoColumns, zcparentId,xwdhId,tagId} = toRefs(state)
onMounted(async() => {
  state.dkColumn = await country(state.tagId)
	console.log('state.dkColumn',state.dkColumn);
	await getcgColumns()
	await getxwdhColumn()
	await getxwdhColumns()
	// getDictionary('countryTree').then(val=>{
	// 	console.log('val',val);
	// })

	//广告文章
	await ggaoArticles(state.ggaoId)
})
async function country(dicId) {
	const resp = await getDictionary(dicId)
	const list = resp.data.filter(val=>{
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
function seelist(){
	router.push({ path: "/news/list", query: {parentId: state.xwdhId, columnName: "最新消息" } });
}
function ggaoArticles(parentId) {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		setHome: 'true',
		cover: 'VALID',
		parentId,
		page: 0,
		size: 1
	}
	getQuery(params).then(async res => {
		state.ggaoColumns = res.data.content
		state.ggaoColumns.map(async val => {
			const resp = await getFiless({ ids: val.data.cover })
			val.data.covers = resp.data[0].url
		})
	})
}
function getColumn() {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		customAttribute:'首页',
		parentId: state.jrzcId,
		page: 0,
		size: 5
	}
	getQuery(params).then(res => {
		state.dkColumnList = res.data.content
	})
}
function getxwdhColumn() {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		parentId: state.xwdhId,
		page: 0,
		size: 3
	}
	getQuery(params).then(res => {
		state.xwdhColumn = res.data.content
	})
}
function getxwdhColumns() {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		setHome: 'true',
		cover: 'VALID',
		parentId: state.xwdhId,
		page: 0,
		size: 4
	}
	getQuery(params).then(async res => {
		state.xwdhColumns = res.data.content
		state.xwdhColumns.map(async val => {
			const resp = await getFiless({ ids: val.data.cover })
			val.data.covers = resp.data[0].url
		})
	})
}
function seeDk(item, type,columnName) {
	console.log('item',item,state.dkColumnList);
	state.dkColumnList.map(val=>{
		if(item.code === val.data.financialTag){{
			router.push({ path: "/details", query: { type, id: val.id, formId: val.formId, columnName} });
		}}
	})
	//router.push({ path: "/details", query: { type: type, id: item.id, columnName} });
}
function see(item, type,parentId) {
	console.log('item', parentId);
	router.push({ path: "/details", query: { type: type, id: item.id, formId: item.formId ,parentId} });
}
function jumpNews(columnName) {
	router.push({ path: "/news", query: {columnName} });
}
function jumpMeeting(columnName) {
	router.push({ path: "/meetingDetails", query: {columnName} });
}
function jumpZc(columnName) {
	//router.push({ path: "/news/list", query: { parentId: state.zcparentId, columnId: state.zcId,columnName } });
	router.push({ path: "/productList", query: { product: state.dkColumn[0].code,columnName:'金融产品' } });
}
function jumpDk(columnName) {
	// router.push({ path: "/news/list", query: { parentId: state.dkId, type: 'dk',columnName } });
	userStore.changeProvide(true)
}

</script>

<style scoped lang="scss">
.unitPlate {
	width: 1200;
	margin: 0 auto;
	margin-top: 20px;
	// padding:40px 160px ;
	.dh {
		margin-top: 20px;
		width: 100%;
		min-height: 412px;

		img {
			width: 100%;
			height: 100%;
		}
	}

	.sw_list {
		margin-top: 40px;
		position: relative;
		// top: -40px;
		margin: 0 auto;
		width: 1200px;
		display: flex;
		align-items: center;
		height: 82.5px;

		div {
			cursor: pointer;
			// background: url('../../assets/images/swcard.png') no-repeat;
			background-size: 100% 100%;
			width: 100%;
			line-height: 82.5px;
			text-align: center;
			// border-bottom: 4px solid #CB181C;

			span {
				padding: 0 10px;
				font-size: 18px;
				font-family: Microsoft YaHei, Microsoft YaHei-Bold;
				font-weight: 700;
				color: #333333;
				overflow:hidden;
				text-overflow: ellipsis;
				-webkit-line-clamp: 1;
				display: -webkit-box;
				-webkit-box-orient: vertical;
			}
		}

		div:nth-child(2) {
			border-bottom: 4px solid #E58D1F;
		}

		div:nth-child(3) {
			border-bottom: 4px solid #0051AA;
		}

		div:nth-child(4) {
			border-bottom: 4px solid #00AA65;
		}

		div:nth-child(5) {
			border-bottom: 4px solid #8E3390;
		}
	}

	.news {
		margin: 0 auto;
		width: 1200px;
		display: flex;
		justify-content: space-between;
		margin-bottom: 27px;
		// padding: 0 260px;
		.article_list {
			width: 418px;

			div {
				cursor: pointer;
				float: left;
				width: 198px;
				height: 123px;
				background: url('../../assets/images/newCard.png');
				margin: 0 18px 18px 0;
				display: flex;
				align-items: center;
				justify-content: center;

				span {
					font-size: 13.5px;
					font-family: Microsoft YaHei, Microsoft YaHei-Regular;
					font-weight: 400;
					color: #ffffff;
				}

				i {
					padding-right: 6px;
					color: #fff;
					font-size: 26px;
				}
			}

			div:nth-child(even) {
				margin: 0 0 18px 0;
			}

			div:nth-child(2) {
				background: url('../../assets/images/newCard2.png');
			}

			div:nth-child(3) {
				background: url('../../assets/images/newCard2.png');
			}
		}
	.title_a {
			position: relative;
			top: -150px;
			width: 630px;
			height: 76px;
			// opacity: 0.5;
			// background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 8%, #000000 40%);
			white-space: nowrap; // 强制一行显示
			overflow: hidden; // 超出隐藏
			text-overflow: ellipsis;
			z-index: 999;

			span {
				font-size: 16px;
				font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				color: #fff;
				line-height: 76px;
				padding-left: 20px;
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
			height: 354px;
		}

		::v-deep .el-carousel__container {
			height: 354px;

		}

		.lb_list {
			width: 630.5px;
			height: 354px;
			background: rgba(0, 0, 0, 0.00);
		}

		.xq_list {
			width: 540px;

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
				font-size: 14.5px;
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
				b{
					color: #00469B;
					font-size: 20px;
				}
			}

			.bot {
				div {
					margin-top: 20px;

					b {
						font-size: 18px;
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
.sw_list {
		margin: 0 auto;
		width: 1200px;

		.title {
			// padding: 45px 0 32px 0;
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
	.more {
		margin-top: 20px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		// margin-top: 28px;
	}
</style>

