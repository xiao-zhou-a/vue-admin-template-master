<template>
  <div>
    <div class="card-header">
      <span>{{title}}</span>
      <svg t="1664608822777" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2549" width="32" height="32">
        <path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" p-id="2550" fill="#8a8a8a"></path>
      </svg>
    </div>
    <div class="card-content">{{count}}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Detail',
  props: ['title', 'count']
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: gray;
}
.card-content {
  font-size: 28px;
  margin-bottom: 30px;
}
.card-charts {
  height: 50px;
  font-size: 14px;
}
.card-footer {
  border-top: 1px solid #eee;
  padding-top: 10px;
}
</style>