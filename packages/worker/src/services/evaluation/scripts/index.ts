import { Page } from 'playwright'
import ClassifiedsScript from './classifieds.script'
import { LoginScripts } from '@services/execution/domain/task.types'

export interface LoginScript {
    run: (page: Page) => Promise<void>
}

export const getLoginScript = (script: LoginScripts): LoginScript => {
    switch (script) {
        case LoginScripts.CLASSIFIEDS:
            return new ClassifiedsScript()
        default:
            throw new Error(`Unknown login script: ${script}`)
    }
}
