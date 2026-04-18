import {handleScore} from '@/js/needlePosition.js'
import store from '@/store/store.js'
import * as event from '@/js/events/controlGameEvents.js'

const previousButtonStates = {}
let gamepadLoopStarted = false

const getControllerType = (id = '') => {
    const value = id.toLowerCase()

    if (
        value.includes('playstation') ||
        value.includes('dualshock') ||
        value.includes('dualsense') ||
        value.includes('wireless controller')
    ) {
        return 'playstation'
    }

    if (
        value.includes('xbox') ||
        value.includes('xinput') ||
        value.includes('microsoft')
    ) {
        return 'xbox'
    }

    return 'generic'
}

const getButtonLabel = (type, buttonIndex) => {
    const labels = {
        xbox: {
            0: 'A',
            1: 'B',
            9: 'Menu'
        },
        playstation: {
            0: 'Cross',
            1: 'Circle',
            9: 'Options'
        },
        generic: {
            0: 'Button 1',
            1: 'Button 2',
            9: 'Start'
        }
    }

    return (labels[type] && labels[type][buttonIndex]) || `Button ${buttonIndex + 1}`
}

const getActiveGamepad = () => {
    const pads = navigator.getGamepads ? navigator.getGamepads() : []
    if (!pads) return null

    for (let i = 0; i < pads.length; i++) {
        if (pads[i] && pads[i].connected) {
            return pads[i]
        }
    }

    return null
}

const updateControllerState = (pad) => {
    const controller = store.state.playerSettings.controller

    if (!controller) return

    if (!pad) {
        controller.connected = false
        controller.type = 'generic'
        return
    }

    controller.connected = true
    controller.type = getControllerType(pad.id)
}

const isPressed = (pad, buttonIndex) => {
    if (!pad || !pad.buttons || !pad.buttons[buttonIndex]) {
        return false
    }

    return pad.buttons[buttonIndex].pressed
}

const onPressedOnce = (pad, buttonIndex, callback) => {
    if (!pad) return

    const padKey = `${pad.index}:${buttonIndex}`
    const pressedNow = isPressed(pad, buttonIndex)
    const pressedBefore = !!previousButtonStates[padKey]

    if (pressedNow && !pressedBefore) {
        callback()
    }

    previousButtonStates[padKey] = pressedNow
}

const handleGamepadInput = (pad) => {
    const controller = store.state.playerSettings.controller

    if (!controller || !controller.enabled || !pad) {
        return
    }

    const skillCheckButton = controller.buttons.skillCheck
    const confirmButton = controller.buttons.confirm
    const pauseButton = controller.buttons.pause

    onPressedOnce(pad, skillCheckButton, () => {
        if (store.state.gameEvents.events.startGame && !store.state.gameEvents.events.pauseGame) {
            handleScore()
        }
    })

    onPressedOnce(pad, confirmButton, () => {
        if (!store.state.gameEvents.events.startGame && !store.state.gameEvents.events.locked) {
            event.startGame()
        }
    })

    onPressedOnce(pad, pauseButton, () => {
        if (!store.state.gameEvents.events.startGame || store.state.gameEvents.events.locked) {
            return
        }

        if (store.state.gameEvents.events.pauseGame) {
            event.resumeGame()
        } else {
            event.pauseGame()
        }
    })
}

const gamepadLoop = () => {
    const pad = getActiveGamepad()

    updateControllerState(pad)
    handleGamepadInput(pad)

    window.requestAnimationFrame(gamepadLoop)
}

const startGamepadLoop = () => {
    if (gamepadLoopStarted) return
    gamepadLoopStarted = true
    gamepadLoop()
}

window.addEventListener('gamepadconnected', (e) => {
    updateControllerState(e.gamepad)
    startGamepadLoop()

    const controller = store.state.playerSettings.controller
    if (controller) {
        controller.lastLabel = getButtonLabel(controller.type, controller.buttons.skillCheck)
    }
})

window.addEventListener('gamepaddisconnected', () => {
    updateControllerState(getActiveGamepad())
})

startGamepadLoop()

export { getControllerType, getButtonLabel }