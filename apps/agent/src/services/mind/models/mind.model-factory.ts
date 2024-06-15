import { MindModelType } from '../mind.config'
import MindModel from './mind.model'

import OpenAIModel from './openai.model'

export default class MindModelFactory {
    public static makeModel(type: MindModelType): MindModel<unknown> {
        switch (type) {
            case 'openai':
                return new OpenAIModel()
        }
    }
}
