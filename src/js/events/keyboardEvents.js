import { handleScore } from '@/js/needlePosition.js'
import store from '@/store/store.js'
import * as event from '@/js/events/controlGameEvents.js'

const getCharCode = (key) => {
    if (!key || key.length !== 1) return null
    return key.toUpperCase().charCodeAt()
}

const isTypingTarget = (target) => {
    if (!target) return false
    const tag = target.tagName
    return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

// mobile users
document.addEventListener('touchstart', e => {
    if (e.target.className == 'background') {
        if (store.state.gameEvents.events.startGame && !store.state.gameEvents.events.pauseGame) {
            handleScore()
        }
    }
})

document.addEventListener('mousedown', e => {
    if (e.target.className == 'background' && store.state.playerSettings.mouse.skillCheckKey == e.buttons) {
        if (store.state.gameEvents.events.startGame && !store.state.gameEvents.events.pauseGame) {
            handleScore()
        }
    }
})

document.addEventListener('keydown', e => {
    if (e.key === 'F9') {
        e.preventDefault()
        store.state.gameEvents.events.devMenu = !store.state.gameEvents.events.devMenu
        return
    }

    if (isTypingTarget(e.target)) {
        return
    }

    if (e.key === 'Escape') {
        if (store.state.gameEvents.events.startGame && !store.state.gameEvents.events.pauseGame) {
            event.pauseGame()
            return
        }

        if (store.state.gameEvents.events.pauseGame) {
            event.resumeGame()
            return
        }
    }

    if (e.repeat) {
        return
    }

    const code = getCharCode(e.key)

    if (code == store.state.playerSettings.keyboard.skillCheckKey && store.state.gameEvents.events.startGame && !store.state.gameEvents.events.pauseGame) {
        handleScore()
    }

    if (code == store.state.playerSettings.keyboard.startKey && !store.state.gameEvents.events.startGame) {
        event.startGame()
    }

    if (code == store.state.playerSettings.keyboard.stopKey && store.state.gameEvents.events.startGame) {
        event.stopGame()
    }

    if (code == store.state.playerSettings.keyboard.pauseKey && !store.state.gameEvents.events.pauseGame) {
        event.pauseGame()
    }

    if (code == store.state.playerSettings.keyboard.resumeKey && store.state.gameEvents.events.pauseGame) {
        event.resumeGame()
    }
})

window.onblur = () => {
    event.pauseGame()
}