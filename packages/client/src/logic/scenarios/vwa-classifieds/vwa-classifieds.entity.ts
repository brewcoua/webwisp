import { DataEntity } from '@domain/logic/data.entity'
import { CreateTaskProps } from '@domain/task.types'
import { VisualWebArenaData } from '@logic/datasets/vwa.dataset'

const BASE_URL = 'http://ec2-3-13-232-171.us-east-2.compute.amazonaws.com:9980'
const URL_PLACEHOLDER = '__CLASSIFIEDS__'

export class VWAClassifiedsEntity extends DataEntity<VisualWebArenaData> {
    constructor(props: VisualWebArenaData) {
        super(props.task_id.toString(), props)
    }

    isFiltered(): boolean {
        if (
            this.props.sites.length !== 1 ||
            !this.props.sites.includes('classifieds')
        )
            return true // Only keep classifieds
        if (this.props.image && this.props.image.length > 0) return true // Ignore images
        if (this.props.start_url.match(/\|OR\||\|AND\|/)) return true // Avoid cross-site scripting
        if (
            this.props.eval.eval_types.some(
                (evalType) => !['url_match', 'program_html'].includes(evalType)
            )
        )
            return true // Only evaluate URL match and program HTML for now

        return false
    }

    toTask(): CreateTaskProps {
        return {
            target: this.replaceUrl(this.props.start_url),
            prompt: this.props.intent,
            difficulty: {
                reasoning_difficulty: this.props.reasoning_difficulty,
                visual_difficulty: this.props.visual_difficulty,
                overall_difficulty: this.props.overall_difficulty,
            },
            evaluation: {
                eval_types: this.props.eval.eval_types,
                reference_answers: this.props.eval.reference_answers && {
                    must_include: this.replaceUrl(
                        this.props.eval.reference_answers.must_include
                    ),
                    must_exclude: this.replaceUrl(
                        this.props.eval.reference_answers.must_exclude
                    ),
                    fuzzy_match: this.replaceUrl(
                        this.props.eval.reference_answers.fuzzy_match
                    ),
                },
                reference_url: this.replaceUrl(this.props.eval.reference_url),
                program_html:
                    this.props.eval.program_html &&
                    this.props.eval.program_html.map((html) => {
                        return {
                            ...html,
                            url: this.replaceUrl(html.url),
                        }
                    }),
                page_image_query:
                    this.props.eval.page_image_query &&
                    this.props.eval.page_image_query.map((query) => {
                        return {
                            ...query,
                            eval_image_url: this.replaceUrl(
                                query.eval_image_url
                            ),
                            eval_fuzzy_image_match: this.replaceUrl(
                                query.eval_fuzzy_image_match
                            ),
                        }
                    }),
                url_note: this.props.eval.url_note,
                string_note: this.props.eval.string_note,
            },
        } as CreateTaskProps
    }

    private replaceUrl<T extends string | string[]>(url?: T): T | undefined {
        if (!url) {
            return url
        }

        if (typeof url === 'string') {
            return url.replace(URL_PLACEHOLDER, BASE_URL) as T
        }

        return url.map((u) => u.replace(URL_PLACEHOLDER, BASE_URL)) as T
    }
}
