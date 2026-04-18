<template>
    <div class="player_settings">
        <h1 class="s-title">Keyboard</h1>
        <hr>
        <div class="s-template s-keyboard" v-for="(value, key, index) in get_keyboard" :key="index + key">
            <h2 class="s-left s-text">{{ key.split(/(?=[A-Z])/).join(' ') }}</h2>
            <span class="border-line"></span>
            <input
                class="s-right"
                :placeholder="keyboard[value] || String.fromCharCode(value) || 'Unknown'"
                @input="setKeyboardKey(key, $event)"
                @click="setKeyMessage()"
                @blur="resetInput($event)"
                type="text"
            >
        </div>

        <h1 class="s-title">Mouse</h1>
        <hr>
        <div class="s-template s-keyboard">
            <h2 class="s-left s-text">skill check key</h2>
            <span class="border-line"></span>
            <input
                @blur="resetInput($event)"
                :placeholder="mouseKeys"
                @mousedown="setMouseKey($event)"
                class="s-right"
                type="text"
            >
        </div>

        <div class="s-template s-keyboard">
            <h2 class="s-left s-text">allow m4 / m5</h2>
            <span class="border-line"></span>
            <input
                @blur="resetInput($event)"
                :placeholder="bBack"
                @click="allowMouseException()"
                class="s-right"
                type="text"
            >
        </div>

        <h1 class="s-title">Custom</h1>
        <hr>
        <div class="s-template s-custom" v-for="(value, key, index) in playerOptions" :key="index + key">
            <h2 class="s-left s-text">{{ key.split(/(?=[A-Z])/).join(' ') }}</h2>
            <span class="border-line"></span>
            <input
                class="s-right"
                @input="set_value(key, $event)"
                :placeholder="value.value"
                :min="value.minValue()"
                :max="value.maxValue()"
                :step="value.maxValue() / 20"
                @blur="resetInput($event)"
                type="number"
            >
        </div>

        <h1 class="s-title">Controller</h1>
        <hr>

        <div class="s-template s-keyboard">
            <h2 class="s-left s-text">controller support</h2>
            <span class="border-line"></span>
            <input
                @blur="resetInput($event)"
                :placeholder="controllerEnabledText"
                @click="toggleController()"
                class="s-right"
                type="text"
            >
        </div>

        <div class="s-template s-keyboard">
            <h2 class="s-left s-text">controller status</h2>
            <span class="border-line"></span>
            <input
                disabled
                :placeholder="controllerStatusText"
                class="s-right"
                type="text"
            >
        </div>

        <h1 class="s-title">Backgrounds</h1>
        <hr>

        <div class="s-template s-keyboard">
            <h2 class="s-left s-text">use color background</h2>
            <span class="border-line"></span>
            <input
                @blur="resetInput($event)"
                :placeholder="backgroundColorModeText"
                @click="toggleBackgroundColorMode()"
                class="s-right"
                type="text"
            >
        </div>

        <div class="s-template s-keyboard">
            <h2 class="s-left s-text">background color</h2>
            <span class="border-line"></span>
            <input
                class="s-right color-input"
                type="color"
                :value="backgroundColor"
                @input="setBackgroundColor($event)"
            >
        </div>

        <div class="s-template s-keyboard">
            <h2 class="s-left s-text">custom background</h2>
            <span class="border-line"></span>
            <input
                class="s-right file-input"
                type="file"
                accept="image/*"
                @change="setCustomBackground($event)"
            >
        </div>

        <agile
            @after-change="showCurrentSlide($event)"
            :dots="false"
            :centerMode="true"
            :initialSlide="getSlide"
            class="allImg"
            ref="carousel"
        >
            <img class="prevImg" v-for="(img, indx) in backgrounds" :key="indx" :src="img">
        </agile>
    </div>
</template>

<script>
import { playerOptions } from '@/js/status/options.js'
import keyCodes from '@/js/events/keyboard.js'
import mouseCodes from '@/js/events/mouse.js'
import { notification } from '@/js/library/use'
import { VueAgile } from 'vue-agile'

export default {
    components: {
        agile: VueAgile
    },
    data() {
        return {
            blockBrowserBackAndFowards: 'INACTIVE',
            backgrounds: [
                'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/322330/4a1a9aaa02672104c56b52cc850cd84dcc15c95c.jpg',
                'https://steamcommunity-a.akamaihd.net/economy/profilebackground/items/322330/86ad38fbb8b61da03913adf269def61231ff595b.jpg',
                'https://steamcommunity-a.akamaihd.net/economy/profilebackground/items/635200/d476ae32ec64e1c3a2a2d49f7f63fccbea199b9b.jpg',
                'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/381210/1ffb8d3f83682e63b1b0ea460cec4cf9d2660eec.jpg',
                'https://steamcommunity-a.akamaihd.net/economy/profilebackground/items/965480/1a10ddd2e61026f9c8177b905ce8e627c72b0dd3.jpg',
                'https://steamcommunity-a.akamaihd.net/economy/profilebackground/items/391220/f766e89255fa0395f9c3a999df0b416c98042eb4.jpg',
                'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/381210/c68e3ea0c64cccde4c90fc8c4e4103177bbb9b50.jpg',
                'https://steamcommunity-a.akamaihd.net/economy/profilebackground/items/750920/bf3509df716162607aa8488cd9e9e8c202e8ea54.jpg',
                'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/381210/f729ce379bd27db37b6e3170b4e1ba79b486bb5e.jpg'
            ]
        }
    },
    methods: {
        setKeyboardKey(key, e) {
            e.target.dataset.change = 'true'
            const inputKey = e.data ? e.data.toUpperCase().charCodeAt() : null

            if (inputKey) {
                const checkAnotherValue = Object.values(this.$store.state.playerSettings.keyboard).filter(value => inputKey == value)
                if (checkAnotherValue.length == 0) {
                    this.$store.state.playerSettings.keyboard[key] = inputKey
                }
            }

            e.target.blur()
        },
        resetInput(e) {
            e.target.value = ''
            if (e.target.dataset.change) {
                e.target.dataset.change = 'false'
            }
        },
        set_value(key, e) {
            let inpValue = Number(e.target.value)
            if (inpValue % 1 != 0) {
                inpValue = Number(inpValue.toFixed(2))
            }
            const minVal = playerOptions[key].minValue()
            const maxVal = playerOptions[key].maxValue()
            playerOptions[key].value = isNaN(inpValue) ? minVal : inpValue >= maxVal ? maxVal : inpValue <= minVal ? minVal : inpValue
        },
        allowMouseException() {
            if (this.$store.state.gameEvents.events.blockBrowserBackAndFowards == 'ACTIVE') {
                notification('You have to close this window to deactivate this option.')
                return
            }

            if (!this.$store.state.playerSettings.acceptAllMouseButtons) {
                let confirmLock = confirm(`Are you sure you want to activate M4/M5? Those keys are usually browser-back/browser-forward, you'll override those options on this page.`)
                if (confirmLock) {
                    this.$store.state.gameEvents.events.blockBrowserBackAndFowards = 'ACTIVE'
                    this.$store.state.playerSettings.acceptAllMouseButtons = true
                    history.pushState(null, null, location.href)
                    window.onpopstate = function () {
                        history.go(1)
                    }
                }
            }
        },
        setMouseKey(e) {
            if (e.target.dataset.change == 'true') {
                if (e.buttons) {
                    this.$store.state.playerSettings.mouse.skillCheckKey = e.buttons
                }
            } else {
                notification('Keep your mouse pointer in the input box and press the mouse key that you want to bind.')
                e.target.dataset.change = 'true'
            }
        },
        setKeyMessage() {
            notification('While the input is active press the key you want to bind.')
        },
        showCurrentSlide(event) {
            this.$store.state.playerSettings.backgroundURL = this.backgrounds[event.currentSlide]
        },
        gSlide() {
            for (let i = 0; i < this.backgrounds.length; i++) {
                const element = this.backgrounds[i]
                if (element == this.$store.state.playerSettings.backgroundURL) {
                    return i
                }
            }
            return 0
        },
        toggleController() {
            this.$store.state.playerSettings.controller.enabled =
                !this.$store.state.playerSettings.controller.enabled
        },
        toggleBackgroundColorMode() {
            this.$store.state.playerSettings.useCustomBackgroundColor =
                !this.$store.state.playerSettings.useCustomBackgroundColor
        },
        setBackgroundColor(e) {
            this.$store.state.playerSettings.backgroundColor = e.target.value
        },
        setCustomBackground(e) {
            const file = e.target.files && e.target.files[0]
            if (!file) return

            const maxSize = 2 * 1024 * 1024
            if (file.size > maxSize) {
                alert('Image is too large. Please use one under 2 MB.')
                e.target.value = ''
                return
            }

            const reader = new FileReader()

            reader.onload = (loadEvent) => {
                this.$store.state.playerSettings.backgroundURL = loadEvent.target.result
                this.$store.state.playerSettings.useCustomBackgroundColor = false
            }

            reader.readAsDataURL(file)
        }
    },
    computed: {
        get_keyboard() {
            return this.$store.state.playerSettings.keyboard
        },
        playerOptions() {
            return playerOptions
        },
        mouse() {
            return this.$store.state.playerSettings.mouse
        },
        keyboard() {
            return keyCodes
        },
        mouseKeys() {
            return mouseCodes.mouseCodes[this.mouse.skillCheckKey]
        },
        bBack() {
            return this.$store.state.gameEvents.events.blockBrowserBackAndFowards
        },
        getSlide() {
            return this.gSlide()
        },
        controller() {
            return this.$store.state.playerSettings.controller
        },
        controllerEnabledText() {
            return this.controller.enabled ? 'ACTIVE' : 'INACTIVE'
        },
        controllerStatusText() {
            if (!this.controller.enabled) return 'DISABLED'
            if (!this.controller.connected) return 'NOT DETECTED'
            if (this.controller.type === 'xbox') return 'CONNECTED - XBOX'
            if (this.controller.type === 'playstation') return 'CONNECTED - PLAYSTATION'
            return 'CONNECTED'
        },
        backgroundColor() {
            return this.$store.state.playerSettings.backgroundColor
        },
        backgroundColorModeText() {
            return this.$store.state.playerSettings.useCustomBackgroundColor ? 'ACTIVE' : 'INACTIVE'
        }
    }
}
</script>

<style>
.agile__actions{
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
}

.color-input{
    padding: 0;
    height: 2.2rem;
}

.file-input{
    font-size: 0.8rem;
    line-height: 2rem;
}

.prevImg{
    align-items: center;
    color: #fff;
    display: flex;
    height: 12vw;
    justify-content: center;
}

.allowBtn{
    margin-left: 4vw;
}

.allImg{
    text-align: center;
}

input{
    width: 10rem;
    background: rgb(103, 238, 175);
    border: none;
    background: url('../../assets/backgrounds/texture13.png');
    border-radius: 2px;
    text-align: center;
}

.s-keyboard input:hover{
    cursor: pointer;
}

input:focus{
    outline: none;
    color: transparent;
    background: #2E557C;
    border: 2px solid #1BC6E1;
}

::placeholder{
    font-size: 1vw;
    color: #fff;
}

input:focus::placeholder{
    color: rgb(255, 255, 255);
}

.s-custom input:focus{
    color: #ffffff;
}
</style>