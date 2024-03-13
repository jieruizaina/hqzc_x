<template>
	<div class="case">
		<div class="case_left">
			<img src="../../assets/images/cgals.png" alt="">
		</div>
		<div class="case_right">
			<div class="title">
				<img src="../../assets/images/cgal.png" alt="">
			</div>
			<div class="list">
				<el-carousel indicator-position="outside" :autoplay="false" :loop="false">
					<el-carousel-item v-for="items in cgColumns" :key="items">
						<div class="boxs">
							<div class="box"  v-for="item in items" :key="item" @click="see(item, 'news',cgId)">
								<div>{{ item.num }}<b>{{ item.name }}</b></div>
								<span>{{ item.data.summary }}</span>
							</div>
						</div>
					</el-carousel-item>
				</el-carousel>
				<el-button type="primary" class="but" color="#00469B" @click="seelist()">查看更多></el-button>
			</div>
		</div>
	</div>
</template>

<script setup name="case">
import { getQuery } from "@/api/report/index";
import { getDictionary } from "@/api/report/dictionary";
import { getFiless } from "@/api/report/form.js";
const router = useRouter();
const state = reactive({
	dkColumn: [],
	//栏目formId
	lmformId: '76b8b8f1-ece3-48f6-bc7b-f4f0b3db12ad',
	//文章formId
	wzformId: '78aaec41-7077-49f6-ae2d-647fd22d1369',
	//成功案例栏目Id
	cgId: 'b18d336f-1067-4371-a105-1636b51ca888',
	cgColumns: [],
	columnName:'成功案例'
})
const { cgColumns,cgId,columnName} = toRefs(state)
onMounted(() => {
	getcgColumns()
	// getDictionary('countryTree').then(val=>{
	// 	console.log('val',val);
	// })
})
function getcgColumns() {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		parentId: state.cgId,
		page: 0,
		size: 12
	}
	getQuery(params).then(async res => {
		const list  = res.data.content
		console.log('list',list);
				const item = []
				const item1 = []
				const item2 = []
		list.map((val,inx)=>{
			if(inx+1 <10){
			val.num ='0'+( inx+1)

			}else{
				
			val.num = inx+1
			}
			console.log('inx',inx+1,val.num);
			if(4>inx){
				item.push(val)
			}else if(8>inx){
				item1.push(val)
			}else if(12>inx){
				item2.push(val)
				state.cgColumns[2].push(val)
			}
		})
		state.cgColumns[0] = item
		item1.length && (state.cgColumns[1]=item1 )
		item2.length && (state.cgColumns[2] = item2 )
		//state.cgColumns = res.data.content
		console.log('state.cgColumns',state.cgColumns);
	})
}

function see(item, type,parentId) {
	console.log('item', item);
	router.push({ path: "/details", query:{ type: type, id: item.id, formId: item.formId,parentId ,columnName:state.columnName} });
}
function seelist() {
	router.push({ path: "/news/list", query: {parentId:state.cgId ,columnName:state.columnName} });
}

</script>

<style scoped lang="scss">
.case {
	margin: 0 auto;
	width: 1200px;
	display: flex;
	justify-content: space-between;
	margin-top: 45px;

	.case_left {
		width: 459px;
		height: 375px;

		img {
			width: 100%;
			height: 100%;
		}
	}

	.case_right {
		width: 796px;

		.title {
			width: 288px;
			height: 63.75px;
			margin-bottom: 27px;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.list {
			position: relative;
			height: 285px;

			::v-deep .el-carousel--horizontal {
				height: 285px;
			}

			::v-deep .el-carousel__container {
				height: 250px;
			}

			.but {
				position: absolute;
				right: 0;
				bottom: -10px;
			}

			.boxs {
				.box {
					width: 351px;
					margin-bottom: 20px;
					min-height: 100px;
					cursor: pointer;

					div {
							position: relative;
							font-size: 36px;
							font-family: Microsoft YaHei, Microsoft YaHei-Bold;
							font-weight: 700;
							color: #dde2ed;
							left: 0;
							top: -4px;
						b{
							position: absolute;
							left: 0;
							top: 20px;
							font-size: 13.5px;
							font-family: Microsoft YaHei, Microsoft YaHei-Bold;
							font-weight: 700;
							color: #333333;
							display: block;
							margin-bottom: 10px;
							overflow:hidden;
							text-overflow: ellipsis;
							-webkit-line-clamp: 1;
							display: -webkit-box;
							-webkit-box-orient: vertical;

						}
					}

					span {
						display: block;
						font-size: 10.5px;
						font-family: Microsoft YaHei, Microsoft YaHei-Regular;
						font-weight: 400;
						color: #999999;
						line-height: 16.5px;
						overflow:hidden;   //超出隐藏
						text-overflow:ellipsis;  //溢出显示省略号
						white-space: normal;  //常规默认，会折行
						display:-webkit-box;  
						-webkit-box-orient:vertical;  //子元素排列 vertical（竖排）orhorizontal（横排）
						-webkit-line-clamp:3;/*内容限制的行数 需要几行写几就行*/ 
					}
				}
				.box:nth-child(even){
					float: right;
				}
				.box:nth-child(odd){
					float: left;
				}
			}
		}

		.el-carousel__item h3 {
			display: flex;
			color: #475669;
			opacity: 0.75;
			line-height: 300px;
			margin: 0;
		}

		/* .el-carousel__item:nth-child(2n) {
			background-color: #99a9bf;
		}

		.el-carousel__item:nth-child(2n + 1) {
			background-color: #d3dce6;
		} */
	}
}</style>

