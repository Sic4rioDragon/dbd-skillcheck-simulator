import store from '@/store/store'
import anime from 'animejs/lib/anime.es.js'
import { dom } from '@/js/domElements'

const startButtonAnimation = () => {
    if (dom.buttons['play']) {
        dom.buttons['play'].style.opacity = 1
        dom.buttons['play'].style.transform = 'translateY(0)'
    }

    if (dom.buttons['stop']) {
        dom.buttons['stop'].style.opacity = 0
        dom.buttons['stop'].style.transform = 'translateX(-25px)'
    }

    if (dom.buttons['pause']) {
        dom.buttons['pause'].style.opacity = 0
        dom.buttons['pause'].style.transform = 'translateX(25px)'
    }

    anime.timeline({
        easing: 'easeInOutQuad',
        duration: 250,
        loop: false,
        begin() {
            store.commit('updateGameStatus', [
                {
                    state: 'buttons',
                    event: 'stopGameButton',
                    to: true
                },
                {
                    state: 'buttons',
                    event: 'pauseGameButton',
                    to: true
                },
                {
                    state: 'events',
                    event: 'locked',
                    to: true
                }
            ])
        },
        complete() {
            store.commit('updateGameStatus', [
                {
                    state: 'buttons',
                    event: 'startGameButton',
                    to: false
                },
                {
                    state: 'events',
                    event: 'locked',
                    to: false
                }
            ])
        }
    })
    .add({
        targets: dom.buttons['play'],
        translateY: [0, -25],
        opacity: [1, 0]
    }, 0)
    .add({
        targets: dom.buttons['stop'],
        translateX: [-25, 0],
        opacity: [0, 1]
    }, 0)
    .add({
        targets: dom.buttons['pause'],
        translateX: [25, 0],
        opacity: [0, 1]
    }, 0)
}

export { startButtonAnimation }