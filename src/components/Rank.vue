<template>
  <div v-show="rank.showRank" class="rank-show-status">
    <div style="opacity: 0;" ref="rank-points" class="rank-points">
      <h2>{{ checkPipLevel }}</h2>
    </div>
    <div style="opacity: 0;" ref="rank-status" class="rank-status">
      <div class="rank-bar">
        <div style="width:0%;" ref="rank-progress" class="rank-progress"></div>
        <div ref="pip1" class="pip1"></div>
        <div ref="pip2" class="pip2"></div>
        <div ref="pip3" class="pip3"></div>
      </div>
    </div>
    <div v-show="rank.buttonArea.showButton" style="opacity: 0;" ref="rank-next" class="rank-next">
      <button :disabled="rank.buttonArea.disableButton" @click="continueBtn" class="resumeBtn2">Continue</button>
    </div>
  </div>
</template>

<script>
import { initDom } from '@/js/domElements'
import { reverseOpacity } from '@/js/rank.js'

export default {
  computed: {
    rank() {
      return this.$store.state.gameStatus.rank
    },
    checkPipLevel() {
      const m = 'Rank Point'
      switch (this.rank.pipLevel) {
        case 'unknown':
          return m
        case 0:
          return `- 2 ${m}s`
        case 1:
          return "Safe Pip'd"
        case 2:
          return `+ 1 ${m}`
        case 3:
          return `+ 2 ${m}s`
        default:
          return ''
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      initDom('rank', this.$refs)
    })
  },
  methods: {
    continueBtn() {
      this.$store.state.gameStatus.now.generatorsLeft = 2
      this.$store.state.gameStatus.now.charges = 0
      this.$store.state.gameStatus.now.generatorPaused = false
      this.$store.state.gameStatus.now.generatorStoped = false
      this.$store.state.gameStatus.now.generatorRunning = false
      this.$store.state.gameStatus.now.generatorStarted = false
      reverseOpacity()
    }
  }
}
</script>