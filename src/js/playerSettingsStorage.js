const STORAGE_KEY = 'dbd_skillcheck_player_settings'

const safeParse = (value) => {
    try {
        return JSON.parse(value)
    } catch (e) {
        return null
    }
}

const loadPlayerSettings = () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? safeParse(raw) : null
}

const savePlayerSettings = (settings) => {
    try {
        const payload = {
            acceptAllMouseButtons: settings.acceptAllMouseButtons,
            keyboard: settings.keyboard,
            mouse: settings.mouse,
            controller: {
                enabled: settings.controller.enabled,
                buttons: settings.controller.buttons
            },
            custom: settings.custom,
            backgroundURL: settings.backgroundURL,
            backgroundColor: settings.backgroundColor,
            useCustomBackgroundColor: settings.useCustomBackgroundColor
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (e) {
        console.warn('Could not save player settings:', e)
    }
}

export {
    loadPlayerSettings,
    savePlayerSettings
}