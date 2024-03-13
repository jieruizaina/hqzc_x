<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
         <el-form-item label="标题" prop="jobName">
            <el-input
               v-model="queryParams.jobName"
               placeholder="请输入标题"
               clearable
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="所属栏目" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择所属栏目" clearable>
               <el-option
                  v-for="dict in sys_job_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item label="排序" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择排序" clearable>
               <el-option
                  v-for="dict in sys_job_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item label="属性" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择属性" clearable>
               <el-option
                  v-for="dict in sys_job_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="primary"
               plain
               icon="Plus"
               @click="handleAdd"
               v-hasPermi="['monitor:job:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="success"
               plain
               icon="Edit"
               :disabled="single"
               @click="handleUpdate"
               v-hasPermi="['monitor:job:edit']"
            >修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="Delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['monitor:job:remove']"
            >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               icon="Download"
               @click="handleExport"
               v-hasPermi="['monitor:job:export']"
            >导出</el-button>
         </el-col>
				 <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['monitor:job:remove']"
            >推荐</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="jobList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="编号" width="100" align="center" prop="jobId" />
         <el-table-column label="标题" align="center" prop="jobName" :show-overflow-tooltip="true" />
         <el-table-column label="更新时间" align="center" prop="createTime" :show-overflow-tooltip="true" />
         <el-table-column label="类目" align="center" prop="category" :show-overflow-tooltip="true" />
         <el-table-column label="点击" align="center" prop="clickNum" :show-overflow-tooltip="true" />
         <el-table-column label="权限" align="center">
            <template #default="scope">
               <el-switch
                  v-model="scope.row.status"
                  active-value="0"
                  inactive-value="1"
                  @change="handleStatusChange(scope.row)"
               ></el-switch>
            </template>
         </el-table-column>
         <el-table-column label="状态" align="center" prop="condition" :show-overflow-tooltip="true" />
         <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button
                  type="text"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:notice:remove']"
               >删除</el-button>
               <el-button
                  type="text"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:notice:edit']"
               >修改</el-button>
							 
               <el-button
                  type="text"
                     @click="handleView(scope.row)"
                     v-hasPermi="['monitor:job:query']"
               >预览</el-button>
            </template>
         </el-table-column>
      </el-table>

      <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize"
         @pagination="getList"
      />

      <!-- 添加或修改定时文章对话框 -->
      <el-dialog :title="title" v-model="open" width="800px" append-to-body>
         <el-form ref="jobRef" :model="form" :rules="rules" label-width="120px">
            <el-row>
               <el-col :span="12">
                  <el-form-item label="标题" prop="jobName">
                     <el-input v-model="form.jobName" placeholder="请输入标题" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="文章分组" prop="tel">
                     <el-select v-model="form.tel" placeholder="请选择">
                        <el-option
                           v-for="dict in sys_job_group"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"
                        ></el-option>
                     </el-select>
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item prop="invokeTarget">
                     <template #label>
                        <span>
                           调用方法
                           <el-tooltip placement="top">
                              <template #content>
                                 <div>
                                    Bean调用示例：ryTask.ryParams('ry')
                                    <br />Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
                                    <br />参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                                 </div>
                              </template>
                              <el-icon><question-filled /></el-icon>
                           </el-tooltip>
                        </span>
                     </template>
                     <el-input v-model="form.invokeTarget" placeholder="请输入调用目标字符串" />
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="cron表达式" prop="cronExpression">
                     <el-input v-model="form.cronExpression" placeholder="请输入cron执行表达式">
                        <template #append>
                           <el-button type="primary" @click="handleShowCron">
                              生成表达式
                              <i class="el-icon-time el-icon--right"></i>
                           </el-button>
                        </template>
                     </el-input>
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="执行策略" prop="misfirePolicy">
                     <el-radio-group v-model="form.misfirePolicy">
                        <el-radio-button label="1">立即执行</el-radio-button>
                        <el-radio-button label="2">执行一次</el-radio-button>
                        <el-radio-button label="3">放弃执行</el-radio-button>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="是否并发" prop="concurrent">
                     <el-radio-group v-model="form.concurrent">
                        <el-radio-button label="0">允许</el-radio-button>
                        <el-radio-button label="1">禁止</el-radio-button>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="状态">
                     <el-radio-group v-model="form.status">
                        <el-radio
                           v-for="dict in sys_job_status"
                           :key="dict.value"
                           :label="dict.value"
                        >{{ dict.label }}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
            </el-row>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitForm">确 定</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>
 
      <!-- 文章日志详细 -->
      <el-dialog title="文章详细" v-model="openView" width="80%" append-to-body>
         <div class="article">
					<div class="title">
						<h2>2022惠享山东消费年正式启动</h2>
					</div>
					<el-divider />
					<div class="fit">
						<span>发布日期：2022-07-01</span><span>信息来源：山东省商务厅</span
						><span>浏览次数：29</span>
					</div>
					<div class="content">
						<span>7月8日，国美电器济南区域分公司召开“2022山东惠享山东消费年·第13届山东家电届暨国美22周年庆惠民补贴”活动。据悉，从7月15-7月31日，届时将拿出千万元补贴山东消费者，登陆齐鲁工惠APP、“惠享山东”“济南国美”微信公众号每人至高领取600元家电补贴，并推出银行分期补贴至高500元、以旧换新至高补贴400元、成套购买再补贴10%、在服务上，全场家电24小时送装，部分商品2小时速达等一些惠民措施回馈消费者。同时，济南国美电器正在全力打造的真快乐App体验中心——国美电器济南西门店城市体验馆将于9月正式亮相。这是国美在济南的首家真快乐App线下体验中心，将带给消费者不一样的沉浸式购物体验。
							　　据了解，山东省发改委服务业处处长张丽、山东省商务厅二级调研员王春报、山东广播电视台数据舆情中心主任
							齐鲁网总编辑谭鲁民、山东省总工会宣教部副部长孙利斌、济南市发改委服务业处副处长周建建、济南市商务局党组成员李旭之、山东省消费者协会消费指导部主任王庆敏、山东省家用电器行业协会秘书长英成才、历下区商务局副局长王诗虹共同出席了此次发布会，
							山东省商务厅二级调研员王春报、齐鲁银行无影山支行行长李晶等领导对济南国美22周年活动表示了热烈祝贺和对活动的支持。7月8日，国美电器济南区域分公司召开“2022山东惠享山东消费年·第13届山东家电届暨国美22周年庆惠民补贴”活动。据悉，从7月15-7月31日，届时将拿出千万元补贴山东消费者，登陆齐鲁工惠APP、“惠享山东”“济南国美”微信公众号每人至高领取600元家电补贴，并推出银行分期补贴至高500元、以旧换新至高补贴400元、成套购买再补贴10%、在服务上，全场家电24小时送装，部分商品2小时速达等一些惠民措施回馈消费者。同时，济南国美电器正在全力打造的真快乐App体验中心——国美电器济南西门店城市体验馆将于9月正式亮相。这是国美在济南的首家真快乐App线下体验中心，将带给消费者不一样的沉浸式购物体验。
							　　据了解，山东省发改委服务业处处长张丽、山东省商务厅二级调研员王春报、山东广播电视台数据舆情中心主任
							齐鲁网总编辑谭鲁民、山东省总工会宣教部副部长孙利斌、济南市发改委服务业处副处长周建建、济南市商务局党组成员李旭之、山东省消费者协会消费指导部主任王庆敏、山东省家用电器行业协会秘书长英成才、历下区商务局副局长王诗虹共同出席了此次发布会，
							山东省商务厅二级调研员王春报、齐鲁银行无影山支行行长李晶等领导对济南国美22周年活动表示了热烈祝贺和对活动的支持。7月8日，国美电器济南区域分公司召开“2022山东惠享山东消费年·第13届山东家电届暨国美22周年庆惠民补贴”活动。据悉，从7月15-7月31日，届时将拿出千万元补贴山东消费者，登陆齐鲁工惠APP、“惠享山东”“济南国美”微信公众号每人至高领取600元家电补贴，并推出银行分期补贴至高500元、以旧换新至高补贴400元、成套购买再补贴10%、在服务上，全场家电24小时送装，部分商品2小时速达等一些惠民措施回馈消费者。同时，济南国美电器正在全力打造的真快乐App体验中心——国美电器济南西门店城市体验馆将于9月正式亮相。这是国美在济南的首家真快乐App线下体验中心，将带给消费者不一样的沉浸式购物体验。
							　　据了解，山东省发改委服务业处处长张丽、山东省商务厅二级调研员王春报、山东广播电视台数据舆情中心主任
							齐鲁网总编辑谭鲁民、山东省总工会宣教部副部长孙利斌、济南市发改委服务业处副处长周建建、济南市商务局党组成员李旭之、山东省消费者协会消费指导部主任王庆敏、山东省家用电器行业协会秘书长英成才、历下区商务局副局长王诗虹共同出席了此次发布会，
							山东省商务厅二级调研员王春报、齐鲁银行无影山支行行长李晶等领导对济南国美22周年活动表示了热烈祝贺和对活动的支持。</span>
					</div>
				</div>
      </el-dialog>
   </div>
</template>

<script setup name="Job">
import { listJob, getJob, delJob, addJob, updateJob, runJob, changeJobStatus } from "@/api/monitor/job";

const router = useRouter();
const { proxy } = getCurrentInstance();
const { sys_job_group, sys_job_status } = proxy.useDict("sys_job_group", "sys_job_status");

const jobList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const openView = ref(false);
const openCron = ref(false);
const expression = ref("");
const dateRange = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    jobName: undefined,
    tel: undefined,
    status: undefined
  },
  rules: {
    jobName: [{ required: true, message: "标题不能为空", trigger: "blur" }],
    invokeTarget: [{ required: true, message: "调用目标字符串不能为空", trigger: "blur" }],
    cronExpression: [{ required: true, message: "cron执行表达式不能为空", trigger: "blur" }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询定时文章列表 */
function getList() {
  loading.value = true;
  // listJob(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
  //   jobList.value = response.rows;
  //   total.value = response.total;
  //   loading.value = false;
  // });
	jobList.value = [{
		concurrent: "1",
		createBy: "admin",
		createTime: "2022-08-01 12:01:58",
		cronExpression: "0/10 * * * * ?",
		invokeTarget: "ryTask.ryNoParams",
		tel: "13064036666",
		jobId: 1,
		jobName: "2004年中国人权事业的进展中",
		misfirePolicy: "3",
		nextValidTime: "2022-08-01 14:18:30",
		params: {},
		remark: "",
		searchValue: null,
		status: "1",
		category:'政策法规',
		clickNum:'121',
		createTime:'2022-08-01 14:01:01',
		condition:'通过',
		updateBy: null,
		updateTime: null}
]
	console.log('jobList.value',jobList.value);
	total.value = 1;
	loading.value = false;
}
/** 联系方式字典翻译 */
function telFormat(row, column) {
  return proxy.selectDictLabel(sys_job_group.value, row.tel);
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    jobId: undefined,
    jobName: undefined,
    tel: undefined,
    invokeTarget: undefined,
    cronExpression: undefined,
    misfirePolicy: 1,
    concurrent: 1,
    status: "0"
  };
  proxy.resetForm("jobRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}
// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.jobId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
// 更多操作触发
function handleCommand(command, row) {
  switch (command) {
    case "handleRun":
      handleRun(row);
      break;
    case "handleView":
      handleView(row);
      break;
    case "handleJobLog":
      handleJobLog(row);
      break;
    default:
      break;
  }
}
// 所属栏目修改
function handleStatusChange(row) {
  let text = row.status === "0" ? "开放" : "隐藏";
  proxy.$modal.confirm('确认要"' + text + '""' + row.jobName + '"文章吗?').then(function () {
    return changeJobStatus(row.jobId, row.status);
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.status = row.status === "0" ? "1" : "0";
  });
}
/* 立即执行一次 */
function handleRun(row) {
  proxy.$modal.confirm('确认要立即执行一次"' + row.jobName + '"文章吗?').then(function () {
    return runJob(row.jobId, row.tel);
  }).then(() => {
    proxy.$modal.msgSuccess("执行成功");})
  .catch(() => {});
}
/** 文章详细信息 */
function handleView(row) {
  getJob(row.jobId).then(response => {
    form.value = response.data;
    openView.value = true;
  });
}
/** cron表达式按钮操作 */
function handleShowCron() {
  expression.value = form.value.cronExpression;
  openCron.value = true;
}
/** 确定后回传值 */
function crontabFill(value) {
  form.value.cronExpression = value;
}
/** 文章日志列表查询 */
function handleJobLog(row) {
  const jobId = row.jobId || 0;
  router.push({ path: "/monitor/job-log/index", query: { jobId: jobId } });
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  // open.value = true;
  // title.value = "添加文章";
  router.push({ path: "/admin/information/report",query:{name:'文章'}});
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  // const jobId = row.jobId || ids.value;
  // getJob(jobId).then(response => {
  //   form.value = response.data;
  //   open.value = true;
  //   title.value = "修改文章";
  // });
  router.push({ path: "/admin/information/report",query:{name:'文章'}});
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["jobRef"].validate(valid => {
    if (valid) {
      if (form.value.jobId != undefined) {
        updateJob(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addJob(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  const jobIds = row.jobId || ids.value;
  proxy.$modal.confirm('是否确认删除定时文章编号为"' + jobIds + '"的数据项?').then(function () {
    return delJob(jobIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("monitor/job/export", {
    ...queryParams.value,
  }, `job_${new Date().getTime()}.xlsx`);
}

getList();
</script>
<style lang="scss" scoped>
	.article{
		.title{
			display: flex;
			justify-content: center;
		}
		.fit{
			display: flex;
			justify-content: space-around;

		}
		.content{
			margin-top: 20px;
		}
	}
</style>
