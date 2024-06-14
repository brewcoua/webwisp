import { MindModelType } from '../MindConfig'
import MindModel from './MindModel'

import OpenAIModel from './OpenAIModel'

export default class MindModelFactory {
    public static makeModel(type: MindModelType): MindModel<unknown> {
        switch (type) {
            case 'openai':
                return new OpenAIModel()
        }
    }
}
