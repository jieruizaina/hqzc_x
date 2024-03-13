<template>
	<div class="register">
		<el-dialog title="注册" v-model="userStore.isRegister" width="440px" append-to-body style="margin-top: 10vh"
			@close="changeRegisters">

			<el-form ref="registerRef" :model="registerForm" :rules="registerRules" class="register-form">
				<!-- <h3 class="title">若依后台管理系统</h3> -->
				<!-- <el-form-item prop="username">
        <el-input 
          v-model="registerForm.username" 
          type="text" 
          size="large" 
          auto-complete="off" 
          placeholder="账号"
        >
          <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          size="large" 
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleRegister"
        >
          <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          size="large" 
          auto-complete="off"
          placeholder="确认密码"
          @keyup.enter="handleRegister"
        >
          <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          size="large" 
          v-model="registerForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleRegister"
        >
          <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img"/>
        </div>
      </el-form-item> -->
				<el-form-item prop="corporation">
					<el-input v-model="registerForm.corporation" type="text" size="large" auto-complete="off" placeholder="企业名称">
					</el-input>
				</el-form-item>
				<el-form-item prop="creditCode">
					<el-input v-model="registerForm.creditCode" type="text" size="large" auto-complete="off" placeholder="统一社会信用代码">
					</el-input>
				</el-form-item>
				<el-form-item prop="region">
					<!-- <el-input v-model="registerForm.region" type="text" size="large" auto-complete="off" placeholder="所属地区">
					</el-input> -->
					<el-cascader v-model="cascaderValue" :options="options" @change="handleChange" :props="fieldNames" size="large"  placeholder="所属地区"/>
				</el-form-item>
				<!-- <el-form-item prop="address">
					<el-input v-model="registerForm.address" type="text" size="large" auto-complete="off" placeholder="企业地址">
					</el-input>
				</el-form-item> -->
				<!-- <el-form-item prop="type">
					<el-select v-model="registerForm.type" placeholder="企业类型" size="large">
						<el-option :label="item.name" :value="item.code" v-for="(item, inx) in columns" :key="inx" />
					</el-select>
				</el-form-item> -->
				<el-form-item prop="name">
					<el-input v-model="registerForm.name" type="text" size="large" auto-complete="off" placeholder="姓名">
					</el-input>
				</el-form-item>
				<el-form-item prop="tel">
					<el-input v-model="registerForm.tel" type="text" size="large" auto-complete="off" placeholder="手机号">
					</el-input>
				</el-form-item>
				<el-form-item class="checkCode">

					<el-input clearable v-model="checkCode" placeholder="输入验证码"></el-input>

					<el-button @click.stop="sendVerificationCode" size="mini" type="primary" style="margin-left: 10px"
						:disabled="isDisabled"
						v-if="show">发送验证码</el-button>
					<el-button size="mini" type="primary" style="margin-left: 10px" v-if="!show" disabled>{{ count
					}}秒后重发</el-button>

				</el-form-item>
				<!-- 未登录并且没有注册显示 -->
				<el-form-item label="政策需求（可多选）" style="display: block">
					<el-checkbox-group v-model="registerForm.policyNeeds" >
						<el-checkbox :label="item.id" name="type" v-for="(item,inx) in zcList" :key="inx">{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item style="width:100%;">
					<el-button :loading="loading" size="large" type="primary" style="width:100%;" @click.prevent="handleRegister">
						<span v-if="!loading">注 册</span>
						<span v-else>注 册 中...</span>
					</el-button>
					<div style="float: right;">
						<span class="link-type" @click="changeLogins">使用已有账户登录</span>
					</div>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from "element-plus";
import { getCodeImg, register } from "@/api/login";
import { getQuery, getDetail } from "@/api/report/index";
import useUserStore from '@/store/modules/user'
import { getDictionary } from "@/api/report/dictionary";

const userStore = useUserStore()
const router = useRouter();
const { proxy } = getCurrentInstance();
const state = reactive({
	show: true,
	isDisabled:false,
	count: 60,
	timer: null,
	checkCode: '',
	columns: [],
	options: [],
	fieldNames: {
		label: 'name',
		value: 'code'
	},
	cascaderValue:"",
	//商务政策id
	zcId:'89913bd2-0034-4dab-9107-e5c8f67d4922',
	//政策需求
	zcList:[],
	//栏目formId
	lmformId: '76b8b8f1-ece3-48f6-bc7b-f4f0b3db12ad',
	//金融产品信息固定
	jrItem:{
		id:'a79be166-8bd0-4981-aa3c-d3e836656874',
		name:'金融'
	},
})
const { show, timer, count, checkCode, columns, options, fieldNames,cascaderValue,isDisabled,zcList,lmformId,zcId,jrItem} = toRefs(state)
const openView = ref(true);
const registerForm = ref({
	corporation: "",
	creditCode: "",
	region: "",
	address: "",
	type: "",
	name: '',
	tel: '',
	policyNeeds:[],
});

const equalToPassword = (rule, value, callback) => {
	if (registerForm.value.password !== value) {
		callback(new Error("两次输入的密码不一致"));
	} else {
		callback();
	}
};

const registerRules = {
	tel: [
		{ required: true, message: "手机号不能为空", trigger: "blur" },
		{ min: 11, message: "手机号格式不正确", trigger: "blur" }, {
			pattern: /^[1][3,5,6,7,8,9][0-9]{9}$/,
			message: '请输入正确的手机号码',
		},
	],
	name: [
		{ required: true, trigger: "blur", message: "请输入姓名" },
	],
	creditCode: [
		{ required: true, trigger: "blur", message: "请输入统一社会信用代码" }
	],
	corporation: [
		{ required: true, trigger: "blur", message: "请输入企业名称" }
	],
	checkCode: [
		{ required: true, trigger: "blur", message: "请输入验证码" }
	],
	region: [
		{ required: true, trigger: "change", message: "请选择所属地区" }
	],
};

const codeUrl = ref("");
const loading = ref(false);
const captchaEnabled = ref(true);

const redirect = ref(undefined);
onMounted(async () => {
	console.log("1");
	getcgColumns()
	console.log("23");
	const resp = await country('countryTree')
	state.options = treeData(resp, '370000')
	console.log('state.options', state.options);
	const resp2 = await country('9866fc5c-f930-4a5f-88df-170148492b1b')
	console.log('resp2', resp2)
	resp2.map(val => {
		state.columns.push({ name: val.name, code: val.code })
	})
})
function getcgColumns() {
	console.log("123");
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
		console.log(state.zcList);
	})
}
async function country(dicId) {
	const resp = await getDictionary(dicId)
	return resp.data
}
function handleChange(val) {
	console.log('handleChange', val);
	registerForm.value.region = val.join(',')
}
function treeData(sourceData, id) {
	const cloneData = JSON.parse(JSON.stringify(sourceData))
	return cloneData.filter(father => {
		const branchArr = cloneData.filter(child => father.id === child.parentId)
		branchArr.length > 0 ? (father.children = branchArr) : delete father.children
		return father.parentId + '' === id + ''
	})
}
function changeRegisters() {
	userStore.changeRegister(false)
}
function changeLogins() {
	userStore.changeRegister(false)
	userStore.changeLogin(true)
}
function sendVerificationCode() {
	if (!registerForm.value.tel) {
		return ElMessage.error('手机号不能为空!')
	}
  state.isDisabled = true
	let TIME_COUNT = 60;

	if (!state.timer) {
		console.log('state.timer', state.timer);

		state.count = TIME_COUNT;

		state.show = false;

		state.timer = setInterval(() => {

			if (state.count > 0 && state.count <= TIME_COUNT) {

				state.count--;

			} else {
				state.isDisabled = false

				state.show = true;

				clearInterval(state.timer);

				state.timer = null;

			}

		}, 1000);

		getCode();

	}

}
//验证码

function getCode() {
	const params = {
		mobile: registerForm.value.tel,
		usage: 'register'
	}
	getCodeImg(params).then(res => {
		console.log('res', res);
		if (res.code == 200) {
			ElMessage({
				message: '发送成功！',
				type: 'success',
			})
		}else{
			state.isDisabled = false
		}
	});

}
const emits = defineEmits(['func'])
function handleRegister() {
	// state.registerForm.policyNeeds=state.registerForm.policyNeedsList.toString()
	proxy.$refs.registerRef.validate(valid => {
		if (valid) {
			loading.value = true;
			// register(registerForm.value).then(res => {
			// 	const username = registerForm.value.username;
			// 	ElMessageBox.alert("<font color='red'>恭喜你，您的账号 " + username + " 注册成功！</font>", "系统提示", {
			// 		dangerouslyUseHTMLString: true,
			// 		type: "success",
			// 	}).then(() => {
			// 		router.push("/login");
			// 	}).catch(() => { });
			// }).catch(() => {
			// 	loading.value = false;
			// 	if (captchaEnabled) {
			// 		getCode();
			// 	}
			// });
			const arr=JSON.parse(JSON.stringify(registerForm.value))
			arr.policyNeeds=registerForm.value.policyNeeds.toString()
			// 调用action的登录方法
			const params = {
				code: state.checkCode,
				mobile: registerForm.value.tel,
				payload: arr
			}
			userStore.register(params).then(() => {
				userStore.getInfo().then(() => {
					ElMessage({
						message: '注册成功！',
						type: 'success',
					})
					userStore.changeRegister(false)
					if (redirect.value) {
						router.push({ path: redirect.value });
					} else {
						location.href = router.currentRoute.value.fullPath || '/index';
					}

				})
			}).catch(() => {
				loading.value = false;
				// 重新获取验证码
				// if (captchaEnabled.value) {
				// 	getCode();
				// }
			});
		}
	});
}

// function getCode() {
// 	getCodeImg().then(res => {
// 		captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled;
// 		if (captchaEnabled.value) {
// 			codeUrl.value = "data:image/gif;base64," + res.img;
// 			registerForm.value.uuid = res.uuid;
// 		}
// 	});
// }

</script>

<style lang='scss' scoped>
.register {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background-size: cover;
}

.title {
	margin: 0px auto 30px auto;
	text-align: center;
	color: #707070;
}

.register-form {
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
}

.register-tip {
	font-size: 13px;
	text-align: center;
	color: #bfbfbf;
}

.register-code {
	width: 33%;
	height: 40px;
	float: right;

	img {
		cursor: pointer;
		vertical-align: middle;
	}
}

.el-register-footer {
	height: 40px;
	line-height: 40px;
	position: fixed;
	bottom: 0;
	width: 100%;
	text-align: center;
	color: #fff;
	font-family: Arial;
	font-size: 12px;
	letter-spacing: 1px;
}

.register-code-img {
	height: 40px;
	padding-left: 12px;
}

.checkCode {
	.el-input {
		width: 230px;
	}
}
</style>
