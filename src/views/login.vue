<template>
  <div class="login">
    <el-dialog
      title="登录"
      v-model="userStore.isLogin"
      width="440px"
      append-to-body
      style="margin-top: 10vh"
      @close="changeLogins"
    >

      <el-form
        ref="loginRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <!-- <h3 class="title">若依后台管理系统</h3> -->
        <el-form-item prop="mobile">
          <el-input
            v-model="loginForm.mobile"
            type="text"
            size="large"
            auto-complete="off"
            placeholder="手机号"
          >
            <template #prefix>
              <svg-icon
                icon-class="user"
                class="el-input__icon input-icon"
              />
            </template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item prop="password">
					<el-input v-model="loginForm.password" type="password" size="large" auto-complete="off" placeholder="密码"
						@keyup.enter="handleLogin">
						<template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
					</el-input>
				</el-form-item> -->
        <!-- <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          v-model="loginForm.code"
          size="large"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleLogin"
        >
          <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item> -->
        <el-form-item
          prop="code"
          class="checkCode"
        >

          <el-input
            clearable
            v-model="loginForm.code"
            placeholder="输入验证码"
          ></el-input>

          <el-button
            @click.stop="sendVerificationCode"
            size="mini"
            type="primary"
            style="margin-left: 10px"
            v-if="show"
						:disabled="isDisabled"
          >发送验证码</el-button>
          <el-button
            size="mini"
            type="primary"
            style="margin-left: 10px"
            v-if="!show"
            disabled
          >{{ count
				}}秒后重发</el-button>

        </el-form-item>
        <!-- <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox> -->
        <el-form-item style="width:100%;">
          <el-button
            :loading="loading"
            size="large"
            type="primary"
            style="width:100%;"
            @click.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <div
            style="float: right;"
            v-if="register"
          >
            <span
              class="link-type"
              @click="changeRegisters"
            >立即注册</span>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessageBox,ElMessage } from "element-plus";
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from '@/store/modules/user'
import { ref, toRefs, toRef } from "vue";

const userStore = useUserStore()
const router = useRouter();
const { proxy } = getCurrentInstance();

const state = reactive({
	show: true,
	isDisabled:false,
	count: 60,
	timer: null,
	checkCode: ''
})
const { show, count, timer, checkCode ,isDisabled} = toRefs(state)
// const openView = ref(true);
const loginForm = ref({
	mobile: "",
	code: ""
});
const props = defineProps({
	openView: {
		type: Boolean,
		default: false,
	},
})
const openView = ref(props.openView);

const loginRules = {
	mobile: [
		{ required: true, message: "手机号不能为空", trigger: "blur" },
		{ min: 11, message: "手机号格式不正确", trigger: "blur" }, {
			pattern: /^[1][3,5,6,7,8,9][0-9]{9}$/,
			message: '请输入正确的手机号码',
		},
	],
	code: [
		{ required: true, message: "验证码不能为空", trigger: "blur" }
	],
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);
// 注册开关
const register = ref(true);
const redirect = ref(undefined);

function changeLogins() {
	userStore.changeLogin(false)
}
function changeRegisters() {
	userStore.changeLogin(false)
	userStore.changeRegister(true)
}

function sendVerificationCode() {
	if (!loginForm.value.mobile) {
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

				state.show = true;
				state.isDisabled = false

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
		mobile: loginForm.value.mobile,
		usage: 'login'
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
function handleLogin() {
	proxy.$refs.loginRef.validate(valid => {
		if (valid) {
			loading.value = true;
			// 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
			// if (loginForm.value.rememberMe) {
			// 	Cookies.set("username", loginForm.value.username, { expires: 30 });
			// 	Cookies.set("password", encrypt(loginForm.value.password), { expires: 30 });
			// 	Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
			// } else {
			// 	// 否则移除
			// 	Cookies.remove("username");
			// 	Cookies.remove("password");
			// 	Cookies.remove("rememberMe");
			// }
			// 调用action的登录方法
			userStore.login(loginForm.value).then(() => {
				userStore.getInfo().then(() => {
					ElMessage({
						message: '登录成功！',
						type: 'success',
					})
					userStore.changeLogin(false)
					if(redirect.value){
						router.push({ path: redirect.value });
					}else{
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
// 			loginForm.value.uuid = res.uuid;
// 		}
// 	});
// }

// function getCookie() {
// 	const username = Cookies.get("username");
// 	const password = Cookies.get("password");
// 	const rememberMe = Cookies.get("rememberMe");
// 	loginForm.value = {
// 		username: username === undefined ? loginForm.value.username : username,
// 		password: password === undefined ? loginForm.value.password : decrypt(password),
// 		rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
// 	};
// }

// getCode();
// getCookie();
</script>

<style lang='scss' scoped>
.login {
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

.login-form {
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

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
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

.login-code-img {
  height: 40px;
  padding-left: 12px;
}
.checkCode {
  .el-input {
    width: 230px;
  }
}
</style>
