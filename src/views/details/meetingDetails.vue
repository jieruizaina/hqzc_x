<template>
	<div class="details">
		<headers :columnName="columnName"/>
		<navigation />
		<div class="content">
			<div class="dhzx_list">
				<div class="card">
					<div class="ri_card">
						<b v-if="jsColumn">{{ jsColumn.name }}</b>
						<span class="span" v-if="jsColumn">{{ jsColumn.summary }}</span>
						<div class="but">
							<el-button type="primary" color="#00469B" plain round @click="see(jsColumn)">查看详情></el-button>
						</div>
					</div>
					<div class="le_card" v-if="jsColumn"><img :src="jsColumn.covers" alt=""></div>
				</div>
			</div>
			<div class="dhzx zfz">
				<div class="title">
					<div>
						LIVE PLAYBACK
						<b>直播回放</b>
					</div>
				</div>
				<div class="vidoes" v-if="jsColumn">
					<video class="video" controls width="365" showPlay :src="(jsColumn)?.videos">
					</video>
				</div>
			</div>
			<div class="chjb zfz">
				<div class="title">
					<div>
						PARTICIPANTS
						<b>参会嘉宾</b>
					</div>
				</div>
				<div class="jblist">
					<div class="jbimg" v-for="(item, index) in jbColumn" :key="index" @click="see(item)">
						<div class="img"><img :src="item.data.covers" alt=""></div>
						<div class="text">
							<b>{{ item.name }}</b>
							<span>{{ item.data.briefTitle }}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="dhyc zfz">
				<div class="title">
					<div>
						PARTICIPANTS
						<b>大会议程</b>
					</div>
				</div>
				<div class="yclist">
					<el-timeline>
						<el-timeline-item :timestamp="item.name" placement="top" color="#3050C5" v-for="(item, index) in ycColumn"
							:key="index">
							<el-card v-for="(sitem, sindex) in item.child" :key="sindex">
								<div class="timg" v-if="sitem.data.covers">
									<img :src="sitem.data.covers" alt="">
								</div>
								<span class="spans">{{ sitem.name }}</span>
							</el-card>
						</el-timeline-item>
					</el-timeline>
				</div>
			</div>
			<div class="dhd zfz">
				<div class="title">
					<div>
						VENUE
						<b>大会地点</b>
					</div>
				</div>
				<div class="dlist">
					<div id="container"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup name="details">
import headers from '../../components/header.vue'
import navigation from '../../components/navigation.vue'
import { shallowRef } from '@vue/reactivity'
import AMapLoader from "@amap/amap-jsapi-loader"
import { getQuery } from "@/api/report/index";
import { getFiless } from "@/api/report/form.js";
import mapIcon from '../../assets/images/map_icon.png';
import { nextTick } from 'vue'
const route = useRoute()
const router = useRouter();
const state = reactive({
	map: shallowRef(null),
	dhId: 'b239bc2a-ab54-447d-892b-5cccdbebb7cb',
	//栏目formId
	lmformId: '76b8b8f1-ece3-48f6-bc7b-f4f0b3db12ad',
	//文章formId
	wzformId: '78aaec41-7077-49f6-ae2d-647fd22d1369',
	ycformId: '81a2c46b-2a6d-4c24-a0ab-a045fac8094f',
	jbColumn: [],
	ycColumn: [
		{ child: [] }
	],
	jbId: '',
	mapIcon: mapIcon,
	jsColumn: {
		name: '',
		id: '',
		covers: '',
	},
	columnName:'新闻中心'
})
const { map, jbColumn, ycColumn, jsColumn,columnName } = toRefs(state)
onMounted(async () => {
	await getcgColumns()
	if(route.query.columnName){
		state.columnName = route.query.columnName
	}
})
//商务政策下栏目
async function getcgColumns() {
	const params = {
		_from: 'public',
		formId: state.lmformId,
		isShow: 'true',
		columnId: state.dhId,
		page: 0,
		size: 3
	}
	getQuery(params).then(async res => {
		console.log('res.data.content', res.data.content);
		await jsArticles(res.data.content[0].id)
		//嘉宾文章列表
		await jbArticles(res.data.content[1].id)
		state.jbId = res.data.content[1].id
		//大会议程
		await ycArticles(res.data.content[2].id)
	})
}
async function jsArticles(parentId) {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		parentId,
		page: 0,
		size: 1
	}
	getQuery(params).then(async res => {
		const ggaoColumns = res.data.content
		ggaoColumns.map(async val => {
			if (val.data.cover) {
				const resp = await getFiless({ ids: val.data.cover })
				state.jsColumn.covers = resp.data[0].url
			} else {
				state.jsColumn.covers = ''
			}
			if (val.data.video) {
				const resp = await getFiless({ ids: val.data.video })
				state.jsColumn.videos = resp.data[0].url
			} else {
				state.jsColumn.videos = ''
			}
		})
		state.jsColumn.name = ggaoColumns[0].name
		state.jsColumn.covers = ggaoColumns[0].data.covers
		state.jsColumn.videos = ggaoColumns[0].data.videos
		state.jsColumn.id = ggaoColumns[0].id
		state.jsColumn.summary = ggaoColumns[0].data.summary
		state.jsColumn.lnglat = ggaoColumns[0].data.lnglat
		console.log('state.jsColumn.lnglat',state.jsColumn.lnglat);
		await initMap()
	})
}
function jbArticles(parentId) {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		parentId,
		page: 0,
		size: 4
	}
	getQuery(params).then(async res => {
		state.jbColumn = res.data.content
		state.jbColumn.map(async val => {
			if (val.data.cover) {
				const resp = await getFiless({ ids: val.data.cover })
				val.data.covers = resp.data[0].url
			} else {
				val.data.covers = ''
			}
		})
	})
}
function ycArticles(parentId) {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		parentId,
		page: 0,
		size: 10
	}
	nextTick(()=>{
	getQuery(params).then(async res => {
		state.ycColumn = res.data.content
		state.ycColumn.map(async val => {
			Reflect.set(val.data, 'covers', '')
			if (val.data.cover) {
				const resp = await getFiless({ ids: val.data.cover })
				val.data.covers = resp.data[0].url
			}
			// val.child = await ycArticlesChild(val.id)
			Reflect.set(val, 'child', await ycArticlesChild(val.id))
		})
		console.log('state.ycColumn', state.ycColumn);
	})

	})
}
async function ycArticlesChild(parentId) {
	const params = {
		_from: 'public',
		formId: state.ycformId,
		parentId,
		page: 0,
		size: 10
	}
	const res = await getQuery(params)
	const ggaoColumns = res.data.content
	ggaoColumns.map(async val => {
		if (val.data.picture) {
			const resp = await getFiless({ ids: val.data.picture })
			val.data.covers = resp.data[0].url
		} else {
			val.data.covers = ''
		}
	})
	return ggaoColumns
}
function see(item, type) {
	router.push({ path: "/details", query: { type: type, id: item.id,columnName:route.query.columnName?route.query.columnName:'新闻中心' } });
}
function seelist() {
	router.push({ path: "/news/list", query: { parentId: state.jbId } });
}
function initMap() {
	console.log('state.jbColumn.data.lnglat', JSON.parse(state.jsColumn.lnglat));

	var lnglat = [117.120128, 36.652069];
	AMapLoader.load({
		key: '12e52a5ea64d59be79d9a4bd71bebf1e', // 申请好的Web端开发者Key，首次调用 load 时必填
		version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
		plugins: [''] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
	}).then((AMap) => {
		if (state.jsColumn.lnglat) {
			let map = new AMap.Map('container', {
				zoom: 12,
				resizeEnable: true,
				center: [JSON.parse(state.jsColumn.lnglat)[0][0],JSON.parse(state.jsColumn.lnglat)[0][1]]
			});
			state.map = map;
			JSON.parse(state.jsColumn.lnglat).map(val => {
				console.log('val',val);
							var marker = new AMap.Marker({
								position: [val[0], val[1]], // 标记当前的坐标
								icon: new AMap.Icon({
									size: new AMap.Size(30, 32),
									image: mapIcon,
									imageSize: new AMap.Size(30, 32)
								})
							});
							state.map.add([marker]);
						});
						// 自适应所有覆盖物
						state.map.setFitView();
		} else {
			let map = new AMap.Map('container', {
				zoom: 12,
				resizeEnable: true,
				center: lnglat
			});
			state.map = map;
		}
	});
}
const initMap2 = async () => {
	AMapLoader.load({
		key: "12e52a5ea64d59be79d9a4bd71bebf1e",             // 申请好的Web端开发者Key，首次调用 load 时必填
		version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
		plugins: [''],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
	}).then((AMap) => {
		map = new AMap.Map("container", {  //设置地图容器id
			viewMode: "3D",    //是否为3D地图模式
			zoom: 5,           //初始化地图级别
			center: [105.602725, 37.076636], //初始化地图中心点位置
		});
	}).catch(e => {
		console.log(e);
	})
}
</script>

<style scoped lang="scss">
.details {
	.content {
		width: 1200px;
		margin: 0 auto;
	}

	.dhzx_list {
		margin-top: 60px;

		.card {
			padding: 40px 0;
			display: flex;
			justify-content: space-between;

			.le_card {
				width: 600px;
				height: 337px;
				margin-left: 19px;

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
				}

				.span {
					display: block;
					font-size: 14px;
					font-family: Microsoft YaHei, Microsoft YaHei-Regular;
					font-weight: 400;
					text-align: left;
					color: #999999;
					line-height: 40px;
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
	}

	.zfz {
		width: 1200px;
		margin: 0 auto;

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

		.vidoes {
			video {
				width: 1199px;
				height: 702px;
				opacity: 0.5;
				background: #000000;
				border-radius: 16px;
			}
		}
	}

	.chjb {
		.jblist {
			overflow: hidden;

			.jbimg {
				border: 2px solid #e1e1e1;
				float: left;
				margin: 0 24px 24px 0;
				cursor: pointer;

				.img {
					background-color: #333333;
					width: 280px;
					height: 320px;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					width: 280px;
					height: 84px;
					border-top: 0;
					padding: 16px 0 0 16px;

					b {
						display: block;
						font-size: 16px;
						font-family: Microsoft YaHei, Microsoft YaHei-Bold;
						font-weight: 700;
						color: #333333;
					}

					span {
						font-size: 14px;
						font-family: Microsoft YaHei, Microsoft YaHei-Regular;
						font-weight: 400;
						color: #999999;
						line-height: 40px;
					}
				}
			}

			.jbimg:nth-child(4n) {
				margin-right: 0;
			}
		}
	}

	.dhyc {
		.yclist {
			::v-deep .el-card {
				margin-top: 24px;
				border: 2px solid #dadfe6;
				border-radius: 16px;

				.is-always-shadow {
					box-shadow: none;
				}
			}

			::v-deep .el-card__body {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

			}

			::v-deep .el-timeline-item__timestamp {
				color: #3050C5;
				font-size: 20px;
				font-family: Microsoft YaHei, Microsoft YaHei-Bold;
				font-weight: 700;
			}

			.timg {
				width: 180px;
				height: 180px;

				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}

			.spans {
				font-size: 18px;
				font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				font-weight: 400;
				color: #333333;
				padding-top: 18px;
			}
		}
	}

	.dhd {
		margin-bottom: 60px;

		.dlist {
			#container {
				width: 1200px;
				height: 560px;
			}
		}
	}
}
</style>

