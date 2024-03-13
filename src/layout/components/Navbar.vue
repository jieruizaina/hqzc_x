<template>
	<div class="navbar">
		<div class="nav">
			<div class="left-menu">
				<img src="../../assets/images/logo.png" alt="">
				<!-- <b @click="jumpHome">惠企政策</b> -->
				<div class="content-menu">
					<el-menu background-color="transparent" :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
						@select="handleSelect">
						<el-menu-item index="1">首页</el-menu-item>
						<el-menu-item :index="item.id" v-for="item in zcColumns">{{ item.name }}</el-menu-item>
					</el-menu>
				</div>
			</div>
			<div class="right-menu">
				<!-- <template v-if="appStore.device !== 'mobile'">
					<header-search id="header-search" class="right-menu-item" />
				</template> -->
				<div class="header-search">
					<el-input v-model="search" class="w-50 m-2" placeholder="" @keyup.enter="searchName">
						<template #suffix>
							<el-icon @click="searchName">
								<Search />
							</el-icon>
						</template></el-input>
				</div>
				<div class="lrs">
					<a class="user" href="http://hq.admin.sdcom.gov.cn/" target="_blank" title="管理平台入口"><img
							src="../../assets/images/user.png" alt=""></a>
					<div class="texts texts1" v-show="!getToken()">
						<span @click="changeLogins">登录</span>
					</div>
					<div class="texts" v-show="!getToken()">
						<span @click="changeRegisters">注册</span>
					</div>
					<img v-show="getToken()" :src="userStore.avatar" alt="" class="head" @click="jumpPersonal">
				</div>
				<!-- <div class="avatar-container">
					<el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
						<div class="avatar-wrapper">
							<img :src="userStore.avatar" class="user-avatar" />
							<el-icon><caret-bottom /></el-icon>
						</div>
						<template #dropdown>
							<el-dropdown-menu>
								<router-link to="/user/profile">
									<el-dropdown-item>个人中心</el-dropdown-item>
								</router-link>
								<el-dropdown-item command="setLayout">
									<span>布局设置</span>
								</el-dropdown-item>
								<el-dropdown-item divided command="logout">
									<span>退出登录</span>
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div> -->
			</div>
		</div>
		<!-- 登录 -->
		<Login />
		<!-- 注册 -->
		<Register />
		<!-- 我要贷款 -->
		<Lend />
	</div>
</template>

<script setup>
import Login from '../../views/login.vue'
import Register from '../../views/register.vue'
import Lend from '../../views/lend.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import HeaderSearch from '@/components/HeaderSearch'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { getToken } from '@/utils/auth'
import { getQuery, getDetail, patchDetail, getFavorites, putFavorites, deleteFavorites } from "@/api/report/index";
const router = useRouter();
const state = reactive({
	loginView: false,
	registerView: false,
	//栏目formId
	lmformId: '76b8b8f1-ece3-48f6-bc7b-f4f0b3db12ad',
	//商务政策id
	zcId: '89913bd2-0034-4dab-9107-e5c8f67d4922',
	zcColumns: [],
	search: ''
})
const { loginView, registerView, zcColumns, search } = toRefs(state)
onMounted(() => {
	getcgColumns()
})
function searchName(val) {
	console.log('val', val, state.search);
	if (state.search) {
		router.push({ path: "/searchList", query: { columnName: '搜索内容', name: state.search } });
	} else {
		ElMessage({
			message: '请输入搜索内容！',
			type: 'warning',
		})
	}
}

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
		console.log('zcColumns', res);
	})
}
function seelist(parentId) {
	router.push({ path: "/news/list", query: { parentId, columnId: state.zcId } });
}
const activeIndex = ref('1')
const handleSelect = (key, keyPath) => {
	if (key === '1') {
		router.push({ path: "/" });
	} else {
		router.push({ path: "/news/list", query: { parentId: key, columnId: state.zcId, columnName: '商务政策' } });
	}
}
const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
function toggleSideBar() {
	appStore.toggleSideBar()
}

function changeLogins() {
	userStore.changeLogin(true)
}
function changeRegisters() {
	userStore.changeRegister(true)
}
function jumpPersonal() {
	router.push({ path: "/personal", query: {} });
}
function jumpHome() {
	router.push({ path: "/", query: {} });
}

function handleCommand(command) {
	switch (command) {
		case "setLayout":
			setLayout();
			break;
		case "logout":
			logout();
			break;
		default:
			break;
	}
}

function logout() {
	ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		userStore.logOut().then(() => {
			location.href = '/index';
		})
	}).catch(() => { });
}

const emits = defineEmits(['setLayout'])
function setLayout() {
	emits('setLayout');
}
</script>

<style lang='scss' scoped>
@media only screen and (max-width: 1200px) {
	.navbar {
		.nav {
			padding: 0 !important;

		}
	}
}

.navbar {
	height: 66.5px;
	overflow: hidden;
	position: relative;
	min-width: 1200px;

	.nav {
		height: 100%;
		min-width: 1200px;
		padding: 0 75px 0 75px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 2px solid #66B4EA;
	}

	.right-menu {
		float: right;
		height: 100%;
		line-height: 64.5px;
		display: flex;

		&:focus {
			outline: none;
		}

		.lrs {
			display: flex;
			align-items: center;

			.user {
				cursor: pointer;
				margin: 0 29px;
				width: 24.75px;
				height: 24px;
				display: flex;
				align-items: center;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.texts {
				cursor: pointer;
				width: 30px;
				font-size: 13.5px;
				font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				font-weight: 400;
				text-align: center;
				color: #333333;
			}

			.texts1 {
				margin-right: 18px;
			}

			.head {
				cursor: pointer;
				width: 34px;
				height: 34px;
				border-radius: 50%;

			}
		}

		.right-menu-item {
			display: inline-block;
			padding: 0 8px;
			height: 100%;
			font-size: 18px;
			color: #5a5e66;
			vertical-align: text-bottom;

			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;

				&:hover {
					background: rgba(0, 0, 0, 0.025);
				}
			}
		}

		.avatar-container {
			margin-right: 40px;

			.avatar-wrapper {
				margin-top: 5px;
				position: relative;

				.user-avatar {
					cursor: pointer;
					width: 40px;
					height: 40px;
					border-radius: 10px;
				}

				i {
					cursor: pointer;
					position: absolute;
					right: -20px;
					top: 25px;
					font-size: 12px;
				}
			}
		}
	}

	.content-menu {
		width: 700px;
	}
}

.left-menu {
	display: flex;
	align-items: center;
	img{
		width: 86px;
		height: 34px;
		margin-right: 8px;
	}
	b {
		min-width: 87px;
		margin-right: 105px;
		display: block;
		font-size: 19.54px;
		font-family: Microsoft YaHei, Microsoft YaHei-Bold;
		font-weight: 700;
		text-align: left;
		color: #333333;
		letter-spacing: 0.98px;
		text-shadow: 0px 2.09px 4.19px 0px rgba(0, 0, 0, 0.16);
	}
}

::v-deep .el-menu--horizontal>.el-menu-item.is-active {
	color: #00469B !important;
	font-size: 13.5px;
	font-family: Microsoft YaHei, Microsoft YaHei-Bold;
	font-weight: 700;
	text-align: center;
	border-bottom: 2px solid #00469B;
}

::v-deep .el-menu--horizontal {
	border: none;
}

.header-search {
	font-size: 0 !important;

	::v-deep .el-input__wrapper {
		border-radius: 18px;
		min-width: 240px;
	}
}</style>
