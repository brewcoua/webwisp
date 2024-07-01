export interface TaskDifficultyProps {
    reasoning_difficulty: TaskDifficulty
    visual_difficulty: TaskDifficulty
    overall_difficulty: TaskDifficulty
}

export enum TaskDifficulty {
    HARD = 'hard',
    MEDIUM = 'medium',
    EASY = 'easy',
}

export interface TaskEvaluationProps {
    eval_types: TaskEvaluationType[]
    reference_answers?: TaskEvaluationReferenceAnswers | null
    reference_url?: string

    program_html?: TaskEvaluationProgramHtml[]
    page_image_query?: TaskEvaluationPageImageQuery[]

    url_note?: TaskEvaluationUrlNote
    string_note?: string
    reference_answer_raw_annotation?: string
}

export enum TaskEvaluationType {
    URL_MATCH = 'url_match',
    PROGRAM_HTML = 'program_html',
    STRING_MATCH = 'string_match',
    PAGE_IMAGE_QUERY = 'page_image_query',
}

export enum TaskEvaluationUrlNote {
    EXACT = 'EXACT',
    GOLD_IN_PRED = 'GOLD in PRED',
}

export interface TaskEvaluationReferenceAnswers {
    must_include?: string[]
    must_exclude?: string[]
    fuzzy_match?: string
}

export interface TaskEvaluationProgramHtml {
    url: string
    locator: string
    required_contents: {
        must_include?: string[]
        must_exclude?: string[]
    }
}

export interface TaskEvaluationPageImageQuery {
    eval_image_url: string
    eval_image_class: string
    eval_fuzzy_image_match: string
}

export interface TaskEvaluationResult {
    type: TaskEvaluationType
    score: number
}
