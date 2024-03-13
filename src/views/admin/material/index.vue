<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="载体名称" prop="jobName">
				<el-input v-model="queryParams.jobName" placeholder="请输入载体名称" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="载体类型" prop="status">
				<el-select v-model="queryParams.status" placeholder="请选择载体类型" clearable>
					<el-option v-for="dict in sys_job_status" :key="dict.value" :label="dict.label" :value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['monitor:job:add']">新增</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
					v-hasPermi="['monitor:job:edit']">修改</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['monitor:job:remove']">删除</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['monitor:job:export']">导出
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain :disabled="multiple" @click="handleDelete" v-hasPermi="['monitor:job:remove']">上线
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain :disabled="multiple" @click="handleDelete" v-hasPermi="['monitor:job:remove']">下线
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="jobList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="编号" width="100" align="center" prop="jobId" />
			<el-table-column label="载体名称" align="center" prop="jobName" :show-overflow-tooltip="true" />
			<el-table-column label="载体类型" align="center" prop="jobType" :show-overflow-tooltip="true" />
			<el-table-column label="状态" align="center">
				<template #default="scope">
					<el-switch v-model="scope.row.status" active-value="0" inactive-value="1"
						@change="handleStatusChange(scope.row)"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true" />
			<el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button type="text" @click="handleDelete(scope.row)" v-hasPermi="['system:notice:remove']">删除</el-button>
					<el-button type="text" @click="handleUpdate(scope.row)" v-hasPermi="['system:notice:edit']">修改</el-button>
					<el-button type="text" @click="handleView(scope.row)" v-hasPermi="['monitor:job:query']">查看</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改定时载体对话框 -->
		<el-dialog :title="title" v-model="open" width="800px" append-to-body>
			<el-form ref="jobRef" :model="form" :rules="rules" label-width="120px">
				<el-row>
					<el-col :span="12">
						<el-form-item label="载体名称" prop="jobName">
							<el-input v-model="form.jobName" placeholder="请输入载体名称" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="载体类型" prop="tel">
							<el-select v-model="form.tel" placeholder="请选择">
								<el-option v-for="dict in sys_job_group" :key="dict.value" :label="dict.label" :value="dict.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所属区县" prop="tel">
							<el-select v-model="form.tel" placeholder="请选择">
								<el-option v-for="dict in sys_job_group" :key="dict.value" :label="dict.label" :value="dict.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="地址" prop="jobNames">
							<el-input v-model="form.jobNames" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态">
							<el-radio-group v-model="form.status">
								<el-radio v-for="dict in sys_job_status" :key="dict.value" :label="dict.value">{{ dict.label }}
								</el-radio>
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

		<!-- 载体日志详细 -->
		<el-dialog title="载体详情" v-model="openView" width="700px" append-to-body >
			<el-form :model="form" label-width="120px">
				<el-row>
					<el-col :span="12">
						<el-form-item label="载体名称：">汉峪金谷</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="载体类型：">特色产业楼宇</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所属区县：">高新区</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="地址：">济南市高新区汉峪金谷</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态：">上线</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="openView = false">关 闭</el-button>
				</div>
			</template>
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
		jobName: [{ required: true, message: "载体名称不能为空", trigger: "blur" }],
		invokeTarget: [{ required: true, message: "调用目标字符串不能为空", trigger: "blur" }],
		cronExpression: [{ required: true, message: "cron执行表达式不能为空", trigger: "blur" }]
	}
});

const { queryParams, form, rules } = toRefs(data);

/** 查询定时载体列表 */
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
		adress: "济南市高新区汉峪金谷",
		jobId: 1,
		jobName: "汉峪金谷",
		misfirePolicy: "3",
		nextValidTime: "2022-08-01 14:18:30",
		params: {},
		remark: "",
		searchValue: null,
		status: "1",
		content: '2004年中国人权事业的进展中',
		contentSpot: '惠民惠企政策',
		createTime: '2022-08-01 14:01:01',
		jobType: '智能制造',
		updateBy: null,
		updateTime: null
	}
	]
	console.log('jobList.value', jobList.value);
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
// 载体类型修改
function handleStatusChange(row) {
	let text = row.status === "0" ? "启用" : "停用";
	proxy.$modal.confirm('确认要"' + text + '""' + row.jobName + '"载体吗?').then(function () {
		return changeJobStatus(row.jobId, row.status);
	}).then(() => {
		proxy.$modal.msgSuccess(text + "成功");
	}).catch(function () {
		row.status = row.status === "0" ? "1" : "0";
	});
}
/* 立即执行一次 */
function handleRun(row) {
	proxy.$modal.confirm('确认要立即执行一次"' + row.jobName + '"载体吗?').then(function () {
		return runJob(row.jobId, row.tel);
	}).then(() => {
		proxy.$modal.msgSuccess("执行成功");
	})
		.catch(() => { });
}
/** 载体详细信息 */
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
/** 载体日志列表查询 */
function handleJobLog(row) {
	const jobId = row.jobId || 0;
	router.push({ path: "/monitor/job-log/index", query: { jobId: jobId } });
}
/** 新增按钮操作 */
function handleAdd() {
	reset();
	open.value = true;
	title.value = "添加载体";
}
/** 修改按钮操作 */
function handleUpdate(row) {
	reset();
	const jobId = row.jobId || ids.value;
	getJob(jobId).then(response => {
		form.value = response.data;
		open.value = true;
		title.value = "修改载体";
	});
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
	proxy.$modal.confirm('是否确认删除定时载体编号为"' + jobIds + '"的数据项?').then(function () {
		return delJob(jobIds);
	}).then(() => {
		getList();
		proxy.$modal.msgSuccess("删除成功");
	}).catch(() => { });
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
.el-dialog__body h2 {
	margin: 0;
}
</style>
