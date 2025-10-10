<template>
  <div class="loadmore" :class="{ 'full': fullScreen }">
    <div class="hasmore" v-if="hasMore">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="nomore" v-else>
      没有更多了...
    </div>
  </div>
</template>

<script setup name="LoadMore">
const props = defineProps({
  hasMore: {
    type: Boolean,
    default: true
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.loadmore {
  width: 150px;
  height: 15px;
  margin: 0 auto;
  text-align: center;
  padding-bottom: 10px;
}

.full {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
}

.hasmore {
  height: 100%;
}

span {
  display: inline-block;
  width: 15px;
  height: 30px;
  margin-right: 5px;
  border-radius: 5px;
  background: #42b983;
  animation: load 1.04s ease infinite;

  &:nth-child(1) {
    animation-delay: 0.13s;
  }

  &:nth-child(2) {
    animation-delay: 0.26s;
  }

  &:nth-child(3) {
    animation-delay: 0.39s;
  }

  &:nth-child(5) {
    animation-delay: 0.65s;
  }

}

@keyframes load {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    transform: scale(0.3);
    opacity: 0.3;
  }
}
</style>
