<template>
  <div class="home">
    <unitPlate/>
    
		<!-- <caseRight/> -->
		<policy/>
    
		<bank/>
  </div>
</template>

<script setup name="Index">
import unitPlate from './home/unitPlate.vue'
import caseRight from './home/caseRight.vue'
import bank from './home/bank.vue'
import policy from './home/policy.vue'
import unitPlateA from './home/unitPlate copy.vue'
</script>

<style scoped lang="scss">
.home {
  min-width: 1200px;
}
</style>

