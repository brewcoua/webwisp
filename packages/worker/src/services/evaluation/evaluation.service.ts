import { PageWrapper } from '@services/browser/wrappers'
import {
    TaskEvaluationProgramHtml,
    TaskEvaluationProps,
    TaskEvaluationResult,
    TaskEvaluationType,
    TaskEvaluationUrlNote,
} from '@services/execution/domain/task.eval'
import { Logger } from 'winston'
import StringHelper from './helpers/string.helper'

export default class EvaluationService {
    private readonly logger: Logger

    constructor(logger: Logger) {
        this.logger = logger.child({
            context: 'EvaluationService',
        })
    }

    async evaluate(
        page: PageWrapper,
        props: TaskEvaluationProps
    ): Promise<TaskEvaluationResult[]> {
        const results: TaskEvaluationResult[] = []

        for (const type of props.eval_types) {
            let score = 0.0

            switch (type) {
                case TaskEvaluationType.URL_MATCH:
                    if (props.reference_url && props.url_note) {
                        score = this.url_match(
                            props.reference_url,
                            props.url_note,
                            page
                        )
                    }
                    break
                case TaskEvaluationType.PROGRAM_HTML:
                    if (props.program_html) {
                        score = await this.program_html(
                            props.program_html,
                            page
                        )
                    }
                    break
                default:
                    score = 1.0 // Not implemented yet
            }

            results.push({
                type,
                score,
            })
        }

        return results
    }

    private url_match(
        reference_url: string,
        matching: TaskEvaluationUrlNote,
        page: PageWrapper
    ): number {
        const pred = new URL(page.url || '')

        const ref_urls = reference_url.split(' |OR| ').map((url: string) => {
            url = url
                .replace('localhost', '127.0.0.1')
                .replace(/__[A-Z]+__/g, pred.origin)
            return new URL(url)
        })

        switch (matching) {
            case TaskEvaluationUrlNote.EXACT:
                if (ref_urls.includes(pred)) {
                    return 1.0
                }
                return 0.0
            case TaskEvaluationUrlNote.GOLD_IN_PRED:
                if (ref_urls.some((ref) => pred.href.includes(ref.href))) {
                    return 1.0
                }
                return 0.0
            default:
                throw new Error(`Unknown URL matching note: ${matching}`)
        }
    }

    private async program_html(
        program_html: TaskEvaluationProgramHtml[],
        page: PageWrapper
    ): Promise<number> {
        let score = 1.0
        const page_url = new URL(page.url || '')

        for (const target of program_html) {
            const target_url = target.url.replace(
                /__[A-Z]+__/g,
                page_url.origin
            )

            if (target_url !== 'last') {
                page.goto(target_url)
                await page.waitToLoad()
            }

            let selected_element: string | undefined
            if (!target.locator.trim()) {
                selected_element = (await page.getContent()) || ''
            } else if (
                target.locator.startsWith('document.') ||
                target.locator.startsWith('[...document.')
            ) {
                selected_element = await page.evaluate(
                    `() => ${target.locator}`
                )
                if (!selected_element) {
                    selected_element = ''
                }
            } else if (target.locator.startsWith('lambda:')) {
                const func = target.locator.split('lambda:')[1]
                selected_element = await page.evaluate(func)
                if (!selected_element) {
                    selected_element = ''
                }
            } else if (target.locator.startsWith('func:')) {
                const func = target.locator.split('func:')[1]
                const func_name = func.split('(')[0]
                const func_args = func
                    .split('(')[1]
                    .split(')')[0]
                    .split(',')
                    .map((arg) => arg.trim())
                switch (func_name) {
                    case 'get_query_text': {
                        const query = StringHelper.clean(func_args[1])
                        selected_element =
                            (await page.getQueryText(query)) || ''
                    }
                }
            } else {
                throw new Error(`Unknown locator: ${target.locator}`)
            }

            if (selected_element === undefined) {
                return 0.0
            }

            if (target.required_contents.must_include) {
                const required_contents = target.required_contents.must_include
                required_contents.forEach((content) => {
                    const content_or = content.split(' |OR| ')
                    score *= content_or.some((c) =>
                        StringHelper.must_include(c, selected_element)
                    )
                        ? 1.0
                        : 0.0
                })
            } else if (target.required_contents.must_exclude) {
                const required_contents = target.required_contents.must_exclude
                required_contents.forEach((content) => {
                    if (content.includes(' |OR| ')) {
                        throw new Error('Must exclude cannot contain |OR|')
                    }

                    score *= StringHelper.must_exclude(
                        content,
                        selected_element
                    )
                        ? 1.0
                        : 0.0
                })
            } else {
                throw new Error(
                    `Unknown required contents: ${Object.keys(target.required_contents).join(', ')}`
                )
            }
        }

        return score
    }
}
