<template>
	<div class="content">
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
						<el-breadcrumb-item>新闻中心</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
					<div class="mbxright">
					<el-menu background-color="transparent" :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
						@select="handleSelect" active-text-color="#00469B">
						<el-menu-item index="1">大会资讯</el-menu-item>
						<el-menu-item index="2">视频播报</el-menu-item>
						<el-menu-item index="3">商务政策</el-menu-item>
						<el-menu-item index="4">峰会镜头</el-menu-item>
					</el-menu>
				</div>
			</div>
		</div>
		<div class="dhzx zfz">
			<div class="title">
				<div v-if="xwColumn[0] && xwColumn[0].data">
					{{ xwColumn[0].data.nameEn }}
					<b>{{ xwColumn[0].name }}</b>
				</div>
				<el-button type="primary" color="#00469B" plain round @click="seelist(xwColumn[0].id)">查看更多></el-button>
			</div>
			<div class="dhzx_list">
				<div class="lb_list">
					<el-carousel :interval="5000" arrow="always">
						<el-carousel-item v-for="item in xwdhColumns" :key="item" @click="see(item, 'news',xwColumn[0].id)">
							<img :src="item.data.covers" alt="">
							<div text="2xl" justify="center" class="title"><span>{{ item.name }}</span></div>
						</el-carousel-item>
					</el-carousel>
				</div>
				<div class="xq_list">
					<div class="bot">
						<div v-for="(item, inx) in xwdhColumn" :key="inx">
							<span class="span1">{{ parseTime(item.createdAt) }}</span>
							<b @click="see(item, 'news',xwColumn[0].id)">{{ item.name }}</b>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="spbbaos">
			<div class="spbbao zfz">
				<div class="title">
					<div v-if="xwColumn[1] && xwColumn[1].data">
						{{ xwColumn[1].data.nameEn }}
						<b>{{ xwColumn[1].name }}</b>
					</div>
					<el-button type="primary" color="#00469B" plain round @click="seelist(xwColumn[1].id)">查看更多></el-button>
				</div>
				<div class="lop">
					<el-carousel :interval="4000" type="card" height="200px" :autoplay="false">
						<el-carousel-item v-for="item in videoColumn" :key="item" @click="see(item, 'news',xwColumn[1].id)">
							<img :src="item.data.covers" alt="">
							<div text="2xl" justify="center" class="title"><span>{{ item.name }}</span></div>
						</el-carousel-item>
					</el-carousel>
				</div>
			</div>
		</div>
		<div class="zcxin zfz">
			<div class="title">
				<div>
					POLICY CENTER
					<b>商务政策</b>
				</div>
				<el-button type="primary" color="#00469B" plain round @click="seelist(zcparentId, zcId)">查看更多></el-button>
			</div>
			<div class="lists">
				<div class="li" v-for="(item, index) in zcColumn" :key="index">
					<div class="lef">
						<b>{{ parseMonth(item.createdAt) }}</b>
						<span>{{ parseYear(item.createdAt) }}</span>
					</div>
					<div class="spans">
						<b @click="see(item, 'news',zcparentId)">{{ item.name }}</b>
						<span>{{ item.summary }}</span>
					</div>
				</div>
			</div>
		</div>

	<!-- 	<div class="video_baos">
			<div class="video_bao zfz">
				<div class="title">
					<div>
						SUMMIT FOOTAGE
						<b>峰会镜头</b>
					</div>
					<el-button type="primary" color="#00469B" plain round>查看更多></el-button>
				</div>
				<div class="btn_video">
					<div class="le_deo">
						<video src=""></video>
						<video src=""></video>
						<video src=""></video>
						<video src=""></video>
					</div>
					<div class="ri_deo">
						<video src=""></video>
					</div>
				</div>
			</div>
		</div> -->
	</div>
</template>

<script setup name="content">
import { ref } from 'vue'
import { getQuery } from "@/api/report/index";
import { getFiless } from "@/api/report/form.js";
const router = useRouter();
const state = reactive({
	//新闻中心栏目
	xwColumn: [],
	//栏目formId
	lmformId: '76b8b8f1-ece3-48f6-bc7b-f4f0b3db12ad',
	//文章formId
	wzformId: '78aaec41-7077-49f6-ae2d-647fd22d1369',
	//新闻栏目Id
	xwId: '26a5c6ca-f364-4910-bf8b-bf02a033309b',
	//商务政策栏目Id
	zcId: '89913bd2-0034-4dab-9107-e5c8f67d4922',
	//新闻大会资讯
	xwdhColumn: [],
	//新闻大会资讯轮播图
	xwdhColumns: [],
	//新闻视频播报
	videoColumn: [],
	//新闻政策
	zcColumn: [],
	zcparentId: ''
})
const { xwColumn, xwdhColumn, xwdhColumns, videoColumn, zcColumn ,zcId,zcparentId} = toRefs(state)
onMounted(() => {
	getColumn()
})
const activeIndex = ref('1')
const handleSelect = (key, keyPath) => {
	console.log(key, keyPath)
}
function jumpNewslist() {
	router.push({ path: "/news/list", query: {} });
}
function jump(item) {
	console.log(item)
	if (item.name == '新闻中心') {
		router.push('/news/list')
	} else if (item.name == '大会概况') {
		router.push('/overview')
	}
}
function see(item, type,parentId) {
	router.push({ path: "/details", query: { type: type, id: item.id, formId: item.formId } });
	if(parentId){
		router.push({ path: "/details", query: { type: type, id: item.id, formId: item.formId ,parentId} });
	}else{
		router.push({ path: "/details", query: { type: type, id: item.id, formId: item.formId } });
	}
}
function seelist(parentId, columnId) {
	if (columnId) {
		router.push({ path: "/news/list", query: { parentId, columnId } });
	} else {
		router.push({ path: "/news/list", query: { parentId } });
	}
}
function getColumn() {
	const params = {
		_from: 'public',
		formId: state.lmformId,
		isShow: 'true',
		columnId: state.xwId,
		page: 0,
		size: 3
	}
	getQuery(params).then(res => {
		state.xwColumn = res.data.content
		console.log('res.data.content', res.data.content);
		getxwdhColumn(state.xwColumn[0].id)
		getxwdhColumns(state.xwColumn[0].id)
		getvideoColumn(state.xwColumn[1].id)
		getzcColumn()
		getcgColumns()
	})
}
//大会咨询
function getxwdhColumn(parentId) {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		parentId,
		page: 0,
		size: 4
	}
	getQuery(params).then(res => {
		state.xwdhColumn = res.data.content
	})
}
function getxwdhColumns(parentId) {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		setHome: 'true',
		cover: 'VALID',
		parentId,
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
//视频
function getvideoColumn(parentId) {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		cover: 'VALID',
		parentId,
		page: 0,
		size: 4
	}
	getQuery(params).then(async res => {
		console.log('res.data.content', res.data.content);
		state.videoColumn = res.data.content
		state.videoColumn.map(async val => {
			const resp = await getFiless({ ids: val.data.cover })
			val.data.covers = resp.data[0].url
		})
	})
}
//商务政策
function getzcColumn() {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		columnID: state.zcId,
		page: 0,
		size: 6
	}
	getQuery(params).then(res => {
		state.zcColumn = res.data.content
	})
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
	})
}
</script>

<style scoped lang="scss">
.content {
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
				width: 460px;
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
			display: flex;

			.el-carousel__item h3 {
				color: #475669;
				opacity: 0.75;
				margin: 0;
				text-align: center;
			}

			.el-carousel__item .title {
				position: relative;
				top: -94px;
				width: 100%;
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
					padding-left: 20px;
				}
			}

			.el-carousel__item img {
				width: 100%;
				height: 100%;
				cursor: pointer;
			}

			.lb_list {
				width: 660px;
				height: 370px;
				background: rgba(0, 0, 0, 0.00);

				::v-deep .el-carousel--horizontal {
					height: 370px;
				}

				::v-deep .el-carousel__container {
					height: 370px;
				}
			}

			.xq_list {
				width: 360px;
				margin-left: 40px;

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
				}

				.top {
					padding-bottom: 14px;
					border-bottom: 1px dashed #CECECE;
				}

				.bot {
					div {
						padding: 22px 0;
						border-bottom: 1px dashed #E5E5E5;

						b {
							font-size: 18px;
							font-family: Microsoft YaHei, Microsoft YaHei-Bold;
							font-weight: 700;
							color: #333333;
							overflow: hidden;
							text-overflow: ellipsis;
							-webkit-line-clamp: 1;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							cursor: pointer;
						}

						.span1 {
							padding-bottom: 4px;
							font-size: 14px;
							font-family: Microsoft YaHei, Microsoft YaHei-Regular;
							font-weight: 400;
							color: #999999;
							line-height: 16.5px;
						}
					}

					div:nth-child(1) {
						padding-top: 8px;
					}
				}
			}
		}
	}
}

.spbbaos {
	min-width: 1200px;
	height: 527px;
	background: url('../../assets/images/spbbao.png') no-repeat;
	background-size: 100% 100%;
	margin-top: 137px;

	.spbbao {
		.title {
			padding-top: 40px;

			div {
				color: #5B87BD;

				b {
					color: #fff;
				}
			}
		}

		.lop {

			.el-carousel__item h3 {
				color: #475669;
				opacity: 0.75;
				margin: 0;
				text-align: center;
			}

			.el-carousel__item .title {
				position: relative;
				top: -86px;
				width: 100%;
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
					padding-left: 20px;
				}
			}

			.el-carousel__item img {
				width: 100%;
				height: 100%;
			}

			::v-deep .el-carousel--horizontal {
				height: 325px;
			}

			::v-deep .el-carousel__container {
				height: 290px !important;
			}
		}

	}
}

.zcxin {
	.title {
		margin-top: 24px !important;
	}

	.lists {
		overflow: hidden;

		.li {
			width: 590px;
			display: flex;
			//justify-content: space-between;
			margin-bottom: 45px;

			.lef {
				border-right: 1px solid #D6D6D6;
				padding-right: 20px;

				b {
					font-size: 28px;
					font-family: Microsoft YaHei, Microsoft YaHei-Regular;
					font-weight: 400;
					color: #333333;
					line-height: 22px;
					display: block;
					margin-bottom: 16px;
				}

				span {
					font-size: 16px;
					font-family: Microsoft YaHei, Microsoft YaHei-Regular;
					font-weight: 400;
					color: #999999;
					line-height: 22px;
				}
			}

			.spans {
				padding-left: 20px;

				b {
					font-size: 18px;
					font-family: Microsoft YaHei, Microsoft YaHei-Bold;
					font-weight: 700;
					color: #333333;
					display: block;
					margin-bottom: 14px;
					overflow:hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 1;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					cursor: pointer;
				}

				span {
					font-size: 14px;
					font-family: Microsoft YaHei, Microsoft YaHei-Regular;
					font-weight: 400;
					color: #999999;
					line-height: 22px;
					overflow:hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 2;
					display: -webkit-box;
					-webkit-box-orient: vertical;

					a {
						color: #0D4FA0;
					}
				}
			}
		}

		.li:nth-child(odd) {
			float: left;
		}

		.li:nth-child(even) {
			float: right;
		}

	}

}

.video_baos {
	min-width: 1200px;
	height: 612px;
	background: url('../../assets/images/fhui.png') no-repeat;
	background-size: 100% 100%;

	.video_bao {
		.title {
			padding: 64px 0 40px 0;
		}

		.btn_video {
			display: flex;
			justify-content: space-between;

			.le_deo {
				video {
					background-color: red;
					width: 290px;
					height: 170px;
					margin: 0 27px 27px 0;
				}

				video:nth-child(even) {
					margin-right: 0;
				}
			}

			.ri_deo {
				video {
					width: 565px;
					height: 368px;
					background-color: red;
				}

			}
		}
	}

}
</style>

