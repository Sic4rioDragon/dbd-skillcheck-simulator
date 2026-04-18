import store from '@/store/store'
import anime from 'animejs/lib/anime.es.js'
import { dom } from '@/js/domElements'

const pauseButtonAnimation = () => {
    if (dom.buttons['pause']) {
        dom.buttons['pause'].style.opacity = 1
        dom.buttons['pause'].style.transform = 'translateY(0)'
    }

    if (dom.buttons['resume']) {
        dom.buttons['resume'].style.opacity = 0
        dom.buttons['resume'].style.transform = 'translateX(75px)'
    }

    anime.timeline({
        easing: 'easeInOutQuad',
        duration: 250,
        loop: false,
        begin() {
            store.commit('updateGameStatus', [
                {
                    state: 'buttons',
                    event: 'resumeGameButton',
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
                    state: 'events',
                    event: 'locked',
                    to: false
                }
            ])
        }
    })
    .add({
        targets: dom.buttons['pause'],
        translateY: [0, -25],
        opacity: [1, 0],
        complete() {
            store.commit('updateGameStatus', [
                {
                    state: 'buttons',
                    event: 'pauseGameButton',
                    to: false
                }
            ])
        }
    }, 0)
    .add({
        targets: dom.buttons['resume'],
        translateX: [25, 0],
        opacity: [0, 1]
    }, 0)
}

export { pauseButtonAnimation }