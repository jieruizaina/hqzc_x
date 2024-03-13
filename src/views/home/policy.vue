<template>
	<div class="policy">
		<div class="titles">
			<div class="title">
				<div>
					BUSINESS POLICIES FOR ENTERPRISES
					<b>商务惠企政策</b>
				</div>
			</div>
		</div>
		<div class="box">
			<div class="left"><img src="../../assets/images/zc001.png" alt=""></div>
			<div class="content">
				<div v-for="(item, inx) in zcColumns" :key="inx" @click="seelist(item.id)" :class="item.style">
					<!-- <b class="name">{{ item.name }}</b>
					<span class="nameEn">{{ item.data.nameEn }}</span> -->
				</div>
				<!-- <div @click="seelist(zcColumns[0].id)"><img src="../../assets/images/zc002.png" alt=""></div>
				<div @click="seelist(zcColumns[1].id)"><img src="../../assets/images/zc003.png" alt=""></div>
				<div @click="seelist(zcColumns[2].id)"><img src="../../assets/images/zc004.png" alt=""></div>
				<div @click="seelist(zcColumns[3].id)"><img src="../../assets/images/zc005.png" alt=""></div> -->
			</div>
			<div class="right"><img src="../../assets/images/zc006.png" alt=""></div>
		</div>
	</div>
</template>

<script setup name="policy">
import { getQuery, getDetail, patchDetail, getFavorites, putFavorites, deleteFavorites } from "@/api/report/index";
const route = useRoute()
const router = useRouter();
const state = reactive({
	//栏目formId
	lmformId: '76b8b8f1-ece3-48f6-bc7b-f4f0b3db12ad',
	//商务政策id
	zcId: '89913bd2-0034-4dab-9107-e5c8f67d4922',
	zcColumns: [],
	columnName: '商务政策'
})
const { zcColumns } = toRefs(state)
onMounted(() => {
	getcgColumns()
})
function getcgColumns() {
	const params = {
		_from: 'public',
		formId: state.lmformId,
		isShow: 'true',
		columnId: state.zcId,
		page: 0,
		size: 6
	}
	getQuery(params).then(res => {
		state.zcColumns = res.data.content
		state.zcColumns.map((val, inx) => {
			if (inx == 0) {
				val.style = 'policy_a'
			} else if (inx == 1) {
				val.style = 'policy_b'
			} else if (inx == 2) {
				val.style = 'policy_c'
			} else if (inx == 3) {
				val.style = 'policy_d'
			} else if (inx == 4) {
				val.style = 'policy_e'
			} else if (inx == 5) {
				val.style = 'policy_f'
			}
		})
		console.log('zcColumns', res);
	})
}
function seelist(parentId) {
	router.push({ path: "/news/list", query: { parentId, columnId: state.zcId, columnName: state.columnName } });
}
</script>

<style scoped lang="scss">
.policy {
	margin-top: 20px;
	margin-bottom: 45px;

	.titles {
		margin: 0 auto;
		width: 1200px;

	}

	// .title {
	// 	width: 288px;
	// 	height: 65.25px;
	// 	margin-bottom: 32px;

	// 	img {
	// 		width: 100%;
	// 		height: 100%;
	// 	}
	// }

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

	.box {
		display: flex;

		.left {
			width: calc((100vw - 1200px)/2);
			height: 650px;
			margin-right: 1px;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.content {
			width: 1200px;
			margin: 0 auto;
			display: flex;

			div {
				width: 215px;
				margin: 0 1px;
				cursor: pointer;
				display: flex;
				justify-content: center;
				overflow: hidden; //保证布局不会崩掉

				img {
					width: 100%;
					height: auto;
				}

				.name {
					width: 56px;
					line-height: 54px;
					font-size: 30px;
					font-family: Microsoft YaHei, Microsoft YaHei-Bold;
					font-weight: 700;
					color: #ffffff;
					writing-mode: tb-rl;
					margin-top: 53px;
					letter-spacing: 10px;
					direction: ltr !important;
					/*设置文字在FF中竖排*/
					direction: inherit;
				}

				.nameEn {
					height: 410px;
					width: 40px;
					line-height: 38px;
					writing-mode: tb-rl;
					font-size: 30px;
					font-family: Microsoft YaHei, Microsoft YaHei-Bold;
					font-weight: 700;
					color: #ffffff;
					margin-top: 45px;
					letter-spacing: 0.4px;
					direction: ltr !important;
					/*设置文字在FF中竖排*/
					direction: inherit;
				}
			}

			.policy_a {
				background: url('../../assets/images/zc002.png') no-repeat;
				background-size: 100% 100%;
				height: 710px;
			}

			.policy_b {
				background: url('../../assets/images/zc003.png') no-repeat;
				background-size: 100% 100%;
				height: 650px;
			}

			.policy_c {
				background: url('../../assets/images/zc004.png') no-repeat;
				background-size: 100% 100%;
				height: 710px;
			}

			.policy_d {
				background: url('../../assets/images/zc005.png') no-repeat;
				background-size: 100% 100%;
				height: 650px;

				.nameEn {
					width: 80px;

				}
			}

			.policy_e {
				background: url('../../assets/images/zc011.png') no-repeat;
				background-size: 100% 100%;
				height: 710px;

				.nameEn {
					width: 80px;

				}
			}

			.policy_f {
				background: url('../../assets/images/zc012.png') no-repeat;
				background-size: 100% 100%;
				height: 650px;
			}
		}

		.right {
			width: calc((100vw - 1200px)/2);
			height: 650px;
			margin-left: 1px;

			img {
				width: 100%;
				height: 100%;
			}
		}
	}

}</style>

