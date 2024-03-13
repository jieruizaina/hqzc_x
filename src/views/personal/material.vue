<template>
	<div class="material">

		<div class="lefma">
			<el-form ref="registerRef" :model="registerForm" :rules="registerRules" label-position="top" class="register-form">
				<el-form-item prop="corporation" label="公司名称">
					<el-input v-model="registerForm.corporation" type="text" size="large" auto-complete="off" placeholder="公司名称">
					</el-input>
				</el-form-item>
				<el-form-item prop="creditCode" label="统一社会信用代码">
					<el-input v-model="registerForm.creditCode" type="text" size="large" auto-complete="off" placeholder="统一社会信用代码">
					</el-input>
				</el-form-item>
				<el-form-item prop="region">
					<el-input v-model="registerForm.region" type="text" size="large" auto-complete="off" placeholder="所属地区">
					</el-input>
				</el-form-item>
				<el-form-item prop="address">
					<el-input v-model="registerForm.address" type="text" size="large" auto-complete="off" placeholder="企业地址">
					</el-input>
				</el-form-item>
				<el-form-item prop="type">
					<el-input v-model="registerForm.type" type="text" size="large" auto-complete="off" placeholder="企业类型">
					</el-input>
				</el-form-item>
				<el-form-item prop="name">
					<el-input v-model="registerForm.name" type="text" size="large" auto-complete="off" placeholder="姓名">
					</el-input>
				</el-form-item>
				<el-form-item prop="tel">
					<el-input v-model="registerForm.tel" type="text" size="large" auto-complete="off" placeholder="手机号">
					</el-input>
				</el-form-item>
			</el-form>
		</div>
		<div class="rima">
			<div class="img"><img src="../../assets/images/profile.jpg" alt=""></div>
			<el-upload ref="upload" class="upload-demo" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
				:limit="1" :on-exceed="handleExceed" :auto-upload="false">
				<template #trigger>
					<el-button type="primary" color="#00469B" round plain>更换头像</el-button>
				</template>
				<!-- <el-button class="ml-3" type="success" @click="submitUpload">
      upload to server
    </el-button> -->
				<!-- <template #tip>
      <div class="el-upload__tip text-red">
        limit 1 file, new file will cover the old file
      </div>
    </template> -->
			</el-upload>
		</div>
	</div>
</template>

<script setup name="material">
import { ref } from 'vue'

import { genFileId } from 'element-plus'
const registerForm = ref({
	username: "",
	password: "",
	confirmPassword: "",
	code: "",
	uuid: ""
});
const upload = ref

const handleExceed = (files) => {
	upload.value.clearFiles()
	const file = files[0]
	file.uid = genFileId()
	upload.value.handleStart(file)
}

const submitUpload = () => {
	upload.value.submit()
}

</script>

<style scoped lang="scss">
.material {
	margin-top: 20px;
	display: flex;
	justify-content: space-between;

	.lefma {
		width: 380px;
	}

	.rima {
		width: 420px;
		display: flex;
		flex-direction: column;
		align-items: center;
		.img {
			width: 140px;
			height: 140px;
			margin-bottom: 16px;

			img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
	}

}
</style>

