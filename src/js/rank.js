import * as ffs from '@/js/library/math.js'
import anime from 'animejs/lib/anime.es.js'
import store from '@/store/store'

import { stopGame } from '@/js/events/controlGameEvents.js'
import { dom } from '@/js/domElements'

const rank = () => {
    const latestGameAllChecks = Object.values(store.state.playerStats.latestGame).reduce((a, b) => a + b)
    const goodRate = ffs.outOf(store.state.playerStats.latestGame.good, latestGameAllChecks)
    const failedRate = ffs.outOf(store.state.playerStats.latestGame.miss, latestGameAllChecks)

    const rankRate = 100 - failedRate - (goodRate / 2)

    store.state.playerStats.stats.rankPoints += rankRate >= 75 ? 2 : rankRate >= 50 ? 1 : rankRate >= 25 ? 0 : store.state.playerStats.stats.rankPoints <= 2 ? 0 : -2

    rankProgressAnim(rankRate)
}

const reverseOpacity = () => {
    store.state.gameStatus.rank.buttonArea.disableButton = true

    anime.timeline({
        easing: 'easeInOutQuad',
        duration: 400,
        loop: false,
        begin() {
            stopGame()
        },
        complete() {
            store.state.gameStatus.rank.showRank = false
            store.state.gameStatus.rank.buttonArea.showButton = false
            store.state.gameStatus.rank.buttonArea.disableButton = true
            store.state.gameStatus.rank.pipLevel = 0

            if (dom.rank['rank-next']) {
                dom.rank['rank-next'].style.opacity = 1
            }
            if (dom.buttons['border']) {
                dom.buttons['border'].style.opacity = 1
                dom.buttons['border'].style.transform = 'translateY(0)'
            }
        }
    }).add({
        targets: dom.rank['rank-status'],
        opacity: [1, 0],
    }).add({
        targets: dom.rank['rank-points'],
        opacity: [1, 0]
    }).add({
        targets: dom.buttons['border'],
        translateY: 0,
        opacity: [0, 1],
    })
}

const rankProgressAnim = (percent) => {
    store.state.gameStatus.rank.buttonArea.showButton = false
    store.state.gameStatus.rank.buttonArea.disableButton = true
    stopGame()

    store.state.gameStatus.rank.showRank = true

    for (let index = 1; index < 4; index++) {
        dom.rank[`pip${index}`].classList.remove('green-pip')
    }

    dom.rank['rank-progress'].style.width = '0%'
    store.state.gameStatus.rank.pipLevel = 'unknown'

    if (dom.rank['rank-next']) {
        dom.rank['rank-next'].style.opacity = 1
    }

    let s = Number(percent) ? percent : 0
    let c = s > 25 ? 25 : s

    anime.timeline({
        easing: 'easeInOutQuad',
        duration: 1000,
        loop: false,
        complete() {
            runRankAnim()
        }
    }).add({
        targets: dom.buttons['border'],
        translateX: ['-50%', '-50%'],
        translateY: [0, 10],
        opacity: [1, 0],
    }, 0).add({
        targets: dom.rank['rank-points'],
        opacity: [0, 1],
    }, 0).add({
        targets: dom.rank['rank-status'],
        opacity: [0, 1],
    }, 750)

    const rankPip = () => {
        const addPip = (pip, pipLevel) => {
            if (pip) {
                dom.rank[pip].classList.add('green-pip')
            }
            store.state.gameStatus.rank.pipLevel = pipLevel
        }

        switch (c) {
            case 25:
                addPip('pip1', 1)
                break
            case 50:
                addPip('pip2', 2)
                break
            case 75:
                addPip('pip3', 3)
                break
            default:
                if (c < 25) {
                    addPip('', 0)
                }
                break
        }

        if (c == s) {
        store.state.gameStatus.rank.buttonArea.showButton = true
        store.state.gameStatus.rank.buttonArea.disableButton = false

        if (dom.rank['rank-next']) {
            dom.rank['rank-next'].style.opacity = 1
        }

        return
    }

        c += s - c > 25 ? 25 : s - c
        if (c <= 100 && c >= 0) {
            runRankAnim()
        }
    }

    const runRankAnim = () => {
        anime({
            targets: dom.rank['rank-progress'],
            width: c,
            easing: 'easeInOutQuad',
            direction: 'alternate',
            loop: false,
            duration: 800,
            complete() {
                rankPip()
            }
        })
    }
}

export { rank, reverseOpacity }