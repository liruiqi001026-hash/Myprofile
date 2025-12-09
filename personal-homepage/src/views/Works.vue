<template>
  <div class="works-page">
    <h1>我的作品合集</h1>
    <div class="works-list">
      <div v-for="work in worksList" :key="work.id" class="work-item">
        <h3>{{ work.title }}</h3>
        <p>{{ work.desc }}</p>
        <a v-if="work.link" :href="work.link" target="_blank">查看详情</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../utils/request'

const worksList = ref([])

const fetchWorks = async () => {
  const res = await request.get('/works')
  worksList.value = res.data
}

onMounted(() => {
  fetchWorks()
})
</script>

<style scoped>
.works-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.works-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.work-item {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}
</style>