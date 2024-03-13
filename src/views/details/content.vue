<template>
  <div class="content">
    <div class="ddu" v-if="props.list.data && props.list.data.summary">
      <span>{{props.list.data && props.list.data.summary ? props.list.data.summary :''}}</span>
    </div>
    <div class="nrong">
      <span v-if="props.list.data" v-html="props.list.data.content"></span>
    </div>
  </div>
</template>

<script setup name="content">
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key, keyPath) => {
	console.log(key, keyPath)
}
const  props = defineProps({
			list: {
				type: Object,
				default:''
		}
});
</script>

<style scoped lang="scss">
.content {
  .ddu {
    padding: 18px;
    background: #f8f8f8;
    margin-top: 24px;

    span {
      font-size: 16px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      color: #333333;
      line-height: 21px;
      letter-spacing: 0.24px;
    }
  }

  .nrong {
    margin: 30px 0;
		::v-deep img{
			max-width: 100%;
		}
		::v-deep video{
			display: block;
			max-width: 100%;
			margin: 0 auto;
		}
  }
}
</style>

