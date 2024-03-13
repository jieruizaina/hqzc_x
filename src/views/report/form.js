// import { createApp } from 'vue';
import Upload from './component/Upload';
import { maker } from '@form-create/element-ui'
import {
	getDictionary
} from '@/api/report/dictionary';
// import App from '/@/App.vue';
// const app = createApp(App);
// app.component(Upload);
// 规则转换方法，传入接口获取到的表单创建规则，转化为系统可生成界面的规则


async function ruleFormat(formRule, state) {
	// 规则存放数组
	const rule = [];
	for (let i = 0; i < formRule.length; i++) {
		const obj = {};
		// 字段名称
		obj.title = formRule[i].name;
		// 字段Value
		obj.field = formRule[i].code;
		// 字段排序
		obj.weight = formRule[i].weight;
		// 判断字段是否有配置项
		if (formRule[i].config) {
			// 关联栅格系统
			obj.col = formRule[i].config.col || {
				span: 24,
			};
			// 关联字段属性
			obj.props = formRule[i].config.props || {};
		} else {
			// 没有配置项则设为全宽，和空参数。
			obj.col = {
				span: 24,
			};
			obj.props = {};
		}
		// 声明字段验证规则
		obj.validate = [];
		// 判断验证规则有哪些
		if (formRule[i].rules.includes('required')) {
			obj.validate.push({
				required: true,
				message: '此项必填!',
			});
		}
		if (formRule[i].rules.includes('numeric')) {
			obj.props.number = true;
			obj.validate.push({
				type: 'number',
				message: '此项仅限数值!',
			});
		}
		// 表单默认值
		obj.props.placeholder = formRule[i].placeholder;
		switch (
			formRule[i].type // 判断表单类型
		) { // 分割线
			case 'divider':
				// obj.type = 'Divider';
				// //obj.title = '';
				// console.log('formRule[i].name',formRule[i].name);
				//  obj.props.value = formRule[i].name;
				//  obj.props['content-position'] = 'left'
				// // 位置
			  //	if (formRule[i].config && formRule[i].config.props && formRule[i].config.props.orientation) obj.props['content-position'] = formRule[i].config.props.orientation;
				break;
			case 'rich-textarea':
				obj.type = 'editor';
				break;
				// 多行文本类型
			case 'textarea':
				obj.type = 'input';
				break;
				// 自动完成
			case 'combobox':
				obj.type = 'autoComplete';
				obj.value = '';
				obj.props.placement = 'top-end';
				obj.props.clearable = true;
				obj.props['popper-append-to-body'] = true;
				obj.props.data = await getAutoCompleteDictData(formRule[i].dictId);
				obj.props.filterMethod = (value, option) => {
					return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
				};
				break;
				// 数字输入框
			case 'number':
				obj.type = 'InputNumber';
				obj.props.width = '100%';
				obj.props.min = 0;
				obj.value = '';
				break;
				// 隐藏文本域
			case 'hidden':
				if (obj.field.includes('addTitle')){
					// if(obj.field === 'addTitle1'){
					// 	obj.className ='titlesss title1sss'

					// }else{
					obj.className ='titlesss'
					//}
					obj.style = {color:'red'}

				}else{
					obj.type = 'hidden';

				}
				break;
				// 时间
			case 'date':
				obj.type = 'DatePicker';
				obj.props.type = 'date';
				break;
				// 时间范围
			case 'dateRange':
				obj.type = 'DatePicker';
				obj.props.type = 'daterange';
				obj.props['unlink-panels'] = true;
				break;
				// 下拉单选
			case 'select':
				obj.type = 'select';
				obj.props.clearable = true;
				obj.options = await getSelectDictData(formRule[i].dictId);
				//选择更改机构显示
				if (obj.field === 'auditOrganization') {
					//动态
					obj.on = {
						'change': (e) => {
							if (e === '担保机构') {
								state.formCreateRule.fApi.hidden(false, 'guaranteeInstitution')
								state.formCreateRule.fApi.hidden(true, 'bankingInstitution')
								state.formCreateRule.fApi.setValue('bankingInstitution', undefined);
							} else if (e === '银行机构') {
								state.formCreateRule.fApi.hidden(true, 'guaranteeInstitution')
								state.formCreateRule.fApi.hidden(false, 'bankingInstitution')
								state.formCreateRule.fApi.setValue('guaranteeInstitution', undefined);
							} else {
								state.formCreateRule.fApi.hidden(true, 'guaranteeInstitution')
								state.formCreateRule.fApi.hidden(true, 'bankingInstitution')
								state.formCreateRule.fApi.setValue('bankingInstitution', undefined);
								state.formCreateRule.fApi.setValue('guaranteeInstitution', undefined);
							}
						},
					}
				}
				break;
				// 下拉多选
			case 'selects':
				obj.type = 'select';
				obj.width = '100%';
				obj.props.mode = 'multiple';
				obj.options = await getSelectDictData(formRule[i].dictId);
				break;
				// 单选
			case 'radiobox':
				obj.type = 'radio';
				obj.options = await getSelectDictData(formRule[i].dictId);
				break;
				// 开关
			case 'switch':
				obj.type = 'switch';
				break;
				// 复选框
			case 'checkbox':
				obj.type = 'checkbox';
				obj.options = await getSelectDictData(formRule[i].dictId);
				break;
				// 级联选择
			case 'cascader':
				obj.type = 'cascader';
				obj.value = [];
				if (obj.field === 'region') {
					obj.props.options = await getTreeDictData(formRule[i].dictId, '370000');
				} else {
					obj.props.options = await getTreeDictData(formRule[i].dictId, '0');
				}
				//默认隐藏机构
				if (obj.field === 'bankingInstitution' || obj.field === 'guaranteeInstitution') {
					obj.hidden = true
				}
				break;
				// 树状选择
			case 'tree':
				obj.type = 'tree'
				//obj.props.multiple = false;
				//obj.props.showCheckbox = true;
				
				obj.props['default-expand-all'] = true;
				obj.props['show-checkbox'] = true;
				obj.props['check-strictly'] = true;
				obj.props.data = await getTreeDictData(formRule[i].dictId, '0');
				//单选
				// if (obj.field === 'bankingInstitution') {
				// 	//动态
				// 	obj.on = {
				// 		'change': (data,e,l) => {
				// 			console.log('e1',data,e,l);
				// 			state.formCreateRule.fApi.setValue('bankingInstitution', data.code);
				// 		},
				// 	}
				// }else if (obj.field === 'guaranteeInstitution') {
				// 	//动态
				// 	obj.on = {
				// 		'change': (data,e,l) => {
				// 			console.log('e1',data,e,l);
				// 			state.formCreateRule.fApi.setValue('guaranteeInstitution', data.code);
				// 		},
				// 	}
				// }
				break;
				// 单个文件上传
			case 'file':
				obj.type = 'uploadFiles';
				obj.component = Upload;
				obj.props.limitnum = 1
				if (obj.field === 'priorFinancialstatement') {
					obj.props.upType = ['pdf']
				} 
				break;
				// 多个文件上传
			case 'files': {
				obj.type = 'uploadFiles';
				obj.component = Upload;
				if (obj.field === 'priorFinancialstatement') {
					obj.props.upType = ['pdf']
				} 
				break;
			}
			// 默认为单行文本框
			default:
				obj.type = 'input';
		}
		rule.push(obj);
	}
	return rule;
}

// 初始化表单数据
async function initFormData(formData, rule, state) {
	if (formData) {
		for (const key in formData) {
			rule.map((val) => {
				if (
					val.field === key &&
					(val.type === 'select' ||
						val.type === 'selects' ||
						val.type === 'checkbox' ||
						val.type === 'cascader' ||
						val.type === 'tree' ||
						val.type === 'treeSelect' ||
						val.type === 'file' ||
						val.type === 'files' ||
						val.type === 'uploadFiles' ||
						(val.type === 'DatePicker' && val.props.type === 'daterange'))
				) {
					const formD = formData[key] && formData[key].split(',').length>1 ? formData[key].split(',') : formData[key];
					state.formCreateRule.fApi.setValue(key, formD);
					const e = state.formCreateRule.fApi.getValue('auditOrganization')
					if(e){
						if (e.toString() === '担保机构') {
							state.formCreateRule.fApi.hidden(false, 'guaranteeInstitution')
							state.formCreateRule.fApi.hidden(true, 'bankingInstitution')
							//state.formCreateRule.fApi.setValue('bankingInstitution', undefined);
						} else if (e.toString() === '银行机构') {
							state.formCreateRule.fApi.hidden(true, 'guaranteeInstitution')
							state.formCreateRule.fApi.hidden(false, 'bankingInstitution')
							//state.formCreateRule.fApi.setValue('guaranteeInstitution', undefined);
						}
					}
				 }
				 else if (val.field === key && val.type === 'InputNumber') {
					state.formCreateRule.fApi.setValue(key, parseInt(formData[key]));
				} else if (val.field === key && val.type === 'switch') {
					state.formCreateRule.fApi.setValue(key, formData[key]);
				} else if (val.field === key) {
					if (val.field === 'lnglat') {
						if (state.formDataBox.lnglat) {
							state.lnglat = JSON.parse(formData[key]);
							JSON.parse(formData[key]).map((val) => {
								const marker = new state.AMap.Marker({
									position: [val.split(',')[0], val.split(',')[1]], // 标记当前的坐标
									icon: new state.AMap.Icon({
										size: new state.AMap.Size(30, 32),
										imageSize: new state.AMap.Size(30, 32),
									}),
								});
								state.map.add([marker]);
								state.markers.push(marker);
							});
						}
						// 自适应所有覆盖物
						state.map.setFitView();
						state.formCreateRule.fApi.setValue(key, formData[key]);
					} else if (val.field === 'rangeDimension') {
						if (state.formDataBox.rangeDimension) {
							const rangeDimension = JSON.parse(formData[key]);
							state.rangeDimension = JSON.parse(formData[key]);
							rangeDimension.map((val) => {
								const polygon = new state.AMap.Polygon({
									path: val,
									fillColor: '#fb8c00',
									strokeOpacity: 1,
									fillOpacity: 0.3,
									strokeColor: '#fb8c00',
									strokeWeight: 3,
									strokeStyle: 'solid',
									strokeDasharray: [5, 5],
								});
								state.map.add(polygon);
								state.polygons.push(polygon);
							});
						}
						// 自适应所有覆盖物
						state.map.setFitView();
						state.formCreateRule.fApi.setValue(key, formData[key]);
					} else {
						let data = formData[key];
						for (let i = 0; i < val.validate.length; i++) {
							if (val.validate[i].type && val.validate[i].type === 'number') {
								data = parseInt(formData[key]);
								break;
							}
						}
						state.formCreateRule.fApi.setValue(key,data);
					}
				}
			});
		}
	}
}
async function getSelectDictData(dictId) {
	const select = [];
	await getDictionary(dictId).then((res) => {
		const resData = res.data;
		resData.map((val) => {
			select.push({
				value: val.code,
				label: val.name,
			});
		});
	});
	return select;
}
// 获取自动补全数据
async function getAutoCompleteDictData(dictId) {
	const select = [];
	if (dictId) {
		await getDictionary(dictId).then((res) => {
			const resData = res.data.data;
			resData.map((val) => {
				select.push(val.code);
			});
		});
	}
	return select;
}

// 获取树形数据1
async function getTreeDictData(dictId, cityId) {
	let tree = [];
	if (dictId) {
		await getDictionary(dictId).then((res) => {
			console.log('res',res);
			const resData = res.data;
			resData.map((val) => {
				val.cid = val.id;
				// 级联菜单
				val.value = val.code;
				val.label = val.name;
				// 树状菜单
				val.title = val.name;
				val.id = val.code;
				val.key = val.code;
			});
			tree = treeData(resData, cityId);
		});
	}
	console.log('tree',tree);
	return tree;
}

// 格式化用户组数据返回树形结构
function treeData(sourceData, id) {
	const cloneData = JSON.parse(JSON.stringify(sourceData));
	return cloneData.filter((father) => {
		const branchArr = cloneData.filter((child) => father.cid === child.parentId);
		branchArr.length > 0 ? (father.children = branchArr) : delete father.children;
		return father.parentId + '' === id + '';
	});
}

function dataFormat(data, rule) {
	const ruleData = {};
	rule.map((val) => {
		ruleData[val.field] = val;
	});
	const arrField = ['select', 'selects', 'cascader', 'radio', 'UploadFiles', 'upload'];
	for (const key in data) {
		if (arrField.includes(ruleData[key].type)) {
			data[key] && (data[key] = data[key].split(','));
		}
	}
	return data;
}
export {
	ruleFormat,
	initFormData,
	getSelectDictData,
	getTreeDictData,
	treeData,
	dataFormat
};