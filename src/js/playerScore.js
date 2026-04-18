// import {updateDomData} from './dom.js'
import {gameOptions} from '@/js/status/options.js'
import {playerRateStatus} from '@/js/playerStats.js'
import {damageGenerator} from '@/js/generator/damageGen.js'
import playTrack from '@/js/sound.js'

import store from '@/store/store'

import {combo} from '@/js/combo.js'
import {skillcheckSpawnCoordinates} from '@/js/drawSkillCheck.js'

const clampBloodpoints = (value) => Math.max(-1000, value)

const getForcedSkillcheckResult = () => {
    const mode = store.state.gameEvents.events.autoSkillcheckMode

    switch (mode) {
        case 'great':
            store.state.gameEvents.events.autoSkillcheckStats.great += 1
            return 'great'

        case 'good':
            store.state.gameEvents.events.autoSkillcheckStats.good += 1
            return 'good'

        case 'randomNoMiss': {
            const result = Math.random() < 0.5 ? 'great' : 'good'
            store.state.gameEvents.events.autoSkillcheckStats[result] += 1
            return result
        }

        default:
            return null
    }
}

const score = (status) => {
    playTrack(status)

    store.state.playerStats.latestGame[status] += 1

    if (store.state.gameStatus.now.gameMode == 'ds') {
        if (status == 'great') {
            store.state.playerStats.stats.dsEscape += 1

            const points = gameOptions.dsEscape + (store.state.playerStats.stats.rowScore * 50)
            combo(true)

            store.commit('updateObjectivePoints', {
                objective: `Decisive Strike`,
                points: `+ ${points}`
            })

            store.state.playerStats.stats.bloodpoints = clampBloodpoints(
                store.state.playerStats.stats.bloodpoints + points
            )
        } else {
            store.state.playerStats.stats.dsFailed += 1
            combo(false)

            store.state.playerStats.stats.bloodpoints = clampBloodpoints(
                store.state.playerStats.stats.bloodpoints + gameOptions.dsFailed
            )
        }

        playerRateStatus(
            ['dsEscape', 'dsFailed'],
            ['rateDsEscape', 'rateDsFailed']
        )
    }

    if (store.state.gameStatus.now.gameMode == 'normal' || store.state.gameStatus.now.gameMode == 'training') {
        let points

        if (status == 'great') {
            points = gameOptions[status] + (store.state.playerStats.stats.rowScore * 50)
            combo(true)

            if (!store.state.gameStatus.now.brokeGeneratorEffect && !store.state.gameStatus.now.brokeGeneratorEffectRunning && skillcheckSpawnCoordinates.mode !== 'hex') {
                store.state.gameStatus.now.charges += (2 / 100) * 80
            }

            store.commit('updateObjectivePoints', {
                objective: skillcheckSpawnCoordinates.mode == 'hex' ? 'HEX SKILL CHECK' : 'GREAT SKILL CHECK',
                points: `+ ${points}`
            })
        } else {
            points = gameOptions[status]
            combo(false)
        }

        if (status == 'failed') {
            damageGenerator((10 / 100) * 80)
        }

        if (status == 'good') {
            if (skillcheckSpawnCoordinates.mode == 'hex') {
                damageGenerator((5 / 100) * 80)
            } else {
                store.commit('updateObjectivePoints', {
                    objective: `${status} skill check`.toUpperCase(),
                    points: `+ ${points}`
                })
            }
        }

        store.state.playerStats.stats[`${status}Score`] += 1
        store.state.playerStats.stats.bloodpoints = clampBloodpoints(
            store.state.playerStats.stats.bloodpoints + points
        )

        playerRateStatus(
            ['greatScore', 'goodScore', 'failedScore'],
            ['rateGreatScore', 'rateGoodScore', 'rateFailedScore']
        )
    }
}

const checkNeedlePos = (pos) => {
    const forcedResult = getForcedSkillcheckResult()

    if (forcedResult) {
        score(forcedResult)
        return
    }

    if (skillcheckSpawnCoordinates.greatSkillCheckCoordinates.start <= pos && pos <= skillcheckSpawnCoordinates.greatSkillCheckCoordinates.end) {
        score('great')
    } else if (skillcheckSpawnCoordinates.goodSkillCkeckCoordinates.start < pos && pos <= skillcheckSpawnCoordinates.goodSkillCkeckCoordinates.end) {
        score('good')
    } else {
        score('failed')
    }
}

export {checkNeedlePos}