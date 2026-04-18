<template>
    <div class="top-score">
        <div ref="game-rank-bloodpoints" class="rank-bloodpoints">
            <div class="rank-bloodpoints-status">
                <img class="rank-bloodpoints-img" src="@/assets/icons/bloodpoints.png" alt="">
                <div class="bloodpoints-score">{{ playerScore.bloodpoints }}</div>
            </div>

            <div class="rank-score">
                <img :src="require(`@/assets/rank/rank${rankIcon}.png`)" class="top-status-img" alt="">
                <h2 class="rank-score-status">{{ rankIcon }}</h2>
            </div>
        </div>

        <div :class="[menu.menu ? 'opacity-all': 'opacity-gone']">
            <div ref="skill-check-rate" :class="[gamemode == 'ds' ? 'rate-ds-skillchecks': 'rate-normal-skillchecks']">
                <div>
                    <div class="great-skill-rate-icon">
                        <div class="great-skill-color skill-color-size">
                            <div class="over-rate-background"></div>
                        </div>
                        <div class="skill-rate-score">{{ gamemode == 'ds' ? playerScore.rateDsEscape : playerScore.rateGreatScore }}</div>
                    </div>

                    <h3 class="rate-score">
                        {{ gamemode == 'ds' ? playerScore.dsEscape : playerScore.greatScore }}
                        <span v-if="gamemode !== 'ds'">({{ autoGreat }})</span>
                    </h3>
                </div>

                <div v-if="gamemode !== 'ds'">
                    <div class="great-skill-rate-icon">
                        <div class="good-skill-color skill-color-size">
                            <div class="over-rate-background"></div>
                        </div>
                        <div class="skill-rate-score">{{ playerScore.rateGoodScore }}</div>
                    </div>

                    <h3 class="rate-score">
                        {{ playerScore.goodScore }} ({{ autoGood }})
                    </h3>
                </div>

                <div>
                    <div class="great-skill-rate-icon">
                        <div class="fail-skill-color skill-color-size">
                            <div class="over-rate-background"></div>
                        </div>
                        <div class="skill-rate-score">{{ gamemode == 'ds' ? playerScore.rateDsFailed : playerScore.rateFailedScore }}</div>
                    </div>

                    <h3 class="rate-score">
                        {{ gamemode == 'ds' ? playerScore.dsFailed : playerScore.failedScore }}
                        <span v-if="gamemode !== 'ds'">({{ autoMiss }})</span>
                    </h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {initDom} from '@/js/domElements.js'

export default {
    name: 'GeneralStats',
    computed: {
        playerScore(){
            return this.$store.state.playerStats.stats
        },
        gamemode(){
            return this.$store.state.gameStatus.now.gameMode
        },
        autoGreat(){
            return this.$store.state.gameEvents.events.autoSkillcheckStats.great
        },
        autoGood(){
            return this.$store.state.gameEvents.events.autoSkillcheckStats.good
        },
        autoMiss(){
            return this.$store.state.gameEvents.events.autoSkillcheckStats.miss
        },
        rankIcon(){
            const rankPoints = this.$store.state.playerStats.stats.rankPoints
            const rankIcon = 20 - (rankPoints / 4)
            return rankIcon <= 1 ? 1 : rankIcon % 1 == 0 ? rankIcon : Math.ceil(rankIcon)
        },
        menu(){
            return this.$store.state.gameEvents.events
        }
    },
    mounted(){
        this.$nextTick(() => {
            initDom('generalStats', this.$refs)
        })
    }
}
</script>

<style scoped>
.top-score {
    position: absolute;
    top: 2%;
    right: 2%;
}

.opacity-gone{
    transition: 400ms;
    opacity: 1;
}

.opacity-all{
    transition: 400ms;
    opacity: 0;
    transform: translateY(5vw);
}

.rank-bloodpoints-status{
    display: grid;
    align-content: center;
    grid-gap: 1rem;
    grid-template-columns: auto 1fr;
}

.rank-bloodpoints {
    display: grid;
    justify-content: end;
    grid-gap: 2.2rem;
    grid-template-columns: 16rem 8rem;
}

.rank-bloodpoints, .rate-ds-skillchecks, .rate-normal-skillchecks{
    width: 17.5vw;
    padding: 0px 1rem;
    border-radius: 4px;
    background: rgba(56, 56, 56, .5);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
    background: var(--texture-one) center center var(--font-color-two);
    background-size: cover;
    background-blend-mode: multiply;
}

.rank-bloodpoints{
    background-color: var(--font-color-one)
}

.top-status-img {
    height: 8rem;
    width: auto;
}

.rank-score {
    height: 8rem;
    position: relative;
    width: fit-content;
}

.rank-score-status {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-45%, -50%);
    justify-content: center;
}

.rank-bloodpoints-img{
    height: 3rem;
    width: auto;
}

.bloodpoints-score, .rank-score-status{
    font-size: 1.7rem;
    color: var(--general-stats-color);
}

.bloodpoints-score{
    margin-top: .5rem;
}

.rank-score {
    align-self: center;
    justify-self: center;
}

.skill-color-size {
    height: 8rem;
    width: 8rem;
    border-radius: 50%;
}

.great-skill-color {
    background: #72FA76;
    border: .6rem solid #90FC93;
}

.good-skill-color {
    background: #80D5FF;
    border: .6rem solid #99D2EF;
}

.fail-skill-color {
    background: #DD6B82;
    border: .6rem solid #F08CA0;
}

.over-rate-background {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(0,0,0,0.4);
}

.great-skill-rate-icon {
    position: relative;
    display: grid;
    justify-content: center;
    margin-top: 1rem;
}

.skill-rate-score {
    position: absolute;
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: #fff;
}

.rate-score {
    text-align: center;
    font-size: 2rem;
    color: #fff;
    margin-bottom: 1rem;
}
</style>