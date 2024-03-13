import file from './file';
import dictionary from './dictionary';
class Details {
  // 需要转为数组的字段类型
  toArr = ['select', 'selects', 'cascader', 'radio', 'tree','radiobox'];
  // 需要替换成地址的表单类型
  toFileUrl = ['files', 'file','uploadFiles'];
  // 必须显示的列表
  showList = [];
  // 必须隐藏的列表
  hideList = [];
  // 显示上次更改
  last = false;
  // 合并字段名称与字段数据。参数1：表单规则；参数2：表单数据
  mergeData (formRole, formData) {
    // 表单数据对象
    // const formDataObj = [];
    // 规则字典对象
    // const formRoleObj = {};
    // 填报数据存放对象
    const detailsData = [];
    formRole.data.map(role => {
      // 根据规则创建数据项
      const dataObj = {};
      dataObj.name = role.name;
      dataObj.type = role.type;
      dataObj.code = role.code;
      dataObj.dictId = role.dictId;
      dataObj.weight = role.weight;
      dataObj.value = formData.data[role.code] ? formData.data[role.code] : null;
      detailsData.push(dataObj);
    });
    return detailsData;
  }

  async detailsData (formRole, formData) {
    const reportData = await this.mergeData(formRole, formData);
		for (let inx = 0; inx < reportData.length; inx++) {
			
      // 是绑定字典的表单项并且有值
      if (this.toArr.includes(reportData[inx].type) && reportData[inx].value) {
        const codes = reportData[inx].value.split(',');
        reportData[inx].value = [];
        for (const code of codes) {
          const codeName = await dictionary.codeToName(reportData[inx].dictId, code);
          reportData[inx].value.push(codeName);
        }
        if (reportData[inx].code !== 'tags') {
          reportData[inx].value = reportData[inx].value.toString();
        }
        // 是文件上传项，并且有值
      } else if (this.toFileUrl.includes(reportData[inx].type) && reportData[inx].value) {
        reportData[inx].value = await file.idToUrl({ids:reportData[inx].value});
      } else{
        // val.value = val.value;
      }
			
		}
    // reportData.map(async (val) => {
    //   // 是绑定字典的表单项并且有值
    //   if (this.toArr.includes(val.type) && val.value) {
    //     const codes = val.value.split(',');
    //     val.value = [];
    //     for (const code of codes) {
    //       const codeName = await dictionary.codeToName(val.dictId, code);
    //       val.value.push(codeName);
    //     }
    //     if (val.code !== 'tags') {
    //       val.value = val.value.toString();
    //     }
    //     // 是文件上传项，并且有值
    //   } else if (this.toFileUrl.includes(val.type) && val.value) {
    //     val.value = await file.idToUrl(val.value);
    //   } else{
    //     // val.value = val.value;
    //   }
    // });
    return reportData;
  }
}
export default new Details();
