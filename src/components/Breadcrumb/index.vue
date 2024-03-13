<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">惠企政策</span>
        <a v-else @click.prevent="handleLink(item)">惠企政策</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const levelList = ref([])

function getBreadcrumb() {
  // only show routes with meta.title
  let matched = route.matched.filter(item => item.meta && item.meta.title);
  const first = matched[0]
  // 判断是否为首页
  if (!isDashboard(first)) {
    matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched)
  }

  levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
}
function isDashboard(route) {
  const name = route && route.name
  if (!name) {
    return false
  }
  return name.trim() === 'Index'
}
function handleLink(item) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}

watchEffect(() => {
  // if you go to the redirect page, do not update the breadcrumbs
  if (route.path.startsWith('/redirect/')) {
    return
  }
  getBreadcrumb()
})
getBreadcrumb();
</script>

<style lang='scss' scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height:60px;
  margin-left: 8px;
	width: 80.96px;
height: 25.82px;
font-size: 19.54px;
font-family: Microsoft YaHei, Microsoft YaHei-Bold;
font-weight: 700;
text-align: left;
color: #ffffff;
letter-spacing: 0.98px;
text-shadow: 0px 2.09px 4.19px 0px rgba(0,0,0,0.16); 

  .no-redirect {
    cursor: text;
  }
}
</style>