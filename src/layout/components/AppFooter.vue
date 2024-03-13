<template>
  <div class="footer">
		<div class="footer-contents">
			<div class="footer-content">
				<div class="img"><img src="../../assets/images/logo1.png" alt=""></div>
				<div class="unit">
					<b>友情链接</b>
					<a href="http://commerce.shandong.gov.cn/" target="_blank" >山东省商务厅</a>
					<a href="http://www.shandong.gov.cn/" target="_blank" >山东省人民政府</a>
					<a href="http://czt.shandong.gov.cn/" target="_blank" >山东省财政厅</a>
					<a href="http://www.cbirc.gov.cn/branch/shandong/view/pages/index/index.html" target="_blank" >山东省银保监局</a>
					<a href="http://dfjrjgj.shandong.gov.cn/" target="_blank" >山东省地方金融监督管理局</a>
					<a href="http://jinan.pbc.gov.cn/jinan/120947/index.html" target="_blank" >人民银行济南分行</a>
					<a href="http://jinan.customs.gov.cn/" target="_blank" >中华人民共和国济南海关</a>
					<a href="http://ningbo.customs.gov.cn/qingdao_customs/index/index.html" target="_blank" >中华人民共和国青岛海关</a>
				</div>
			</div>
		</div>
		<div class="footer-bottom">
			<span>© 山东商务惠企服务平台版权所有</span>
			<span>备案证号：鲁ICP备05051451号</span>
		</div>
  </div>
</template>

<script setup>

</script>

<style lang='scss' scoped>
	.footer{
		background-color: #004098;
    min-width: 1200px
	}
	.footer-contents{
		border-bottom: 1px solid #66B4EA;
	}
	.footer-content{
		margin: 0 auto;
		width: 1200px;
		padding: 30px 0;
		display: flex;
		align-items: center;
		.img{
			width: 165px;
			min-height: 69px;
			img{
				width: 100%;
				height: 100%;
				min-height: 69px;
			}
		}
		.unit{
			//width: 260px;
			padding: 0 48px;
			border-right:1px solid #66B4EA;
			b{
				display: block;
				font-size: 12px;
				font-family: Microsoft YaHei, Microsoft YaHei-Bold;
				font-weight: 700;
				text-align: left;
				color: #ffffff;
				margin-bottom: 14px;
			}
			a{
				float: left;
				opacity: 0.8;
				font-size: 10.5px;
				font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				font-weight: 400;
				color: #ffffff;
				line-height: 24px;
				margin-right:24px;
			}
			// span:nth-child(even){
			// 	margin-right: 12px;
			// }
		}
		.unit:last-child{
			border: none;
		}
	}
	.footer-bottom{
		margin: 0 auto;
		min-width: 1200px;
		height: 50px;
		line-height: 50px;
		font-size: 10.5px;
		font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		font-weight: 400;
		text-align: center;
		color: #ffffff;
		span{
			padding: 0 15px;
		}
	}
</style>
