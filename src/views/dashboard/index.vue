<template>
  <div>
    <Card style="margin-top:20px" />
    <Sale style="margin-top:20px" />
    <Observe style="margin-top:20px" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Card from './Card'
import Sale from './Sale'
import Observe from './observe'
export default {
  name: 'Dashboard',
  components: {
    Card,
    Sale,
    Observe
  },
  computed: {
    ...mapGetters(['name'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
