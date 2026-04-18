<template>
  <div v-if="visible" class="dev-menu">
    <div class="dev-menu-inner">
      <div class="dev-menu-header">
        <h2>Dev Menu</h2>
        <button @click="toggleMenu">Close</button>
      </div>

      <div class="dev-grid">
        <div class="dev-card">
          <h3>Bloodpoints</h3>
          <div class="dev-row">
            <input v-model.number="bpAmount" type="number" min="0" />
            <button @click="addBloodpoints">Add</button>
          </div>
          <div class="dev-row">
            <input v-model.number="setBpAmount" type="number" min="0" />
            <button @click="setBloodpoints">Set Exact</button>
          </div>
        </div>

        <div class="dev-card">
          <h3>Inventory</h3>
          <div class="dev-row">
            <select v-model="selectedPool" @change="syncSelectedKey">
              <option value="toolbox">Toolbox</option>
              <option value="addOn">Add-On</option>
            </select>

            <select v-model="selectedKey">
              <option v-for="item in selectedList" :key="item.key" :value="item.key">
                {{ item.label }}
              </option>
            </select>

            <input v-model.number="selectedAmount" type="number" min="1" />
            <button @click="giveSelectedItem">Give</button>
          </div>

          <div class="dev-row">
            <button @click="undoLastInventoryGrant" :disabled="!inventoryUndoStack.length">Undo Last Grant</button>
          </div>
        </div>

        <div class="dev-card">
          <h3>Game</h3>
          <div class="dev-row">
            <button @click="completeCurrentGen">Complete Current Gen</button>
            <button @click="resetLatestGame">Reset Latest Run</button>
          </div>
          <div class="dev-row">
            <button @click="resetAllStats">Reset All Stats</button>
          </div>
        </div>

        <div class="dev-card">
          <h3>Debug</h3>
          <p>Mode: {{ gameMode }}</p>
          <p>Start: {{ startGame }}</p>
          <p>Paused: {{ pauseGame }}</p>
          <p>Locked: {{ locked }}</p>
          <p>Charges: {{ charges.toFixed(2) }}</p>
          <p>Generators left: {{ generatorsLeft }}</p>
          <p>Bloodpoints: {{ bloodpoints }}</p>
          <p>Controller: {{ controllerStatus }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toolboxes, toolboxAddOns } from '@/js/items.js'
import { notification } from '@/js/library/use'
import * as controlEvents from '@/js/events/controlGameEvents.js'

export default {
  name: 'DevMenu',
  data() {
    return {
      bpAmount: 10000,
      setBpAmount: 0,
      selectedPool: 'toolbox',
      selectedKey: 'wornOutTools',
      selectedAmount: 1,
      inventoryUndoStack: []
    }
  },
  computed: {
    visible() {
      return this.$store.state.gameEvents.events.devMenu
    },
    selectedList() {
      const source = this.selectedPool === 'toolbox' ? toolboxes : toolboxAddOns
      return Object.keys(source).map(key => ({
        key,
        label: source[key].easyName || key
      }))
    },
    gameMode() {
      return this.$store.state.gameStatus.now.gameMode
    },
    startGame() {
      return this.$store.state.gameEvents.events.startGame
    },
    pauseGame() {
      return this.$store.state.gameEvents.events.pauseGame
    },
    locked() {
      return this.$store.state.gameEvents.events.locked
    },
    charges() {
      return this.$store.state.gameStatus.now.charges
    },
    generatorsLeft() {
      return this.$store.state.gameStatus.now.generatorsLeft
    },
    bloodpoints() {
      return this.$store.state.playerStats.stats.bloodpoints
    },
    controllerStatus() {
      const controller = this.$store.state.playerSettings.controller
      if (!controller.enabled) return 'disabled'
      if (!controller.connected) return 'not detected'
      return controller.type || 'generic'
    }
  },
  methods: {
    toggleMenu() {
      this.$store.state.gameEvents.events.devMenu = !this.$store.state.gameEvents.events.devMenu
    },
    syncSelectedKey() {
      const first = this.selectedList[0]
      this.selectedKey = first ? first.key : ''
    },
    addBloodpoints() {
      const amount = Number(this.bpAmount) || 0
      this.$store.state.playerStats.stats.bloodpoints += amount
      notification(`Added ${amount} bloodpoints`)
    },
    setBloodpoints() {
      const amount = Math.max(0, Number(this.setBpAmount) || 0)
      this.$store.state.playerStats.stats.bloodpoints = amount
      notification(`Set bloodpoints to ${amount}`)
    },
    snapshotInventory() {
      this.inventoryUndoStack.push(JSON.parse(JSON.stringify(this.$store.state.playerItems.inventory)))
      if (this.inventoryUndoStack.length > 20) {
        this.inventoryUndoStack.shift()
      }
    },
    giveSelectedItem() {
      if (!this.selectedKey) return

      this.snapshotInventory()

      const amount = Math.max(1, Number(this.selectedAmount) || 1)
      const source = this.selectedPool === 'toolbox' ? toolboxes : toolboxAddOns
      const value = source[this.selectedKey]
      if (!value) return

      if (this.$store.state.playerItems.inventory[this.selectedKey]) {
        this.$store.state.playerItems.inventory[this.selectedKey].quantity += amount
      } else {
        this.$store.state.playerItems.inventory[this.selectedKey] = {
          quantity: amount,
          what: value.what
        }
      }

      notification(`Added ${amount}x ${value.easyName}`)
    },
    undoLastInventoryGrant() {
      const previous = this.inventoryUndoStack.pop()
      if (!previous) {
        notification('Nothing to undo')
        return
      }

      this.$store.state.playerItems.inventory = previous
      notification('Reverted last inventory grant')
    },
    completeCurrentGen() {
      if (!this.$store.state.gameEvents.events.startGame) {
        notification('Start a game first')
        return
      }

      if (this.$store.state.gameStatus.now.gameMode === 'ds') {
        notification('Generator completion is not available in DS mode')
        return
      }

      this.$store.state.gameStatus.now.charges = 80.1

      if (this.$store.state.gameEvents.events.pauseGame) {
        controlEvents.resumeGame()
      }

      notification('Current generator set to complete')
    },
    resetLatestGame() {
      Object.keys(this.$store.state.playerStats.latestGame).forEach(key => {
        this.$store.state.playerStats.latestGame[key] = 0
      })
      notification('Latest game stats reset')
    },
    resetAllStats() {
      const stats = this.$store.state.playerStats.stats

      Object.keys(stats).forEach(key => {
        if (typeof stats[key] === 'number') {
          stats[key] = 0
        } else if (typeof stats[key] === 'string' && stats[key].includes('%')) {
          stats[key] = '0%'
        }
      })

      this.resetLatestGame()
      notification('All stats reset')
    }
  }
}
</script>

<style scoped>
.dev-menu {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 99999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 4rem;
}

.dev-menu-inner {
  width: min(95vw, 900px);
  background: rgba(18, 18, 18, 0.95);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 1.2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.dev-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.dev-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.dev-card {
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
  padding: 1rem;
}

.dev-row {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.7rem;
  flex-wrap: wrap;
}

.dev-row input,
.dev-row select,
.dev-row button,
.dev-menu-header button {
  padding: 0.45rem 0.7rem;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.08);
  color: white;
}

.dev-row button,
.dev-menu-header button {
  cursor: pointer;
}

.dev-card p {
  margin-top: 0.35rem;
}
</style>