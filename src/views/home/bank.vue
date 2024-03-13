<template>
	<div class="bank">
		<div class="title">
			<div>
				Cooperative Financial Institutions
				<b>合作金融机构</b>
			</div>
		</div>
		<div class="list">
			<div v-for="item in articles" @click="see(item, 'bank')">
				<img :src="item.data.covers" alt="">
			</div>
		</div>
		<div class="more">
			<el-button type="primary" color="#00469B" plain round @click="seelist()">查看更多></el-button>
		</div>
		<div class="title">
			<div>
				Suggestions
				<b>您的建议</b>
			</div>
		</div>
    <div class="recommendation">
      <div class="recommendation_box">
        <textarea name="" id="recom" cols="30" rows="10" v-model="recomForm.opinion" placeholder="请输入"></textarea>
      </div>
      <div class="recom_box">
		<p></p>
			  <div class="recom" @click="recomClick()">提交</div>
		  </div>
    </div>
	</div>
</template>

<script setup name="bank">
import { getQuery, getDetail, patchDetail, getFavorites, putFavorites, deleteFavorites,saveReport } from "@/api/report/index";
import { getFiless } from "@/api/report/form.js";
import { getInfo} from '@/api/login';
import { ElMessageBox, ElMessage } from "element-plus";
const route = useRoute()
const router = useRouter();
const state = reactive({
	//栏目formId
	lmformId: '76b8b8f1-ece3-48f6-bc7b-f4f0b3db12ad',
	//文章formId
	wzformId: '78aaec41-7077-49f6-ae2d-647fd22d1369',
	//合作银行Id
	yhId: '23573f45-30ba-4997-aa75-797638f97b04',
	articles: [],
	columnName: '合作金融机构',
	yhColumns: [],
	recomForm:{
        opinion:'',
        tel:'',
        name:''
      }
})
const { articles, yhColumns,recomForm } = toRefs(state)
onMounted(() => {
	getArticles(state.yhId)
	getcgColumns()
	
})
function getArticles(columnId) {
	const params = {
		_from: 'public',
		formId: state.wzformId,
		isShow: 'true',
		cover: 'VALID',
		columnId,
		customAttribute: '首页',
		page: 0,
		size: 20
	}
	getQuery(params).then(res => {
		state.articles = res.data.content
		console.log('res', res);
		state.articles.map(async val => {
			const resp = await getFiless({ ids: val.data.cover })
			val.data.covers = resp.data[0].url
		})
	})
}
function recomClick(){
      if(state.recomForm.opinion!=''){
		getme()
      const data= state.recomForm
      saveReport("f00e9648-2841-4968-9efa-8695698c29e2",{data}).then(res=>{
        if(res.code==200){
          state.recomForm.opinion=''
		  ElMessage({
			message: '提交成功',
			type: 'success',
		})
        }
      })
      }else{
		ElMessage({
			message: '请输入内容',
			type: 'none',
		})
      }

    }
function getcgColumns() {
	const params = {
		_from: 'public',
		formId: state.lmformId,
		isShow: 'true',
		columnId: state.yhId,
		page: 0,
		size: 2
	}
	getQuery(params).then(res => {
		state.yhColumns = res.data.content
	})
}
function getme() {
          getInfo().then(res => {
			state.recomForm.name=res.data.nickname
    		state.recomForm.tel=res.data.mobile
          })
      }
function see(item, type) {
	router.push({ path: "/details", query: { type: type, id: item.id, formId: item.formId, columnName: state.columnName } });
}
function seelist() {
	router.push({ path: "/news/list", query: { parentId: state.yhColumns[0].id, columnId: state.yhId, columnName: state.columnName, type: 'bank' } });
}

</script>

<style scoped lang="scss">
.bank {
	margin: 0 auto;
	width: 1200px;
	margin-top: 60px;
	margin-bottom: 45px;

	.title {
		padding: 45px 0 32px 0;
		display: flex;
		justify-content: space-between;

		div {
			min-width: 600px;
			font-size: 48px;
			font-family: Microsoft YaHei, Microsoft YaHei-Bold;
			font-weight: 700;
			text-align: left;
			color: #d2dcf1;
			position: relative;

			b {
				font-size: 42px;
				font-family: Microsoft YaHei, Microsoft YaHei-Bold;
				font-weight: 700;
				text-align: center;
				color: #333333;
				position: absolute;
				left: 0;
				top: -14px;
			}
		}
	}

	.list {
		overflow: auto;

		div {
			cursor: pointer;
			width: 160px;
			height: 102px;
			background: #ffffff;
			border: 0.5px solid #e0e0e0;
			text-align: center;
			display: flex;
			align-items: center;
			float: left;

			img {
				width: 100%;
				max-height: 100%;
			}
		}
	}

	.more {
		display: flex;
		justify-content: center;
		margin-top: 28px;
	}
}
.case_title {
	display: flex;
	// justify-content: center;
	// padding-bottom: 10px;
}

.case_title_size {
	font-size: 32px;
	font-weight: 700;
	z-index: 10;
}

.case_title_shadow {
	color: #dde2ed;
	font-size: 30px;
	font-weight: 700;
	position: absolute;
	margin-top: 55px;
	z-index: 1;
}
.recommendation{
  width: 100%;
//   padding: 20px 16px;
}
.recommendation_box{
  width: 100%;
  padding:10px 6px ;
  background: #f5f7fa;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
}
.recommendation_box>textarea{
  border: none;
  width: 100%;
  height: 100px;
  background: #f5f7fa;
  font-size: 16px;
}
.recom_box{
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

}
.recom{
  width: 84px;
  height: 30px;
  background: #004098;
//   border-radius: 21.5px;
font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
#recom{
 border: none;
 resize:none;
 outline:none;
}
#recom :focus{
 outline:none;
 border: none;
}
</style>

