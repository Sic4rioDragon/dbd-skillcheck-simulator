<template>
  <div class="about-page">
    <h1 class="about-title">About</h1>
    <hr>

    <div class="about-block">
      <p>
        Dead by Daylight Skillcheck Simulator.
      </p>

      <p>
        This fork brings the simulator back online, keeps it playable in the browser,
        and adds improvements over time.
      </p>

      <p class="about-version">
        This page runs version <strong>{{ manifest.version }}</strong>
      </p>
    </div>

    <h1 class="about-title">About This Fork</h1>
    <hr>

    <div class="about-block">
      <p>
        This project is based on the original simulator and is now maintained through this fork.
      </p>

      <p>
        The goal is to keep it updated, improve it over time, and make it easy for people
        to just open and play.
      </p>
    </div>

    <h1 class="about-title">Current Focus</h1>
    <hr>

    <div class="about-block">
      <ul>
        <li>better pause system</li>
        <li>controller support</li>
        <li>Merciless Storm</li>
        <li>clear stats option</li>
        <li>general polish and bug fixes</li>
        <li>later: accounts, leaderboards, and server-side stat validation</li>
      </ul>
    </div>

    <h1 class="about-title">Issues / Feedback</h1>
    <hr>

    <div class="about-block">
      <p>
        Found a bug or have an idea?
      </p>

      <p>
        Please use the
        <a :href="manifest.issues" target="_blank" rel="noopener noreferrer">
          GitHub Issues page
        </a>
        for bug reports, feedback, and suggestions.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      manifest: {
        version: 'v1.0.0.3',
        issues: 'https://github.com/Sic4rioDragon/dbd-skillcheck-simulator/issues'
      }
    }
  },
  async mounted() {
    try {
      const response = await fetch('/manifest.json', { cache: 'no-store' })
      if (!response.ok) return

      const data = await response.json()
      this.manifest = {
        ...this.manifest,
        ...data
      }
    } catch (e) {
      // keep fallback values
    }
  }
}
</script>

<style scoped>
.about-page {
  color: white;
}

.about-title {
  text-align: center;
  color: #cda8ff;
  margin-top: 1rem;
}

.about-block {
  margin: 1.2rem 0 2rem 0;
  line-height: 1.5;
}

.about-block p,
.about-block li {
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
}

.about-block ul {
  padding-left: 1.4rem;
}

.about-version {
  color: #d8d8d8;
}

a {
  color: #58e1ff;
}
</style>