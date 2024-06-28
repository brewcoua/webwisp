import { DatasetBase } from '@domain/dataset.base'

export class VisualWebArenaDataset extends DatasetBase<VisualWebArenaData> {
    constructor() {
        super({
            id: 'vwa',
            name: 'Visual Web Arena',
            url: 'https://raw.githubusercontent.com/web-arena-x/visualwebarena/main/config_files/vwa/test_classifieds.raw.json',
        })
    }
}

export interface VisualWebArenaData {
    sites: string[]
    task_id: number
    required_login: boolean
    storage_state: string
    start_url: string
    geolocation: null
    intent_template: string
    intent: string
    image: string | null
    instantiation_dict: Record<string, string>
    require_reset: boolean
    eval: {
        eval_types: string[]
        reference_answers: {
            must_include?: string[]
            must_exclude?: string[]
            fuzzy_match?: string
        } | null
        reference_url: string
        program_html: {
            url: string
            locator: string
            required_contents: {
                must_include?: string[]
                must_exclude?: string[]
                fuzzy_match?: string
            }
        }[]
        page_image_query: {
            eval_image_url: string
            eval_image_class: string
            eval_fuzzy_image_match: string
        }[]
        url_note?: string
        string_note?: string
        reference_answer_raw_annotation?: string
    }
    reasoning_difficulty: string
    visual_difficulty: string
    overall_difficulty: string
    comments: string
    intent_template_id: number
}
