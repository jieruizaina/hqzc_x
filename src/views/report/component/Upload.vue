<template>
	<div>
		<!-- <div v-for="(item, index) in uploadList" :key="index" class="demo-upload-list"> -->
			<!-- <template v-if="item.status === 'finished'"> -->
				<!-- <el-image style="width: 100px; height: 100px" :src="item.url" :preview-src-list="[item.url]"/> -->
				
				<!-- <div class="demo-upload-list-cover">
					<a
            type="ios-eye-outline"
            @click.native="handleView(item)"
          />
          <a
            type="ios-trash-outline"
            @click.native="handleRemove(item)"
          />
				</div> -->
			<!-- </template>
			<template v-else>
				<Progress v-if="item.showProgress" :percent="item.percentage" hide-info />
			</template> -->
		<!-- </div> -->
		<el-upload v-model:file-list="uploadList"  list-type="picture-card" ref="upload" :show-upload-list="false"
			:on-success="handleSuccess"  :max-size="2048"
			:on-error="handleFormatError" :on-exceed="handleMaxSize" :before-upload="handleBeforeUpload"
			:headers="{ 'Authorization': token, 'x-app': xApp }" multiple type="drag" :action="baseURL"
			style="display: inline-block;width:58px;" :on-preview="handleView" :on-remove="handleRemove">
			<el-icon>
				<Plus />
			</el-icon>
		</el-upload>
		<el-dialog v-model="visible" :title="imgName">
			<img v-if="visible" :src="imgSrc" style="width: 100%">
		</el-dialog>
	</div>
</template>

<script setup>
import { getFiless } from "@/api/report/form.js";
import { getToken } from '@/utils/auth'
import { ElMessageBox, ElMessage } from "element-plus";
const props = defineProps({
	modelValue: {
		type: Array,
		default: null
	},
	// 文件格式
	upType: {
		type: Array,
		default: null
	},
	limitnum: {
		type: Number,
		default: 10
	}
})
const state = reactive({
	defaultList: [],
	uploadList: [],
	files: [],
	fileUrlIds: {},
	fileIds: [],
	field: '',
	token: 'Bearer ' + getToken(),
	xApp: import.meta.env.VITE_APP_ID,
	visible: false,
	imgName: '',
	imgSrc: '',
	baseURL: import.meta.env.VITE_APP_BASE_API + '/files',
	imgList: ['.jpg', '.jpeg', '.png'],
	pdf: '../../../assets/images/pdf.png',
	xls: '../../../assets/images/excel.png',
	doc: '../../../assets/images/word.png',
	zip: '../../../assets/images/zip.png',
	ppt: '../../../assets/images/ppt.png',
	unknown: '../../../assets/images/未知文件.png',
	formats: props.upType || ['jpg', 'jpeg', 'png', 'pdf', 'xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'zip']
})
const upload = ref(null)

const { defaultList, uploadList, files, fileUrlIds, fileIds, field, token, xApp, visible, imgName, imgSrc, baseURL, imgList, pdf, xls, doc, zip, ppt, unknown, formats } = toRefs(state)

// watch(() => props.modelValue, async (ids) => {
// 	console.log('ids',ids);
// 	if (state.defaultList.length === 0) {
// 		state.defaultList = await getFileUrl(ids)
// 	}
// 	nextTick(() => {
// 		// 这样打印出来就会有值了
// 		state.uploadList = upload.value.fileList
// 	});
// })
watch(() => state.fileUrlIds, (ids) => {
	onClick()
},
	{
		deep: true
	})
	
	 onMounted(async() => {
	state.uploadList = await getFileUrl(props.modelValue)
	
	console.log('state.uploadList',state.uploadList);
	// nextTick(() => {
	// 	// 这样打印出来就会有值了
	// 	state.uploadList = upload.value.fileList
	// });
		
	}),
function showImg(url) {
	var isImg = false;
	state.imgList.map(val => {
		if (url.includes(val)) {
			isImg = true;
		}
	});
	if (isImg) {
		return url;
	} else if (url.includes('.pdf')) {
		return state.pdf;
	} else if (url.includes('.xls')) {
		return state.xls;
	} else if (url.includes('.zip')) {
		return state.zip;
	} else if (url.includes('.ppt')) {
		return state.ppt;
	} else {
		return state.unknown;
	}
}
async function getFileUrl(filesId) {
	if (filesId.length > 0) {
		const res = await getFiless({ ids: filesId.toString() })
		const resData = res.data;
		const urlArr = [];
		resData.map(val => {
			state.fileUrlIds[val.id] = val.url
			urlArr.push({
				name: val.oldName,
				url: val.url
			});
		});
		console.log('urlArr',urlArr);
		return urlArr;
	} else {
		return [];
	}
}

const emit = defineEmits(['update:modelValue'])
function onClick() {
	state.files = Object.keys(state.fileUrlIds);
	emit('update:modelValue', state.files);
}
// 上传成功
function handleSuccess(res, file, fileList) {
	state.fileUrlIds[file.response.data.id] = file.response.data.url
	console.log('state.fileUrlIds2', state.fileUrlIds);
	ElMessage({
		message: '上传成功',
		type: 'success',
	})
}
function handleView(item) {
	var isImg = false;
	state.imgList.map(val => {
		if (item.name.includes(val)) {
			isImg = true;
		}
	});
	if (isImg) {
		state.imgName = item.name;
		item.url ? state.imgSrc = item.url : state.imgSrc = item.response.data.url;
		state.visible = true;
	} else {
		const link = document.createElement('a');
		link.style.display = 'none';
		item.url ? link.href = item.url : link.href = item.response.data.url;
		link.target = '_blank';
		link.click();
		link.remove();
	}
}
function handleRemove(uploadFile, uploadFiles) {
	// 删除已传列表缩略图
	// const fileList = upload.value.fileList;
	// upload.value.fileList.splice(fileList.indexOf(file), 1);
	let filesUrl;
	// if (uploadFile.url) {
	// 	filesUrl = uploadFile.url;
	// } else {
		console.log('uploadFile.response',uploadFile,uploadFiles);
		if(uploadFile.response){
			filesUrl = uploadFile.response.data.url
		} else{filesUrl = uploadFile.url;}
	//}
	for (const id in state.fileUrlIds) {
		if (state.fileUrlIds[id] === filesUrl) {
			delete state.fileUrlIds[id]
		}
	}
}
function handleFormatError(file) {
	ElMessageBox.alert(`文件格式应为：${state.formats.toString()}中的一种`, "上传的文件格式不正确", { type: 'warning' })

}
function handleMaxSize(file) {
	ElMessageBox.alert('文件  ' + file.name + ' 最大不能超过 2M.', "文件超出了限制体积大小", { type: 'warning' })
}
function handleBeforeUpload(file, fileList) {
	const check = state.uploadList.length < props.limitnum;
	if (!check) {
	 	ElMessage.error(`最多只能上传${props.limitnum}个文件`)
	}
	const list = state.formats.filter(val=>{
		return val === file.type.split('/')[1]
	})
	if(!list.length){
		 ElMessageBox.alert(`文件格式应为：${state.formats.toString()}中的一种`, "上传的文件格式不正确", { type: 'warning' })
		 return false
	}
	return check;
}
</script>

<style lang="scss" scoped>
.demo-upload-list {
	display: inline-block;
	width: 60px;
	height: 60px;
	text-align: center;
	line-height: 60px;
	border: 1px solid transparent;
	border-radius: 4px;
	overflow: hidden;
	background: #fff;
	position: relative;
	box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
	margin-right: 4px;
}

.demo-upload-list img {
	width: 100%;
	height: 100%;
}

.demo-upload-list-cover {
	display: none;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
	display: block;
}

.demo-upload-list-cover i {
	color: #fff;
	font-size: 20px;
	cursor: pointer;
	margin: 0 2px;
}
</style>
