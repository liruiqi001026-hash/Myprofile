<template>
  <div class="about">
    <h1>关于我</h1>
    <div class="about-content">
      <p>{{ userInfo.intro }}</p>
      <p>联系方式：{{ userInfo.contact }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../utils/request'

const userInfo = ref({})

const fetchAbout = async () => {
  const res = await request.get('/user')
  userInfo.value = res.data
}

onMounted(() => {
  fetchAbout()
})
</script>

<style scoped>
.about {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.about-content {
  margin-top: 20px;
  line-height: 1.8;
}
</style>