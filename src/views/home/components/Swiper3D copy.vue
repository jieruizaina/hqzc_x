<template>
	<div class="banner-box" ref="root">
		<!-- <div>{{source}}</div> -->
		<div class="wrapper">
			<div v-for="(item, index) in data.source" :key="index" :class="item.className" :style="item.sty"
				@click="slideClick(index)">
				<!-- <img :src="item.pic" alt="" />
        <div class="mark"></div>
        <p class="detail">
          <span>{{ item.descript.name }}</span>
          <span>身份：{{ item.descript.identity }}</span>
          <span>梦想：{{ item.descript.dream }}</span>
        </p> -->
				<div class="card_box">
					<div class="top">
						<div class="img">
							<img :src="item.pic" alt="">
						</div>
						<div class="img_right">
							<b>鲁贸贷</b>
							<span>“鲁贸贷”以财政杠杆撬动金融资本，通过建立“政府+银行+信保”合作机制，以出口信保保单赔付和政府风险补偿资金赔付作为承办银行贷款增信手段，向符合条件的中小微外贸企业提供优惠贷款，为企业拓宽融资渠道、降低融资成本。</span>
						</div>
					</div>
					<div class="bottom">
						<div class="iocns">
							<div class="iocns1">
								<el-icon>
									<Pointer />
								</el-icon>
							</div>
							<div class="iocns1">
								<el-icon>
									<Star />
								</el-icon>
							</div>
						</div>
						<el-button type="primary" color="#00469B" plain>查看详情</el-button>
					</div>
				</div>
			</div>
		</div>
		<a href="javascript:;" class="left" @click="changeSlide('left')"></a>
		<a href="javascript:;" class="right" @click="changeSlide('right')"></a>
	</div>
</template>

<script>
import { reactive, ref, toRefs } from "@vue/reactivity";
import { watch } from "vue";
import { onMounted } from "@vue/runtime-core";
import debounce from "../tool/debounce"
export default {
	name: "Swiper3D",
	props: {
		source: {
      type: Array,
			required: true,
			default() {
				return [];
			},
		},
		initial: {
			type: Number,
			default: 0,
		},
		interval: {
			type: Number,
			default: 2000000,
		},
	},
	setup(props) {
		// 获取父组件的数据
		let source =  props.source;
		// // 商品数据不足5个 补足5个
		// let diff = 5 - source.length;
		// if (diff > 0 && diff !== 4) {
		// 	for (let i = 0; i < diff; i++) {
		// 		console.log('source[source.length - 1]',source);
		// 		source.push({
		// 			...source[i],
		// 			id: parseInt(source[source.length - 1].id + 1),
		// 		});
		// 	}
		// }
    // 初始化主题样式
		
		// nextTick(() => {
		// var source =  props.source;
		// })
		// watch(
		// 	() => props.source,
		// 	(newV, oldV) => {
		// 		console.log('newV, oldV', newV, oldV);
		// 		if (newV.length) {
		// 		}

		// 	},
		// 	{
		// 		immediate: true,
		// 		deep: true
		// 	}
		// );
		
					// 处理每一项的样式
					const computed = (initial, source) => {
						// console.log('处理样式')
						if (initial < 0) initial = 0;
						let len = source.length,
							temp1 = initial - 2 < 0 ? initial - 2 + len : initial - 2,
							temp2 = initial - 1 < 0 ? initial - 1 + len : initial - 1,
							temp3 = initial,
							temp4 = initial + 1 >= len ? initial + 1 - len : initial + 1,
							temp5 = initial + 2 >= len ? initial + 2 - len : initial + 2;
						return source.map((item, index) => {
							let transform = `translate(-50%, -50%) scale(0.7)`,
								zIndex = 0,
								className = "slide";
							switch (index) {
								case temp3:
									transform = `translate(-50%, -50%) scale(1)`;
									className = ["slide", "activate"];
									zIndex = 3;
									break;
								case temp1:
									transform = `translate(-100%, -50%) scale(0.7)`;
									zIndex = 1;
									break;
								case temp5:
									transform = `translate(0%, -50%) scale(0.7)`;
									zIndex = 1;
									break;
								case temp2:
									transform = `translate(-75%, -50%) scale(0.85)`;
									zIndex = 2;
									break;
								case temp4:
									transform = `translate(-25%, -50%) scale(0.85)`;
									zIndex = 2;
									break;
							}
							item.sty = {
								transform,
								zIndex,
							};
							item.className = className;
							return item;
						});
					};
					source = computed(props.initial, source);
					let data = reactive({
						initial: props.initial,
						source,
					});
					// 监听data.initial变化，每次变化 重新渲染样式
					watch(
						() => data.initial,
						(newV, oldV) => {
							console.log(newV);
							data.source = computed(newV, data.source);
							console.log(data.source)
						},
							{
								immediate: true,
								deep: true
							}
					);
					// 处理自动轮播
					let timer = null;
					const autoPlay = () => {
						timer = setInterval(() => {
							// console.log(data.initial);
							data.initial++;
							// console.log(data.source.length)
							if (data.initial >= data.source.length) {
								data.initial = 0;
							}
						}, props.interval);
					};
					// 鼠标移入移除效果
					let root = ref(null);
					onMounted(() => {
						clearInterval(timer);
						autoPlay();
						const box = root.value;
						box.onmouseenter = () => clearInterval(timer);
						box.onmouseleave = () => autoPlay();
					});
					// 点击哪张图片 哪张图片就到第一个
					function slideClick(index) {
						data.initial = index;
					}

					// 点击左右按钮切换图片
					function h(dir) {
						if (dir === "left") {
							clearInterval(timer)
							data.initial++;
							data.initial >= data.source.length ? (data.initial = 0) : false;
							return;
						}
						data.initial--;
						data.initial < 0 ? (data.initial = data.source.length - 1) : false;
					}
					// 左右切换图片设置防抖效果
					function changeSlide(dir) {
						debounce(h, 200, dir)
					}
					return {
						data,
						root,
						slideClick,
						changeSlide,
					};
		
	},
};
</script>

<style scoped lang="scss">
.banner-box {
	width: 100%;
	height: 360px;
	position: absolute;
	top: 80px;
	left: 50%;
	transform: translate(-50%, -50%);
}

.wrapper {
	width: 100%;
	height: 100%;
	position: relative;
	/* transition: 0.5s; */
}

.slide {
	width: 730px;
	height: 100%;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	transition: 0.5s;
	background: linear-gradient(125deg, #bde2f7 7%, #ecf8fe 43%, #dbf8da 94%);
	box-shadow: 0px 3px 30px 0px rgba(123, 123, 123, 0.20);
	/* background-color: azure; */
}

img {
	height: 100%;
	width: 100%;
	vertical-align: bottom;
}

.mark {
	position: absolute;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
}

.mark:hover {
	background-color: rgba(0, 0, 0, 0);
}

.activate .mark {
	background-color: rgba(0, 0, 0, 0);
}

.detail {
	display: flex;
	flex-direction: column;
	/* padding: 10px 0px; */
	position: absolute;
	bottom: 0;
	color: #fff;
	background-color: rgba(0, 0, 0, 0.5);
	max-height: 0px;
	overflow: hidden;
	transition: 0.2s;
	font-size: 14px;
	width: 100%;
}

.detail span {
	margin: 2px 10px;
}

.slide:hover .detail {
	max-height: 100%;
	padding: 5px 0px;
}

a.left {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	left: 0px;
	z-index: 9;
	/* background-color: black; */
	width: 50px;
	height: 50px;
	background-image: url('../../../assets/images/left.png');
	background-size: contain;
}

a.right {
	position: absolute;
	top: 50%;
	right: 0px;
	transform: translateY(-50%);
	z-index: 9;
	width: 50px;
	height: 50px;
	background-image: url('../../../assets/images/right.png');
	background-size: contain;
}

.card_box {
	padding: 32px;

	.top {
		display: flex;
		justify-content: space-between;

		.img {
			width: 260px;
			height: 216px;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.img_right {
			flex: 1;
			margin-left: 24px;

			b {
				display: block;
				font-size: 24px;
				font-family: Microsoft YaHei, Microsoft YaHei-Bold;
				font-weight: 700;
				text-align: left;
				color: #333333;
			}

			span {
				font-size: 16px;
				font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				font-weight: 400;
				text-align: left;
				color: #333333;
				line-height: 32px;
				//超出两行省略号
				display: -webkit-box;
				overflow: hidden;
				-webkit-box-orient: vertical;
				line-clamp: 5;
				-webkit-line-clamp: 5; //显示几行
			}
		}
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 32px;

		.iocns {
			width: 124px;
			display: flex;
			justify-content: space-between;

			.iocns1 {
				width: 50px;
				height: 50px;
				background: #ffffff;
				border-radius: 24px;
				display: flex;
				justify-content: center;
				align-items: center;

				.el-icon {
					font-size: 24px;
					color: #acb4c9;
				}
			}
		}
	}
}
</style>
