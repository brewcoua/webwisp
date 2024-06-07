import WebwispError from '@/domain/errors/Error'

import { MindModelType } from '../MindConfig'
import MindModel from './MindModel'

import OpenAIModel from './OpenAIModel'

export default class MindModelFactory {
    public static makeModel(type: MindModelType): MindModel<unknown> {
        switch (type) {
            case 'openai':
                return new OpenAIModel()
            default:
                throw new WebwispError(`Unknown model type: ${type}`)
        }
    }
}
