import { ScenarioBase } from '@domain/scenario.base'
import { CreateTaskProps } from '@domain/task.types'

import { VisualWebArenaDataset } from '../datasets/vwa.dataset'

export class VWAClassifiedsScenario extends ScenarioBase<VisualWebArenaDataset> {
    private readonly baseUrl =
        'http://ec2-3-13-232-171.us-east-2.compute.amazonaws.com:9980'
    private readonly urlPlaceholder = '__CLASSIFIEDS__'

    constructor() {
        super({
            id: 'vwa-classified',
            name: 'VWA Classified',
            properties: {
                filters: {
                    site: 'classifieds',
                    evals: ['url_match', 'program_html'].join(', '),
                },
            },
            dataset: new VisualWebArenaDataset(),
        })
    }

    private replaceUrl<T extends string | string[]>(url?: T): T | undefined {
        if (!url) {
            return url
        }

        if (typeof url === 'string') {
            return url.replace(this.urlPlaceholder, this.baseUrl) as T
        }

        return url.map((u) => u.replace(this.urlPlaceholder, this.baseUrl)) as T
    }

    async load(): Promise<CreateTaskProps[]> {
        const data = await this.dataset.getDataset()

        return data
            .filter((item) => {
                if (
                    item.sites.length !== 1 ||
                    !item.sites.includes('classifieds')
                )
                    return false // Only keep classifieds
                if (item.image && item.image.length > 0) return false // Ignore images
                if (item.start_url.match(/\|OR\||\|AND\|/)) return false // Avoid cross-site scripting
                if (
                    item.eval.eval_types.some(
                        (evalType) =>
                            !['url_match', 'program_html'].includes(evalType)
                    )
                )
                    return false // Only evaluate URL match and program HTML for now

                return true
            })
            .map((item) => {
                return {
                    target: this.replaceUrl(item.start_url),
                    prompt: item.intent,
                    difficulty: {
                        reasoning_difficulty: item.reasoning_difficulty,
                        visual_difficulty: item.visual_difficulty,
                        overall_difficulty: item.overall_difficulty,
                    },
                    evaluation: {
                        eval_types: item.eval.eval_types,
                        reference_answers: item.eval.reference_answers && {
                            must_include: this.replaceUrl(
                                item.eval.reference_answers.must_include
                            ),
                            must_exclude: this.replaceUrl(
                                item.eval.reference_answers.must_exclude
                            ),
                            fuzzy_match: this.replaceUrl(
                                item.eval.reference_answers.fuzzy_match
                            ),
                        },
                        reference_url: this.replaceUrl(item.eval.reference_url),
                        program_html:
                            item.eval.program_html &&
                            item.eval.program_html.map((html) => {
                                return {
                                    ...html,
                                    url: this.replaceUrl(html.url),
                                }
                            }),
                        page_image_query:
                            item.eval.page_image_query &&
                            item.eval.page_image_query.map((query) => {
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
                        url_note: item.eval.url_note,
                        string_note: item.eval.string_note,
                    },
                } as CreateTaskProps
            })
    }
}
