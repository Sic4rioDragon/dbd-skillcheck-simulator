<template>
  <div v-if="showNotice" class="update-notice">
    <div class="update-box">
      <h2>New update available</h2>
      <p>
        A newer version of the site was found:
        <strong>{{ latestVersion }}</strong>
      </p>
      <p>
        You are currently viewing:
        <strong>{{ currentVersion }}</strong>
      </p>
      <div class="update-actions">
        <button @click="reloadNow">Reload now</button>
        <button @click="dismissNotice">Later</button>
      </div>
      <p class="update-help">
        If it still looks old after reloading, press <strong>Ctrl + Shift + R</strong>.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpdateNotice',
  data() {
    return {
      showNotice: false,
      currentVersion: 'v1.0.0.5',
      latestVersion: 'v1.0.0.5'
    }
  },
  async mounted() {
    try {
      const response = await fetch(`/manifest.json?t=${Date.now()}`, {
        cache: 'no-store'
      })

      if (!response.ok) return

      const manifest = await response.json()
      const latest = manifest.version || this.currentVersion
      this.latestVersion = latest

      const seenVersion = localStorage.getItem('dbd_skillcheck_seen_version')

      if (seenVersion && seenVersion !== latest) {
        this.currentVersion = seenVersion
        this.showNotice = true
      }

      localStorage.setItem('dbd_skillcheck_seen_version', latest)
    } catch (e) {
      // ignore
    }
  },
  methods: {
    reloadNow() {
      window.location.reload(true)
    },
    dismissNotice() {
      this.showNotice = false
    }
  }
}
</script>

<style scoped>
.update-notice {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.update-box {
  width: min(92vw, 460px);
  background: rgba(18, 18, 18, 0.96);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 1.2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.update-box h2 {
  margin-bottom: 0.8rem;
}

.update-box p {
  margin-bottom: 0.8rem;
}

.update-actions {
  display: flex;
  gap: 0.7rem;
  margin-top: 1rem;
}

.update-actions button {
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.08);
  color: white;
  cursor: pointer;
}

.update-help {
  opacity: 0.85;
  margin-top: 1rem;
}
</style>