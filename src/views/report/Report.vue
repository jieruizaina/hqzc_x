<template>
	<div class="box">
		<!-- <navigation /> -->
		<div class="main" :style="'width:'+ mainWidth+'px'">
			<formCreate v-model:api="formCreateRule.fApi" :rule="formCreateRule.rule" :option="formCreateRule.option" />
			<!-- <div v-if="mapBox" id="mapBox" ref="mapBox" class="pa-5 mt-0">
			<div id="container"></div>
			<div class="mapEditBox mt-2">
				<el-button class="mt-3" color="success" rounded @click="draw('marker')"> 添加标记 </el-button>
				<el-button class="mt-3" color="red darken-3" rounded @click="remove_icon">
					清除标记
				</el-button>
				<el-button class="mt-3" color="success" rounded @click="draw('polygon')">
					添加图形
				</el-button>
				 <el-button
          class="mt-3"
          color="blue darken-2"
          rounded
          @click="toggleControl('modify')"
        >
          <v-icon left>
            fa fa-pencil-square-o
          </v-icon>
          编辑图形
        </el-button>
				<el-button class="mt-3" color="red darken-3" rounded @click="remove_vectors">
					清除图形
				</el-button>
			</div>
		</div> -->
			<el-row justify="end" class="row-bg">
				<el-col >
					<el-button type="primary" size="large" round color="#00469B" @click="submitBtn()">提交</el-button>
				</el-col>
				<!-- <el-col :span="3">
				<el-button @click="saveBtn()" size="large">保存</el-button>
			</el-col> -->
			</el-row>
		</div>
	</div>
</template>
<script setup>
import navigation from '../../components/navigation.vue'
import editor from './component/Editor.vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import useUserStore from '@/store/modules/user'
import { onMounted, reactive, toRefs } from 'vue';
import { ruleFormat, initFormData } from './form';
import { useRouter, useRoute } from 'vue-router';
import { getFields } from '@/api/report/form';
import { saveReport, submitReport, uploadReport, getDetail } from '@/api/report/index';
import { ElMessageBox, ElMessage } from "element-plus";
const userStore = useUserStore()
const router = useRouter();
const route = useRoute();

// import Upload from './Upload.vue';
// import App from '/@/App.vue';
const state = reactive({
	formId: '2df5be1e-3971-44be-94bb-c526625c78e0',
	projectId: '',
	//projectId: 'ff71c459-08e7-46a0-8aab-56d91df60c85',
	formCreateRule: {
		// 表单创建规则 // 实例对象
		fApi: {}, // 表单生成规则
		rule: [], // 组件参数配置
		option: { submitBtn: false, form: { labelPosition: 'top', }, row: { gutter: 30 } },
	},
	mapBox: false,
	map: null,
	// 点坐标
	lnglat: [],
	// 多边形坐标
	rangeDimension: [],
	// 点实例
	markers: [],
	// 多边形实例
	polygons: [],
	formDataBox: {},
	AMap: null,
	mouseTool: null,
	mainWidth:'1200'
});
const { formId, formCreateRule, projectId, mapBox,mainWidth } = toRefs(state);
const props = defineProps({
	formId: {
		type: String,
		default: ''
	},
	id: {
		type: String,
		default: ''
	}
})

watch(() => props, async (value) => {
	if(props.formId){
		state.formId = props.formId
		state.mainWidth = 400
	}
	if (props.id) {
		state.projectId = props.id
	}
	await createForm(state.formId, state.projectId)
}, { deep: true, immediate: true })
// const app = createApp(App); // app.use(formCreate); // Vue.createApp({ //   components: { formCreate: formCreate.$form() }, // }); // app.component('files', Upload);
onMounted(async () => {
	// 如果有项目ID，就获取赋值
	if (route.query.id) {
		state.projectId = route.query.id
	}
	if (route.query.formId) {
		state.formId = route.query.formId
		await createForm(state.formId, state.projectId)
	}
});
async function createForm(formId, projectId) {
	const formRule = await getFormRule(formId); // 获取表单规则
	// await isMap(formRule);
	if (state.mapBox) {
		await loadmap();
		await initMap();
	}
	const rule = await ruleFormat(formRule, state); // 过滤表单规则
	state.formCreateRule.rule = rule; // 将过滤后的规则赋值给表单组件
	const formData = await inputValue(projectId); // 获取项目数据
	if (formData) {
		state.formDataBox = formData;
	}
	await initFormData(formData, rule, state);
};

// 创建基础地图与图层
const loadmap = async () => {
	const AMap = await AMapLoader.load({
		key: '12e52a5ea64d59be79d9a4bd71bebf1e', // 申请好的Web端开发者Key，首次调用 load 时必填
		version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
		plugins: ['AMap.MouseTool'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
		AMapUI: {
			version: '1.1',
		},
		Loca: {
			version: '1.3.2',
		},
	});
	console.log('AMap11111', AMap);

	state.AMap = AMap;
};
const initMap = async () => {
	const lnglat = [117.120128, 36.652069];
	console.log('AMap22222', state.AMap);
	state.map = new state.AMap.Map('container', {
		zoom: 12,
		resizeEnable: true,
		center: lnglat,
	});
	// state.map = state.map;
	var mouseTool = new state.AMap.MouseTool(state.map);
	state.mouseTool = mouseTool;
	// 监听draw事件可获取画好的覆盖物
	mouseTool.on('draw', function (e) {
		// 点
		if (e.obj.CLASS_NAME === 'AMap.Marker') {
			// 单点
			// state.map.remove(state.markers);
			// state.lnglat = [e.obj.w.position.lng + ',' + e.obj.w.position.lat];
			// state.markers = e.obj;
			// 多点
			state.lnglat.push(e.obj.w.position.lng + ',' + e.obj.w.position.lat);
			state.markers.push(e.obj);
			state.formCreateRule.fApi.setValue('lnglat', JSON.stringify(state.lnglat));
		} else if (e.obj.CLASS_NAME === 'AMap.Polygon') {
			// const paths = [];
			// e.obj.w.path.map((val) => {
			// 	const path = [];
			// 	path.push(val.lng);
			// 	path.push(val.lat);
			// 	paths.push(path);
			// });
			// state.polygons.push(e.obj);
			// state.rangeDimension.push(paths);
			// state.formCreateRule.fApi.setValue('rangeDimension', JSON.stringify(state.rangeDimension));
		}
	});
	// 单点
	// state.draw('marker');
};
// 切换
const draw = (type) => {
	switch (type) {
		case 'marker': {
			state.mouseTool.marker({
				icon: new state.AMap.Icon({
					size: new state.AMap.Size(30, 32),
					imageSize: new state.AMap.Size(30, 32),
				}),
			});
			break;
		}
		case 'polygon': {
			state.mouseTool.polygon({
				fillColor: '#fb8c00',
				strokeOpacity: 1,
				fillOpacity: 0.3,
				strokeColor: '#fb8c00',
				strokeWeight: 3,
				strokeStyle: 'solid',
				strokeDasharray: [5, 5],
			});
			break;
		}
	}
};
const remove_icon = () => {
	// 清除点
	state.map.remove(state.markers);
	state.map.setFitView();
	state.lnglat = [];
	state.markers = [];
	state.formCreateRule.fApi.setValue('lnglat', null);
};
const remove_vectors = () => {
	// 清除图形
	state.map.remove(state.polygons);
	state.rangeDimension = [];
	state.polygons = [];
	state.formCreateRule.fApi.setValue('rangeDimension', null);
};
const isMap = (formRule) => {
	for (var i = 0; i < formRule.length; i++) {
		if (formRule[i].code === 'lnglat' || formRule[i].code === 'rangeDimension') {
			state.mapBox = true;
			break;
		}
	}
};
const getFormRule = async (formId) => {
	if (formId) {
		const formData = await getFields(formId);
		return formData.data;
	}
}; // 获取项目信息
const inputValue = async (projectId) => {
	// 判断是否有项目ID，新增项目是没有项目ID的
	if (projectId) {
		const projectInfo = await getDetail(projectId);
		return projectInfo.data.data;
	} else {
		return null;
	}
};

const submitBtn = async () => {
	state.formCreateRule.fApi.validate((valid) => {
		if (valid === true) {
			submitData(state.formId, state.projectId);
		} else {
		}
	});
};
const saveBtn = async () => {
	state.formCreateRule.fApi.validate((valid) => {
		if (valid === true) {
			saveData(state.formId, state.projectId);
		} else {
		}
	});
};

// 提交表单数据
const submitData = async (formId, id) => {
	let requert;
	const FormData = await filterFormData();
	const weight = FormData.weight ? FormData.weight : 0;
	if (!id) {
		route.query.parentId && (FormData.parentID = route.query.parentId)
		route.query.parentName && (FormData.parentName = route.query.parentName)
		if (route.query.parentId) {
			requert = await saveReport(formId, {
				data: FormData,
				weight: weight,
				parentId: route.query.parentId
			});
		} else {
			requert = await saveReport(formId, {
				data: FormData,
				weight: weight
			});
		}
	} else {
		if (route.query.parentId) {
			requert = await uploadReport(id, {
				data: FormData,
				weight: weight,
				parentId: route.query.parentId
			});
		} else {
			requert = await uploadReport(id, {
				data: FormData,
				weight: weight
			});
		}
	}
	let projectId = null;
	if (id) {
		projectId = id;
	} else {
		projectId = requert.data.id;
	}
	await submitReport(projectId);
	ElMessage({
		message: '提交成功！',
		type: 'success',
	})
	if(props.formId){
		//router.go(0);
		userStore.changeFullName(FormData.name)
	}else{
		router.go(-1);
	}
};
const saveData = async (formId, id) => {
	let requert;
	const FormData = await filterFormData();
	const weight = FormData.weight ? FormData.weight : 1000000;
	if (!id) {
		requert = await saveReport(formId, {
			data: FormData,
			weight: weight,
		});
	} else {
		requert = await uploadReport(id, {
			data: FormData,
			weight: weight,
		});
	}
	ElMessage({
		message: '保存成功！',
		type: 'success',
	})
	router.go(-1);
};
// 格式化表单数据
const filterFormData = async () => {
	let ysFormData = null;
	await state.formCreateRule.fApi.submit((formData) => {
		ysFormData = formData;
		console.log('formData', formData);
	});
	for (const data in ysFormData) {
		if (typeof ysFormData[data] === 'string') {
			if (ysFormData[data] === '') {
				ysFormData[data] = null;
			}
		} else if (ysFormData[data] instanceof Array) {
			if (ysFormData[data].length === 0) {
				ysFormData[data] = null;
			} else if (ysFormData[data][0] === '') {
				ysFormData[data] = null;
			} else {
				ysFormData[data] = ysFormData[data].toString();
			}
		}
	}
	return ysFormData;
};
</script>
<style lang="scss" scoped>
#container {
	position: relative;
	z-index: 1;
	width: 100%;
	height: 500px;
	touch-action: pan-y;
}

.box {
	width: 1200px;
	margin: 0 auto;

	.main {
		margin-top: 30px;
	}
}

.row-bg {
	margin: 40px 0;
	button{
		padding: 0 40px;
	}
}

::v-deep .form-create .titlesss {
	//border-top: 1px dashed #CCCCCC;
	margin: 20px 0 0 0;

	.el-input__wrapper {
		display: none;
	}
}

// ::v-deep .form-create .title1sss{
// 	border:none
// }
::v-deep .form-create .titlesss span {
	font-size: 18px;
	font-family: Microsoft YaHei, Microsoft YaHei-Bold;
	font-weight: 700;
	text-align: left;
	color: #00469b;
	line-height: 44px;
}
</style>
