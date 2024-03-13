<template>
	<div class="box">
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
		<el-row justify="start" class="row-bg">
			<el-col :span="3">
				<el-button type="primary" size="large" @click="submitBtn()">提交</el-button>
			</el-col>
			<el-col :span="3">
				<el-button @click="saveBtn()" size="large">保存</el-button>
			</el-col>
		</el-row>
	</div>
</template>
<script setup>
import editor from './component/Editor.vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import { onMounted, reactive, toRefs } from 'vue';
import { ruleFormat, initFormData } from './form';
import { useRouter,useRoute } from 'vue-router';


// import Upload from './Upload.vue';
// import App from '/@/App.vue';
const state = reactive({
	formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
	projectId: '2d9e7730-6e9e-4645-8d93-ecbaef46d982',
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
});

const router = useRouter();
const route = useRoute();
console.log(route.query.name)

// const app = createApp(App); // app.use(formCreate); // Vue.createApp({ //   components: { formCreate: formCreate.$form() }, // }); // app.component('files', Upload);
onMounted(async () => {
	await createForm(state.formId, state.projectId);
});
const createForm = async (formId, projectId) => {
	// const formRule = await getFormRule(formId); // 获取表单规则
	const formRule=[]
	// await isMap(formRule);
	if (state.mapBox) {
		await loadmap();
		await initMap();
	}
	// const rule = await ruleFormat(formRule); // 过滤表单规则
	const rule1 = [
		{
			"title": "文章标题",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "文章标题"
			},
			"validate": [
				{
					"required": true,
					"message": "此项必填!"
				}
			],
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": "测试"
		},
		{
			"title": "简略标题",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "简略标题"
			},
			"validate": [
				{
					"required": true,
					"message": "此项必填!"
				}
			],
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
		{
			type: "checkbox",
			title: "自定义属性",
			field: "label",
			value: ["1", "2", "3"],
			options: [
				{ value: "1", label: "头条", disabled: true },
				{ value: "2", label: "推荐", disabled: false },
				{ value: "3", label: "幻灯", disabled: false },
				{ value: "4", label: "特荐", disabled: false },
				{ value: "5", label: "滚动", disabled: false },
				{ value: "6", label: "加粗", disabled: false },
				{ value: "7", label: "图片", disabled: false },
				{ value: "8", label: "跳转", disabled: false },
			]
		},
		{
			type: "upload",
			field: "pic",
			title: "缩略图",
			value: [
				'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
				'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
			],
			props: {
				type: "select",
				uploadType: "image",
				action: "/upload.php",
				name: "pic",
				multiple: true,
				accept: "image\/*",
				limit: 2,
				onSuccess: function (res, file) {
					file.url = res.data.filePath;
				}
			},
		},
		{
			"title": "文章主栏目",
			"field": "areaCode",
			"weight": 17,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "文章主栏目",
				"allowClear": true,
				"showSearch": true
			},
			"validate": [
				{
					"required": true,
					"message": "此项必填!"
				}
			],
			"type": "select",
			"options": [
				{
					"value": "370688",
					"label": "开发区"
				}
			],
			"on": {},
			"children": [],
			"hidden": false,
			"display": true,
			"value": [
				"370688"
			]
		},
		{
			"title": "关键字",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "关键字"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
		{
			"title": "内容摘要",
			"field": "Company profile",
			"weight": 14,
			"col": {
				"span": 24
			},
			"props": {
				"type": "textarea",
				"rows": 3,
				"placeholder": "内容摘要"
			},
			"validate": [],
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": null
		},
		{
			type: 'editor',
			field: 'editor',
			title: '自定义内容',
			value: '<b>@form-create/component-wangeditor</b>',
			component: editor,
		},
		{
			type: "radio",
			title: "评论选项",
			field: "is_postage",
			value: "0",
			options: [
				{ value: "0", label: "禁止", disabled: false },
				{ value: "1", label: "允许", disabled: true },
			],
		},
		{
			"title": "浏览次数",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "浏览次数"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
		{
			"title": "文章排序",
			"field": "complete",
			"weight": 9,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "文章排序",
				"allowClear": true,
				"showSearch": true
			},
			"validate": [],
			"type": "select",
			"options": [
				{
					"value": "默认排序",
					"label": "默认排序"
				},
			],
			"on": {},
			"children": [],
			"hidden": false,
			"display": true,
			"value": null
		},
		{
			"title": "阅读权限",
			"field": "complete",
			"weight": 9,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "阅读权限",
				"allowClear": true,
				"showSearch": true
			},
			"validate": [],
			"type": "select",
			"options": [
				{
					"value": "开放",
					"label": "开放"
				},
			],
			"on": {},
			"children": [],
			"hidden": false,
			"display": true,
			"value": null
		},
		{
			type: "DatePicker",
			field: "section_day",
			title: "发布日期",
			value: [],
			props: {
				type: "date",
				placeholder: "请选择活动日期",
			}
		}
	]
	const rule2 =[
		{
			"title": "上级菜单",
			"field": "areaCode",
			"weight": 17,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "上级菜单",
				"allowClear": true,
				"showSearch": true
			},
			"validate": [
				{
					"required": true,
					"message": "此项必填!"
				}
			],
			"type": "select",
			"options": [
				{
					"value": "370688",
					"label": "开发区"
				}
			],
			"on": {},
			"children": [],
			"hidden": false,
			"display": true,
			"value": [
				"370688"
			]
		},
		{
			"title": "菜单中文名称",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "菜单中文名称"
			},
			"validate": [
				{
					"required": true,
					"message": "此项必填!"
				}
			],
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": "测试"
		},
		{
			"title": "菜单英文名称",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "菜单英文名称"
			},
			"validate": [
				{
					"required": true,
					"message": "此项必填!"
				}
			],
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
		{
			"title": "栏目链接",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "栏目链接"
			},
			"validate": [
				{
					"required": true,
					"message": "此项必填!"
				}
			],
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
		{
			"title": "栏目类型",
			"field": "complete",
			"weight": 9,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "栏目类型",
				"allowClear": true,
				"showSearch": true
			},
			"validate": [],
			"type": "select",
			"options": [
				{
					"value": "普通文章",
					"label": "普通文章"
				},
			],
			"on": {},
			"children": [],
			"hidden": false,
			"display": true,
			"value": null
		},
		{
			"title": "排列顺序",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "排列顺序"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": "测试"
		},
		{
			"title": "浏览权限",
			"field": "complete",
			"weight": 9,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "浏览权限",
				"allowClear": true,
				"showSearch": true
			},
			"validate": [],
			"type": "select",
			"options": [
				{
					"value": "开放",
					"label": "开放"
				},
			],
			"on": {},
			"children": [],
			"hidden": false,
			"display": true,
			"value": null
		},
		{
			type: "radio",
			title: "是否隐藏菜单",
			field: "is_postage",
			value: "0",
			options: [
				{ value: "0", label: "显示", disabled: false },
				{ value: "1", label: "隐藏", disabled: true },
			],
		},
	]
	const rule3 =[
		{
			"title": "应用appId",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "应用appId"
			},
			"validate": [
				{
					"required": true,
					"message": "此项必填!"
				}
			],
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": "测试"
		},
		{
			"title": "应用appSecret",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "应用appSecret"
			},
			"validate": [
				{
					"required": true,
					"message": "此项必填!"
				}
			],
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
		{
			"title": "token",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "token"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},{
			"title": "重定向地址",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "重定向地址"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},{
			"title": "微信回调地址",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "微信回调地址"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
	]
	const rule4 =[
		{
			type: "checkbox",
			title: "开启系统验证码",
			field: "label",
			value: ["1", "2", "3"],
			options: [
				{ value: "1", label: "注册会员", disabled: true },
				{ value: "2", label: "前台登录", disabled: false },
				{ value: "3", label: "会员投稿", disabled: false },
				{ value: "4", label: "文档评论", disabled: false },
				{ value: "5", label: "会员短消息", disabled: false },
				{ value: "6", label: "后台登录", disabled: false },
			]
		},
		{
			type: "radio",
			title: "验证码生成类型",
			field: "is_postage",
			value: "0",
			options: [
				{ value: "0", label: "数字", disabled: false },
				{ value: "1", label: "英文", disabled: true },
				{ value: "1", label: "单词", disabled: true },
			],
		},
		{
			type: "radio",
			title: "选择验证码文件类型",
			field: "is_postage",
			value: "0",
			options: [
				{ value: "0", label: "jpg", disabled: false },
				{ value: "1", label: "png", disabled: false },
				{ value: "1", label: "gif", disabled: false },
			],
		},
		{
			type: "checkbox",
			title: "验证码干扰设置",
			field: "label",
			value: ["1", ],
			options: [
				{ value: "1", label: "背景线", disabled: true },
				{ value: "2", label: "背景图像", disabled: false },
				{ value: "3", label: "混杂文本色", disabled: false },
			]
		},
		{
			"title": "验证码图片大小",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "验证码图片大小"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
		{
			"title": "验证码字符数",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "验证码字符数"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		}
	]
	const rule5 =[
		{
			type: "radio",
			title: "是否使用图片水印功能",
			field: "is_postage",
			value: "0",
			options: [
				{ value: "0", label: "开启", disabled: false },
				{ value: "1", label: "关闭", disabled: true },
			],
		},
		{
			type: "radio",
			title: "选择水印文件类型",
			field: "is_postage",
			value: "0",
			options: [
				{ value: "0", label: "jpg", disabled: false },
				{ value: "1", label: "png", disabled: false },
				{ value: "1", label: "文字", disabled: false },
			],
		},
		{
			"title": "水印图片大小",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "水印图片大小"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
		{
			"title": "图片质量",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "图片质量"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
		{
			"title": "水印透明度",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "水印透明度"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
		
		{
			type: "radio",
			title: "水印位置",
			field: "is_postage",
			value: "0",
			options: [
				{ value: "0", label: "随机位置", disabled: false },
				{ value: "1", label: "顶部居左", disabled: false },
				{ value: "2", label: "顶部居中", disabled: false },
				{ value: "3", label: "顶部居右", disabled: false },
				{ value: "4", label: "左边居中", disabled: false },
				{ value: "5", label: "图片中心", disabled: false },
				{ value: "6", label: "右边居中", disabled: false },
				{ value: "7", label: "底部居左", disabled: false },
				{ value: "8", label: "底部居中", disabled: false },
				{ value: "9", label: "底部居右", disabled: false },
			],
		},
	]
	const rule6 =[
		{
			"title": "字段中文名称",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "字段中文名称"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
		{
			"title": "字段英文名称",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "字段英文名称"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
		{
			type: "radio",
			title: "是否需要分页",
			field: "is_postage",
			value: "0",
			options: [
				{ value: "0", label: "需要", disabled: false },
				{ value: "1", label: "不需要", disabled: true },
			],
		},
		{
			type: "radio",
			title: "数据类型",
			field: "is_postage",
			value: "0",
			options: [
				{ value: "0", label: "单行文本", disabled: false },
				{ value: "1", label: "多行文本", disabled: false },
				{ value: "2", label: "HTML文本", disabled: false },
				{ value: "3", label: "数字", disabled: false },
				{ value: "4", label: "日期", disabled: false },
				{ value: "5", label: "下拉选项", disabled: false },
				{ value: "6", label: "图片", disabled: false },
			],
		},
		{
			"title": "默认值",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "默认值"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
		{
			"title": "表单长度",
			"field": "name",
			"weight": 18,
			"col": {
				"span": 24
			},
			"props": {
				"placeholder": "表单长度"
			},
			"type": "input",
			"on": {},
			"options": [],
			"children": [],
			"hidden": false,
			"display": true,
			"value": ""
		},
		{
			type: "radio",
			title: "是否公开",
			field: "is_postage",
			value: "0",
			options: [
				{ value: "0", label: "公开", disabled: false },
				{ value: "1", label: "隐藏", disabled: false },
			],
		},
		{
			type: "upload",
			field: "pic",
			title: "字段图标",
			value: [
				'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
			],
			props: {
				type: "select",
				uploadType: "image",
				action: "/upload.php",
				name: "pic",
				multiple: true,
				accept: "image\/*",
				limit: 2,
				onSuccess: function (res, file) {
					file.url = res.data.filePath;
				}
			},
		},
		
	]
	var rule= []
	if(route.query.name === '文章'){
		rule = rule1
	}else if(route.query.name === '自定义菜单'){
		rule = rule2
	}else if(route.query.name === '微信配置'){
		rule = rule3
	}else if(route.query.name === '验证安全设置'){
		rule = rule4
	}else if(route.query.name === '图片水印设置'){
		rule = rule5
	}else if(route.query.name === '字段管理'){
		rule = rule6
	}
	state.formCreateRule.rule = rule; // 将过滤后的规则赋值给表单组件
	const formData = await inputValue(projectId); // 获取项目数据
	if (formData) {
		state.formDataBox = formData;
	}
	await initFormData(formData, formRule, state);
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
	console.log('state.map111', state.map, state.markers);

	// 清除点
	state.map.remove(state.markers);
	console.log('state.map222', state.map, state.markers);
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
		// const formData = await getFormFields(formId);

		const formData = [
			{
				id: '78045efa-72a8-440c-8c52-f00295bed4b8',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'name',
				name: '文章标题',
				weight: 18,
				type: 'text',
				description: '文章标题',
				placeholder: '文章标题',
				showIf: null,
				dictId: null,
				backFill: false,
				config: null,
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: ['required'],
			},
			{
				id: '63bbc9f0-accc-4bab-a161-79069b8ef2c8',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'areaCode',
				name: '所属区县',
				weight: 17,
				type: 'select',
				description: '所属区县',
				placeholder: '所属区县',
				showIf: null,
				dictId: '50b9fac5-9386-430f-8ba3-e83a5deb4b80',
				backFill: false,
				config: {
					col: {
						span: 4,
					},
					props: {
						placeholder: '所属区县',
						allowClear: true,
						showSearch: true,
					},
				},
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '0',
				numeric: true,
				cellType: 'NUMERIC',
				special: false,
				rules: ['required'],
			},
			{
				id: 'f5b9fe5a-df13-4bf5-af92-ae3fc34ed4ec',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'Industry',
				name: '产业类别',
				weight: 16,
				type: 'select',
				description: '产业类别',
				placeholder: '产业类别',
				showIf: null,
				dictId: 'c6cca850-cb04-43b6-b09a-e6791cdbbe44',
				backFill: false,
				config: {
					col: {
						span: 4,
					},
					props: {
						placeholder: '产业类别',
						allowClear: true,
						showSearch: true,
					},
				},
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: ['required'],
			},
			{
				id: '7dbe2660-78ce-4d0b-895c-797f49ada187',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'fiveJinan',
				name: '五个济南',
				weight: 15,
				type: 'hidden',
				description: '五个济南',
				placeholder: '五个济南',
				showIf: null,
				dictId: '594b9cd9-c0ec-4905-a9dc-50fc59b51ee1',
				backFill: false,
				config: {
					col: {
						span: 4,
					},
					props: {
						placeholder: '五个济南',
					},
				},
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: [],
			},
			{
				id: 'aba04bb8-f59d-4bef-8c4a-8c7ad6e57c65',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'Company profile',
				name: '项目单位简介',
				weight: 14,
				type: 'textarea',
				description: '项目单位简介',
				placeholder: '项目单位简介',
				showIf: null,
				dictId: null,
				backFill: false,
				config: {
					col: {
						span: 24,
					},
					props: {
						type: 'textarea',
						rows: 3,
						placeholder: '项目单位简介',
					},
				},
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: [],
			},
			{
				id: '2f240992-59c5-4f14-9002-48e9253c423a',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'projectIntroduction',
				name: '合作项目概述',
				weight: 13,
				type: 'textarea',
				description: '合作项目概述',
				placeholder: '合作项目概述',
				showIf: null,
				dictId: null,
				backFill: false,
				config: {
					col: {
						span: 24,
					},
					props: {
						type: 'textarea',
						rows: 3,
						placeholder: '合作项目概述',
					},
				},
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: [],
			},
			{
				id: '9be3c73e-8b83-4d5d-b0db-477232426233',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'industryAnalysis',
				name: '行业及财务分析',
				weight: 12,
				type: 'textarea',
				description: '行业及财务分析',
				placeholder: '行业及财务分析',
				showIf: null,
				dictId: null,
				backFill: false,
				config: {
					col: {
						span: 24,
					},
					props: {
						type: 'textarea',
						rows: 3,
						placeholder: '行业及财务分析',
					},
				},
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: [],
			},
			{
				id: 'f6fefeef-3a69-4ca0-beb2-26304c334b17',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'infrastructure',
				name: '基础设施配套与政策情况',
				weight: 11,
				type: 'textarea',
				description: '基础设施配套与政策情况',
				placeholder: '基础设施配套与政策情况',
				showIf: null,
				dictId: null,
				backFill: false,
				config: {
					col: {
						span: 24,
					},
					props: {
						type: 'textarea',
						rows: 3,
						placeholder: '基础设施配套与政策情况',
					},
				},
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: [],
			},
			{
				id: '6b24fc87-fb2b-4970-8d63-549bf5d52eea',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'demand',
				name: '需求主体',
				weight: 10,
				type: 'text',
				description: '需求主体',
				placeholder: '需求主体',
				showIf: null,
				dictId: null,
				backFill: false,
				config: null,
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: [],
			},
			{
				id: '606ec2c5-ce5e-4440-ba19-88d884f64091',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'complete',
				name: '需求完成情况',
				weight: 9,
				type: 'select',
				description: '需求完成情况',
				placeholder: '需求完成情况',
				showIf: null,
				dictId: 'f6d137b4-7a4e-401b-b8c7-caf48c47d00a',
				backFill: false,
				config: null,
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: [],
			},
			{
				id: '39a7ca2e-4b82-406d-8299-33efd64a76d3',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'cooperation',
				name: '合作方式',
				weight: 8,
				type: 'text',
				description: '合作方式',
				placeholder: '合作方式',
				showIf: null,
				dictId: null,
				backFill: false,
				config: {
					col: {
						span: 6,
					},
					props: {
						placeholder: '合作方式',
					},
				},
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: [],
			},
			{
				id: 'b21c333a-ef2e-4eb3-a34a-017fee86b456',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'contacts',
				name: '联系人',
				weight: 7,
				type: 'text',
				description: '联系人',
				placeholder: '联系人',
				showIf: null,
				dictId: null,
				backFill: false,
				config: {
					col: {
						span: 6,
					},
					props: {
						placeholder: '联系人',
					},
				},
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: ['max:6'],
			},
			{
				id: 'aba6e696-86ed-48f5-960e-abebe893cbb6',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'mobile',
				name: '联系电话',
				weight: 6,
				type: 'text',
				description: '联系电话',
				placeholder: '联系电话',
				showIf: null,
				dictId: null,
				backFill: false,
				config: {
					col: {
						span: 6,
					},
					props: {
						placeholder: '联系电话',
					},
				},
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: ['max:6'],
			},
			{
				id: '2b6eaefe-b4b0-4003-b0ff-c162556818e5',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'adress',
				name: '地址',
				weight: 5,
				type: 'text',
				description: '地址',
				placeholder: '地址',
				showIf: null,
				dictId: null,
				backFill: false,
				config: null,
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: [],
			},
			{
				id: '7100ff71-97c5-4ac7-871e-3c57ef4e5106',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'email',
				name: '电子邮件',
				weight: 4,
				type: 'text',
				description: '电子邮件',
				placeholder: '电子邮件',
				showIf: null,
				dictId: null,
				backFill: false,
				config: {
					col: {
						span: 6,
					},
					props: {
						placeholder: '电子邮件',
					},
				},
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: ['max:6'],
			},
			{
				id: '1f9c5d79-2daa-48a4-8f76-95a4aea762f6',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'website',
				name: '公司网址',
				weight: 3,
				type: 'text',
				description: '公司网址',
				placeholder: '公司网址',
				showIf: null,
				dictId: null,
				backFill: false,
				config: {
					col: {
						span: 6,
					},
					props: {
						placeholder: '公司网址',
					},
				},
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: ['max:6'],
			},
			{
				id: '4f43d612-253d-4553-bbb0-28a5b88972a9',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'tags',
				name: '标签',
				weight: 2,
				type: 'selects',
				description: '标签',
				placeholder: '标签',
				showIf: null,
				dictId: 'd4ffe9b1-a4d7-4c63-bebd-00b308c69fad',
				backFill: false,
				config: null,
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: [],
			},
			{
				id: '0011e5cf-2e43-4195-acf7-7a26031fd1cd',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'attachment',
				name: '附件',
				weight: 1,
				type: 'file',
				description: '附件',
				placeholder: '附件',
				showIf: null,
				dictId: null,
				backFill: false,
				config: null,
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: [],
			},
			{
				id: '75a46f2c-bf69-4ce9-a0fd-5cb741e41808',
				userId: 'd2052e16-01d0-422e-969c-75c04ba8ac94',
				formId: 'b2e0556d-9ba8-407d-bccf-ec962b4dc5b8',
				code: 'lnglat',
				name: '经纬度',
				weight: 0,
				type: 'text',
				description: '经纬度',
				placeholder: '经纬度',
				showIf: null,
				dictId: null,
				backFill: false,
				config: null,
				createdAt: '2022-07-07T09:19:25.000+08:00',
				updatedAt: '2022-07-07T09:19:25.000+08:00',
				default: null,
				style: null,
				format: '@',
				numeric: false,
				cellType: 'BLANK',
				special: false,
				rules: [],
			},
		];
		return formData;
	}
}; // 获取项目信息
const inputValue = async (projectId) => {
	// 判断是否有项目ID，新增项目是没有项目ID的
	//if (projectId) {
	// const projectInfo = await getReportContent(projectId);
	const projectInfo = {
		"projectIntroduction": "项目位于烟台核心区，占地81亩，总建筑面积15.1万平方米，主要包括：创新成果转化中心、创新成果交易平台、创新科技展示中心、科研中心等。引入韩国汉森智能厨具、大宇智能家电等高端产业，以龙头企业的重点项目为牵引，着力打造全产业链生产服务型产业模式，利用互联网+，建设智能制造与数字创新科技领域里的环渤海经济圈顶级国际人工智能制造科技谷。",
		"website": null,
		"mobile": "18615960349",
		"adress": null,
		"demand": null,
		"tags": null,
		"Industry": "现代农业",
		"areaCode": "370688",
		"lnglat": "[\"121.231607,37.563144\",\"121.230496,37.562991\",\"121.22982,37.562757\",\"121.231017,37.562787\"]",
		"attachment": "c82228bb-2703-4ab2-ba9a-a3409bd8965b,1c683fe4-7d74-4b30-af87-c498ca7abd19,bde13954-ee95-4d1a-b094-521951b271c1",
		"fiveJinan": null,
		"infrastructure": null,
		"name": "测试",
		"Company profile": null,
		"industryAnalysis": null,
		"complete": null,
		"contacts": null,
		"email": null,
		"cooperation": null
	}
	return projectInfo;
	// } else {
	// 	return null;
	// }
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
	// let requert;
	// const FormData = await filterFormData();
	// const weight = FormData.weight ? FormData.weight : 1000000;
	// if (!id) {
	// 	requert = await saveReport(formId, {
	// 		data: FormData,
	// 		weight: weight,
	// 	});
	// } else {
	// 	requert = await uploadReport(id, {
	// 		data: FormData,
	// 		weight: weight,
	// 	});
	// }
	// let projectId = null;
	// if (id) {
	// 	projectId = id;
	// } else {
	// 	projectId = requert.data.id;
	// }
	// await submitReport(projectId);
	// await createMessage.success('提交成功！', 2.5);
	// router.go(-1);
};
const saveData = async (formId, id) => {
	// let requert;
	// const FormData = await filterFormData();
	// const weight = FormData.weight ? FormData.weight : 1000000;
	// if (!id) {
	// 	requert = await saveReport(formId, {
	// 		data: FormData,
	// 		weight: weight,
	// 	});
	// } else {
	// 	requert = await uploadReport(id, {
	// 		data: FormData,
	// 		weight: weight,
	// 	});
	// 	console.log('000');
	// }
	// await createMessage.success('保存成功！', 2.5);
	// router.go(-1);
};
// 格式化表单数据
const filterFormData = async () => {
	let ysFormData = null;
	await state.formCreateRule.fApi.submit((formData) => {
		ysFormData = formData;
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
const { formId, formCreateRule, projectId, mapBox } = toRefs(state);
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
	margin: 30px 20px;
}

.row-bg {
	margin-top: 40px;
}
</style>
