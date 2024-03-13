<template>
	<div class="provide">
		<el-dialog title="我要贷款" v-model="userStore.isProvide" width="440px" append-to-body style="margin-top: 10vh"
			@close="changeProvides">
			<el-form ref="registerRef" :model="formValidate" :rules="ruleValidate" class="provide-form" label-position="top">
				<el-form-item label="贷款类型" prop="loanType">
					<!--  <Select
            v-model="formValidate.loanType"
            placeholder="请输入"
          >
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select> -->
					<el-cascader :options="loanTypeList" v-model="formValidate.loanType" @change='change' />
				</el-form-item>
				<el-form-item label="企业名称" prop="corporation">
					<el-input type="text" size="large" auto-complete="off" v-model="formValidate.corporation"
						placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input type="text" size="large" auto-complete="off" v-model="formValidate.name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="tel">
					<el-input type="text" size="large" auto-complete="off" v-model="formValidate.tel" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="验证码" prop="code" v-if='!token'>
					<el-input type="text" size="large" auto-complete="off" v-model="formValidate.code" placeholder="请输入"
						style="width: 220px;"></el-input>
					<el-button @click.stop="sendMobileCode" size="mini" type="primary" style="margin-left: 10px" :disabled="isDisabled"
						v-if="show">发送验证码</el-button>
					<el-button size="mini" type="primary" style="margin-left: 10px" v-if="!show" disabled>{{
						countdown
					}}秒后重发</el-button>
				</el-form-item>
				<!-- 未登录并且没有注册显示 -->
				<el-form-item label="政策需求（可多选）" v-if="!token&& usage==='register'">
					<el-checkbox-group v-model="formValidate.policyNeeds">
						<el-checkbox :label="item.id" name="type" v-for="(item,inx) in zcList" :key="inx">{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item>
					<el-button size="large" type="primary" style="width:100%;" @click="handleSubmit('registerRef')">提交</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script setup>
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getQuery, getDetail } from "@/api/report/index";
import request from '@/utils/request'
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import useUserStore from '@/store/modules/user'
const { proxy } = getCurrentInstance();
const userStore = useUserStore()
const route = useRoute()
const router = useRouter();
const state = reactive({
	showOverlay: false,
	//默认登录
	usage: 'login',
	//新贷款列表
	formId: '2df5be1e-3971-44be-94bb-c526625c78e0',
	id: '',
	//产品formId
	cpformId: '8f0c3a76-d2ae-42f6-b863-d831017f51ae',
	//贷款栏目Id
	dkId: 'a79be166-8bd0-4981-aa3c-d3e836656874',
	//金融标签
	tagId: '0d6fcdbc-2fde-44e6-a0d4-bc23a6d87cfe',
	weight: 0,
	loanTypeList: [],
	countdown: 0,
	show: true,
	isDisabled:false,
	token: getToken(),
	userToken: '',
	loading: null,
	//金融产品信息固定
	jrItem:{
		id:'a79be166-8bd0-4981-aa3c-d3e836656874',
		name:'金融'
	},
	//商务政策id
	zcId:'89913bd2-0034-4dab-9107-e5c8f67d4922',
	//政策需求
	zcList:[],
	//栏目formId
	lmformId: '76b8b8f1-ece3-48f6-bc7b-f4f0b3db12ad',
})
const { showOverlay, usage, formId, id, cpformId, dkId, tagId, weight, loanTypeList, countdown, show, token, userToken,isDisabled ,zcList} = toRefs(state)
const formValidate = ref({
	name: '',
	loanType: '',
	corporation: '',
	tel: '',
	code: '',
	parentID: '',
	parentName: '',
	auditor: '',
	policyNeeds:[]
});
const ruleValidate = {
	name: [
		{ required: true, message: '请输入', trigger: 'blur' }
	],
	loanType: [
		{ type: 'array', required: true, message: '请选择', trigger: 'change' }
	],
	corporation: [
		{ required: true, message: '请输入', trigger: 'blur' }
	],
	code: [
		{ required: true, message: '请输入', trigger: 'blur' }
	],
	tel: [
		{ required: true, message: "手机号不能为空", trigger: "blur" },
		{ min: 11, message: "手机号格式不正确", trigger: "blur" }, {
			pattern: /^[1][3,5,6,7,8,9][0-9]{9}$/,
			message: '请输入正确的手机号码',
		},
	]
}

watch(() => userStore.isProvide, (val) => {
	if (val) {
		init()
	}
})

function getcgColumns() {
	const params = {
		_from: 'public',
		formId: state.lmformId,
		isShow: 'true',
		columnId: state.zcId,
		page: 0,
		size: 7
	}
	getQuery(params).then(res => {
		const zcColumns = res.data.content
		state.zcList = []
		state.zcList.push(state.jrItem)
		zcColumns.map(val=>{
			console.log('val',val);
			state.zcList.push({
				id:val.id,
				name:val.name
			})
		})
	})
}
async function init() {
	//修改审核赋值
	if (userStore.provideList && userStore.provideList.id) {
		state.id = userStore.provideList.id
		getDetails(userStore.provideList.id)
	}
	//贷款产品级联字典
	const list = await country(state.tagId)
	for (let inx = 0; inx < list.length; inx++) {
		var children = []
		children = await getArticles(list[inx].code)
		if (children.length) {
			state.loanTypeList.push({
				value: list[inx].code,
				label: list[inx].name,
				children
			})
		}
	}
	// list.map(async val=>{
	//   var children = []
	//   children = await getArticles(val.code)
	//   if(children.length){
	//     state.loanTypeList.push({
	//       value:val.code,
	//       label:val.name,
	//       children
	//     })
	//   }
	// })
	//从立即申请页进来，赋值贷款
	if (userStore.provideList && userStore.provideList.loanType) {
		formValidate.value.loanType = userStore.provideList.loanType
	}
	//从立即申请页进来，赋值审核人id
	if (userStore.provideList && userStore.provideList.auditor) {
		formValidate.value.auditor = userStore.provideList.auditor
	}
	//从立即申请页进来
	if (userStore.provideList && userStore.provideList.parentID) {
		formValidate.value.parentID = userStore.provideList.parentID
	}
	//从立即申请页进来
	if (userStore.provideList && userStore.provideList.parentName) {
		formValidate.value.parentName = userStore.provideList.parentName
	}
}
function changeProvides() {
	userStore.changeProvide(false)
	userStore.changeProvideList(null)
}
function getDetails(id) {
	getDetail(id).then(res => {
		const list = res.data
		state.weight = list.weight
		formValidate.value.name = list.data.name
		formValidate.value.loanType = list.data.loanType.split(',')
		formValidate.value.corporation = list.data.corporation
		formValidate.value.tel = list.data.tel
		formValidate.value.parentName = list.data.parentName
		formValidate.value.parentID = list.data.parentID
		formValidate.value.auditor = list.data.auditor
	})
}
//级联赋值
function change(e) {
	state.loanTypeList.map(val => {
		if (val.value === e[0]) {
			val.children.map(vam => {
				if (vam.value === e[1]) {
					formValidate.value.parentName = vam.label
					formValidate.value.parentID = vam.value
					formValidate.value.auditor = vam.auditor
				}
			})
		}
	})
}
async function country(dicId) {
	const resp = await request.get(`/dictionaries/${dicId}`)
	console.log('resp', resp)
	return resp.data
}
async function getArticles(financialTag) {
	const params = {
		_from: 'public',
		formId: state.cpformId,
		isShow: 'true',
		parentId: state.dkId,
		financialTag,
		page: 0,
		size: 50
	}
	const res = await getQuery(params)
	const articles = res.data.content
	if (articles.length) {
		const list = []
		for (let inx = 0; inx < articles.length; inx++) {
			list.push({
				value: articles[inx].id,
				label: articles[inx].name,
				auditor: articles[inx].data.auditor
			})
		}
		return list
	} else {
		return []
	}
}
function handleSubmit(name) {
	proxy.$refs[name].validate((valid) => {
		if (valid) {
			state.showOverlay = true
			state.loading = ElLoading.service({
				lock: true,
				text: '提交中',
				background: 'rgba(0, 0, 0, 0.7)',
			})
			if (state.usage === 'login' && !state.token) {
				//登录拿token
				submitLogin()
			} else if (state.usage === 'register' && !state.token) {
				//注册拿token
				submitRegister()
			} else {
				//有token再分提交，修改
				sbumitProject(state.formId, state.id)
			}
		} else {
			ElMessage.error('请按照提示填写!');
		}
	})
}
function sbumitProject(formId, id) {
	const filterFormData = {
		name: formValidate.value.name,
		loanType: formValidate.value.loanType.join(','),
		corporation: formValidate.value.corporation,
		tel: formValidate.value.tel,
		parentName: formValidate.value.parentName,
		parentID: formValidate.value.parentID,
		auditor: formValidate.value.auditor,
		isReport:'否'
	}
	let requert = null
	const weight = state.weight !== null ? state.weight : 0
	if (!id) {
		requert = request.post(`/forms/${formId}/reports3`, {
			data: filterFormData,
			weight: weight,
			parentId: formValidate.value.parentID
		})
	} else {
		requert = request.put(`/reports/${id}/update3`, {
			data: filterFormData,
			weight: weight,
			parentId: formValidate.value.parentID
		})
	}
	state.loading.close()
	setTimeout(() => {
		requert.then((res) => {
		let projectId = null
		if (id) {
			projectId = id
		} else {
			projectId = res.data.id
		}
		request.put(`/reports/${projectId}/submit`)
			.then(async res => {
				ElMessage.success('提交成功')
				setTimeout(() => {
					state.loading.close()
					userStore.changeProvide(false)
					userStore.changeProvideList(null)
					if (router.currentRoute.value.path === '/personal') {
						router.go(0)
					} else {
						location.href = '/personal'
					}
				}, 500)
			})
			.catch((err) => {
				console.log(err)
				ElMessage.error('提交失败')
			})
	})
		.catch((err) => {
			console.log(err)
			ElMessage.error('提交失败')
		})
	}, 200);
}
async function submitLogin() {
	const res = await request.post('/auth/code', {
		mobile: formValidate.value.tel,
		code: formValidate.value.code
	})
	console.log(res)

	if (res.code !== 200) {
		ElMessage.error(res.msg + ',请重新发送验证码进行验证')
		return
	}
	state.userToken = res.data.token
	setToken(state.userToken)
	await personal()
}
async function submitRegister() {
	//注册信息
	const payload = {
		name: formValidate.value.name,
		tel: formValidate.value.tel,
		corporation: formValidate.value.corporation,
		policyNeeds:formValidate.value.policyNeeds.toString()
	}
	const res = await request
		.post('/register/mobile', {
			mobile: formValidate.value.tel,
			code: formValidate.value.code,
			payload
		})
	if (res.code === 200) {
		state.userToken = res.data
		setToken(state.userToken)
		await personal()
	} else {
		ElMessage.error(res.msg + ',请重新发送验证码进行验证')
	}
}
async function personal() { // 获取个人信息
	// const res = await request.get('/me')
	// if (res.code === 200) {
	// 	// 判断是否管理员
	// 	const meInfo = res.data
	// 	const isAdmin = meInfo.roles.includes('ROLE_ADMIN') || meInfo.roles.includes('ROLE_SITE_ADMIN')
	// 	localStorage.isAdmin = isAdmin
	// 	localStorage.userId = meInfo.id
	// 	localStorage.userName = meInfo.nickname;
	// 	localStorage.avatar = meInfo.avatar;
	// 	localStorage.roles = meInfo.roles.toString();
	// 	localStorage.orgId = meInfo.orgId;
	// 	//数据存好后，提交我要贷款信息
	// 	sbumitProject(state.formId, state.id)
	// } else {
	// 	if (res.code === 401) {
	// 		ElMessage.error('身份过期，请重新登录')
	// 		localStorage.clear()
	// 	} else {
	// 		ElMessage.error('请求错误' + res.msg)
	// 	}
	// }
	userStore.getInfo().then(() => {
		sbumitProject(state.formId, state.id)
	})
}
function handleReset(name) {
	proxy.$refs[name].resetFields();
}
//非登录情况下先登录，登录时返回手机号没有注册过，再注册
function sendMobileCode() {
	if (state.usage === 'login') {
		sendMobileCodeLogin()
	} else {
		sendMobileCodeRegister()
	}
}
function sendMobileCodeLogin() {
	console.log('formValidate.value', formValidate.value, formValidate.value.tel);
	if (formValidate.value.tel.trim() === '') {
		return ElMessage.error('请输入手机号码')
	}
	if (!formValidate.value.tel.match(/^[1][3,5,6,7,8,9][0-9]{9}$/)) {
		return ElMessage.error('请输入正确的手机号码')
	}
	state.isDisabled = true
	request.post('/sms', {
		mobile: formValidate.value.tel,
		usage: 'login'
	}).then((res) => {
		console.log('res', res);
		var code = res.code
		if (code === 200) {
			state.show = false
			ElMessage.success('发送成功')
			state.countdown = 60
			countdownSubtract()
		} else {
			state.isDisabled = false
			if (code === 400) {
				ElMessage.error(res.msg)
			} else if (code === 404) {
				//手机号未注册就调用短信注册
				getcgColumns()
				state.usage = 'register'
				sendMobileCodeRegister()
			} else {
				ElMessage.error('发送失败，' + res.msg)
			}
		}
	}).catch(error => {
		state.isDisabled = false
		if (!error.code) {
			ElMessage.error('服务器无响应')
		} else {
			ElMessage.error(error.msg)
		}
	})
}
function sendMobileCodeRegister() {
	if (formValidate.value.tel.trim() === '') {
		return ElMessage.error('请输入手机号码')
	}
	if (!formValidate.value.tel.match(/^[1][3,5,6,7,8,9][0-9]{9}$/)) {
		return ElMessage.error('请输入正确的手机号码')
	}
	state.isDisabled = true
	request.post('/sms', {
		mobile: formValidate.value.tel,
		usage: 'register'
	}).then((res) => {
		console.log('res2', res);
		var code = res.code
		if (code === 200) {
			state.show = false
			ElMessage.success('发送成功,您还可以选择政策需求')
			state.countdown = 60
			countdownSubtract()
		} else {
			state.isDisabled = false
			if (code === 400) {
				ElMessage.error(res.msg)
			} else {
				ElMessage.error('发送失败，' + res.msg)
			}
		}
	}).catch(error => {
			state.isDisabled = false
		if (!error.code) {
			ElMessage.error('服务器无响应')
		} else {
			ElMessage.error(error.msg)
		}
	})
}
function countdownSubtract() {
	if (state.countdown > 0) {
		setTimeout(() => {
			state.countdown -= 1
			countdownSubtract()
		}, 1000)
	} else {
		state.isDisabled = false
		state.show = true
	}
}
</script>
<style scoped lang='scss'>
.forms {
	padding: 20px 16px 0 16px;
}

.butt {
	background: #004098;
}

.buttBox {
	background: none;
	color: #004098;
	border: none;
}

.provide {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background-size: cover;
}

.provide-form {
	border-radius: 6px;
	background: #ffffff;
	width: 400px;
	padding: 0px 25px 5px 25px;

	.el-input {
		height: 40px;

		input {
			height: 40px;
		}
	}

	.input-icon {
		height: 39px;
		width: 14px;
		margin-left: 0px;
	}
}</style>
