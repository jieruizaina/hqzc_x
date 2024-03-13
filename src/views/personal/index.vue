<template>
	<div class="personal">
		<headers :columnName="columnName"/>
		<navigation />
		<div class="personalCard">
			<div class="lePer">
				<div class="le_top">
					<!-- <div class="img"><img :src="userStore.avatar" alt=""></div> -->
				<userAvatar :user="userStore.avatar" />
					<b>{{ userStore.fullName }}</b>
				</div>
				<div class="le_bot">
					<el-tabs tab-position="left" @tab-click="change">
						<el-tab-pane name="0">
							<template #label>
								<div class="tab_box">
									<div class="tab_text">
										<el-icon>
											<Document />
										</el-icon>
										<span>我的申请</span>
									</div>
									<el-icon>
										<ArrowRight />
									</el-icon>
								</div>
							</template></el-tab-pane>
						<el-tab-pane name="1"><template #label>
								<div class="tab_box">
									<div class="tab_text"><el-icon>
											<Star />
										</el-icon>
										<span>我的收藏</span>
									</div>
									<el-icon>
										<ArrowRight />
									</el-icon>
								</div>
							</template></el-tab-pane>
						<!-- <el-tab-pane name="2"><template #label>
								<div class="tab_box">
									<div class="tab_text"><el-icon>
											<ChatLineSquare />
										</el-icon>
										<span>我的消息</span>
									</div>
									<el-icon>
										<ArrowRight />
									</el-icon>
								</div>
							</template></el-tab-pane> -->
						<el-tab-pane name="3"><template #label>
								<div class="tab_box">
									<div class="tab_text"><el-icon>
											<Edit />
										</el-icon>
										<span>修改资料</span>
									</div>
									<el-icon>
										<ArrowRight />
									</el-icon>
								</div>
							</template></el-tab-pane>
						<el-tab-pane name="4"><template #label>
								<div class="tab_box">
									<div class="tab_text"><el-icon>
											<SwitchButton />
										</el-icon>
										<span>退出登录</span>
									</div>
									<el-icon>
										<ArrowRight />
									</el-icon>
								</div>
							</template></el-tab-pane>
					</el-tabs>
				</div>
			</div>
			<div class="riPer">
				<div class="title">
					<div></div>
					<b>{{ title }}</b>
				</div>
				<div>
					<apply v-show="tabs[0]" />
					<collect v-show="tabs[1]" />
					<!-- <message v-show="tabs[2]" /> -->
					<Report v-show="tabs[3]" :formId="registerformId" :id="registers.id"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup name="personal">
import {
	getQuery,
	getDetail,
	patchDetail,
	getFavorites,
	putFavorites,
	deleteFavorites,
	patchNoDetail
} from '@/api/report/index'
import userAvatar from "../system/user/profile/userAvatar.vue";
import { ElMessageBox } from 'element-plus'
import useUserStore from '@/store/modules/user'
import headers from '../../components/header.vue'
import navigation from '../../components/navigation.vue'
import apply from './apply.vue'
import collect from './collect.vue'
import message from './message.vue'
import Report from '../report/Report'
const route = useRoute()
const router = useRouter();
const userStore = useUserStore()
const state = reactive({
	tabs: [true, false, false],
	title: '我的申请',
	registerformId: 'd5e70b53-9b7e-41bb-b61a-68adf5c705c1',
	columnName:'个人中心',
	userName:'',
	registers:''
})
const { tabs, title ,columnName,userName,registerformId,registers} = toRefs(state)
onMounted(() => {
	getRegister()
})
async function getRegister() {
			const params = {
				formId: state.registerformId,
				page: 0,
				size: 15,
				userId: localStorage.userId
			}
			getQuery(params).then(res => {
				state.registers = res.data.content[0]
				state.userName = res.data.content[0].data.name
				userStore.changeFullName(state.userName)
				console.log('res',res);
			})
		}
function change(tab, event) {
	console.log(tab, event);
	//这样才能获取每个el-tab-pane的name属性
	console.log(tab.props.name);
	if (tab.props.name == 4) {
		return ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			userStore.logOut().then(() => {
				location.href = '/index';
			})
		}).catch(() => { });
	}
	for (let inx = 0; inx < 4; inx++) {
		if (inx == tab.props.name) {
			state.tabs[inx] = true
		} else {
			state.tabs[inx] = false
		}
		switch (tab.props.name) {
			case '1':
				state.title = '我的收藏'
				break;
			case '3':
				state.title = '修改资料'
			//	router.push({ path: '/report', query: { formId: state.registerformId, id: state.registers.id } })
				break;
			default:
				state.title = '我的申请'
				break;
		}
	}
	console.log('state.tabs', state.tabs);
}


</script>
<style scoped lang="scss">
.personal {
	background: #f5f7fd;
	padding-bottom: 40px;

	.personalCard {
		margin: 0 auto;
		margin-top: 20px;
		width: 1200px;
		display: flex;
		justify-content: space-between;

		.lePer {
			width: 300px;
			height: 560px;
			border-radius: 16px;
			padding: 40px 20px;
			background-color: #fff;

			.le_top {
				border-bottom: 1px dashed #E5E5E5;
				display: flex;
				flex-direction: column;
				align-items: center;

				.img {
					width: 140px;
					height: 140px;

					img {
						width: 100%;
						height: 100%;
						border-radius: 50%;

					}
				}

				b {
					font-size: 18px;
					font-family: Microsoft YaHei, Microsoft YaHei-Bold;
					font-weight: 700;
					color: #333333;
					padding: 20px 0 30px 0;
				}
			}

			.le_bot {
				margin-top: 24px;

				::v-deep .el-tabs {
					height: 320px !important;
				}
				::v-deep .el-tabs--left .el-tabs__nav-wrap.is-left::after{
					background-color: transparent;
				}

				::v-deep .el-tabs__item {
					width: 260px;
					height: 64px;
					padding: 0 32px;
					font-size: 18px;
					font-family: Microsoft YaHei, Microsoft YaHei-Regular;
					font-weight: 400;

					.tab_box {
						display: flex;
						justify-content: space-between;
						align-items: center;
						height: 64px;

						.tab_text {
							display: flex;
							align-items: center;

							span {
								padding-left: 8px;
							}
						}
					}
				}

				::v-deep .el-tabs__item.is-active {
					background: #00469b;
					border-radius: 12px;
					color: #FFFFFF;
				}

				::v-deep .el-tabs__active-bar {
					display: none;
				}

				::v-deep .el-tabs__nav {
					background: #fff;
				}
			}
		}

		.riPer {
			background: #fff;
			width: 880px;
			border-radius: 16px;
			padding: 26px 20px;

			.title {
				display: flex;
				align-items: center;
				border-bottom: 1px solid #E9E9E9;
				padding-bottom: 14px;

				div {
					width: 6px;
					height: 18px;
					background: #00469b;
					border-radius: 3px;
					margin-right: 8px;
				}

				b {
					font-size: 18px;
					font-family: Microsoft YaHei, Microsoft YaHei-Bold;
					font-weight: 700;
					color: #333333;
					line-height: 44px;
				}
			}
		}
	}

}
</style>

