import { playerOptions } from '@/js/status/options.js'

const state = {
  acceptAllMouseButtons: false,
  keyboard: {
    startKey: 80,
    stopKey: 89,
    pauseKey: 73,
    resumeKey: 71,
    skillCheckKey: 32
  },
  mouse: {
    skillCheckKey: 2
  },
  controller: {
    enabled: true,
    connected: false,
    type: 'generic',
    buttons: {
      skillCheck: 0,
      confirm: 0,
      back: 1,
      pause: 9
    }
  },
  custom: playerOptions,
  backgroundURL: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/322330/4a1a9aaa02672104c56b52cc850cd84dcc15c95c.jpg',
  backgroundColor: '#020202',
  useCustomBackgroundColor: false
}

export default {
  state
}