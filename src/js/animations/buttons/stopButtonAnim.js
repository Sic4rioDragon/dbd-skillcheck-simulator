import store from '@/store/store'
import anime from 'animejs/lib/anime.es.js'
import { dom } from '@/js/domElements'

const stopButtonAnimation = () => {
    if (dom.buttons['play']) {
        dom.buttons['play'].style.opacity = 0
        dom.buttons['play'].style.transform = 'translateY(-25px)'
    }

    if (dom.buttons['stop']) {
        dom.buttons['stop'].style.opacity = 1
        dom.buttons['stop'].style.transform = 'translateX(0)'
    }

    if (dom.buttons['pause']) {
        dom.buttons['pause'].style.opacity = 1
        dom.buttons['pause'].style.transform = 'translateX(0)'
    }

    if (dom.buttons['resume']) {
        dom.buttons['resume'].style.opacity = 1
        dom.buttons['resume'].style.transform = 'translateX(0)'
    }

    anime.timeline({
        easing: 'easeInOutQuad',
        duration: 250,
        loop: false,
        begin() {
            store.commit('updateGameStatus', [
                {
                    state: 'buttons',
                    event: 'startGameButton',
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
                    event: 'stopGameButton',
                    to: false
                },
                {
                    state: 'buttons',
                    event: 'pauseGameButton',
                    to: false
                },
                {
                    state: 'buttons',
                    event: 'resumeGameButton',
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
        targets: [dom.buttons['stop'], dom.buttons['pause'], dom.buttons['resume']].filter(Boolean),
        translateX: [0, 25],
        opacity: [1, 0]
    }, 0)
    .add({
        targets: dom.buttons['play'],
        translateY: [-25, 0],
        opacity: [0, 1]
    }, 0)
}

export { stopButtonAnimation }