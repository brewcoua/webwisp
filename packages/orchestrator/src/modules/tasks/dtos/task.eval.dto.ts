import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
    TaskDifficulty,
    TaskDifficultyProps,
    TaskEvaluationPageImageQuery,
    TaskEvaluationProgramHtml,
    TaskEvaluationProps,
    TaskEvaluationReferenceAnswers,
    TaskEvaluationResult,
    TaskEvaluationType,
    TaskEvaluationUrlNote,
} from '../domain/task.eval'
import {
    IsBoolean,
    IsEnum,
    IsObject,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class TaskDifficultyDto implements TaskDifficultyProps {
    @ApiProperty({
        example: TaskDifficulty.EASY,
        description: 'The reasoning difficulty of the task',
        enum: TaskDifficulty,
        enumName: 'TaskDifficulty',
    })
    @IsString()
    @IsEnum(TaskDifficulty)
    readonly reasoning_difficulty: TaskDifficulty

    @ApiProperty({
        example: TaskDifficulty.MEDIUM,
        description: 'The visual difficulty of the task',
        enum: TaskDifficulty,
        enumName: 'TaskDifficulty',
    })
    @IsString()
    @IsEnum(TaskDifficulty)
    readonly visual_difficulty: TaskDifficulty

    @ApiProperty({
        example: TaskDifficulty.HARD,
        description: 'The overall difficulty of the task',
        enum: TaskDifficulty,
        enumName: 'TaskDifficulty',
    })
    @IsString()
    @IsEnum(TaskDifficulty)
    readonly overall_difficulty: TaskDifficulty

    constructor(props: TaskDifficultyProps) {
        this.reasoning_difficulty = props.reasoning_difficulty
        this.visual_difficulty = props.visual_difficulty
        this.overall_difficulty = props.overall_difficulty
    }
}

export class TaskEvaluationResultDto implements TaskEvaluationResult {
    @ApiProperty({
        type: String,
        example: TaskEvaluationType.URL_MATCH,
        description: 'The type of the evaluation',
        enum: TaskEvaluationType,
        enumName: 'TaskEvaluationType',
    })
    @IsString()
    @IsEnum(TaskEvaluationType)
    readonly type: TaskEvaluationType

    @ApiProperty({
        example: false,
        description: 'The result of the evaluation',
    })
    @IsBoolean()
    @Type(() => Boolean)
    readonly result: boolean

    constructor(props: TaskEvaluationResult) {
        this.type = props.type
        this.result = props.result
    }
}

export class TaskEvaluationReferenceAnswersDto
    implements TaskEvaluationReferenceAnswers
{
    @ApiProperty({
        type: [String],
        description: 'The strings to include',
        example: ['string1', 'string2'],
    })
    @IsOptional()
    @IsString({ each: true })
    @MinLength(1, { each: true })
    @MaxLength(128, { each: true })
    readonly must_include?: string[]

    @ApiProperty({
        type: [String],
        description: 'The strings to exclude',
        example: ['string1', 'string2'],
    })
    @IsOptional()
    @IsString({ each: true })
    @MinLength(1, { each: true })
    @MaxLength(128, { each: true })
    readonly must_exclude?: string[]

    @ApiProperty({
        example: 'string',
        description: 'The fuzzy string to match',
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(128)
    readonly fuzzy_match?: string
}

export class TaskEvaluationProgramHtmlDto implements TaskEvaluationProgramHtml {
    @ApiProperty({
        example: 'https://example.com',
        description: 'The URL of the program HTML',
    })
    @IsString()
    readonly url: string

    @ApiProperty({
        example: "func:get_query_text(__page__, '.price')",
        description: 'The locator of the program HTML',
    })
    @IsString()
    readonly locator: string

    @ApiProperty({
        type: () => TaskEvaluationReferenceAnswersDto,
        description: 'The required content of the program HTML',
    })
    @ValidateNested()
    readonly required_contents: TaskEvaluationReferenceAnswersDto

    constructor(props: TaskEvaluationProgramHtml) {
        this.url = props.url
        this.locator = props.locator
        this.required_contents = props.required_contents
    }
}

export class TaskEvaluationPageImageQueryDto
    implements TaskEvaluationPageImageQuery
{
    @ApiProperty({
        example: 'https://example.com',
        description: 'The URL of the image query',
    })
    @IsString()
    @MaxLength(512)
    readonly eval_image_url: string

    @ApiProperty({
        example: '.price',
        description: 'The class of the image query',
    })
    @MaxLength(128)
    readonly eval_image_class: string

    @ApiProperty({
        example: 'https://example.com/image.png',
        description: 'The url to the image to fuzzy match',
    })
    @IsString()
    @MaxLength(512)
    readonly eval_fuzzy_image_match: string

    constructor(props: TaskEvaluationPageImageQuery) {
        this.eval_image_url = props.eval_image_url
        this.eval_image_class = props.eval_image_class
        this.eval_fuzzy_image_match = props.eval_fuzzy_image_match
    }
}

export class TaskEvaluationConfigDto implements TaskEvaluationProps {
    @ApiProperty({
        type: String,
        enum: TaskEvaluationType,
        enumName: 'TaskEvaluationType',
        isArray: true,
        description: 'The types of evaluation',
    })
    @IsString({ each: true })
    @IsEnum(TaskEvaluationType, { each: true })
    readonly eval_types: TaskEvaluationType[]

    @ApiProperty({
        type: () => TaskEvaluationReferenceAnswersDto,
        description: 'The reference answers of the evaluation',
    })
    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => TaskEvaluationReferenceAnswersDto)
    @ValidateNested()
    readonly reference_answers?: TaskEvaluationReferenceAnswersDto | null

    @ApiProperty({
        example: 'https://example.com',
        description: 'The reference URL of the evaluation, used for URL_MATCH',
    })
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readonly reference_url?: string

    @ApiProperty({
        type: () => [TaskEvaluationProgramHtmlDto],
        description:
            'The program HTML of the evaluation, only used for PROGRAM_HTML',
    })
    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => TaskEvaluationProgramHtmlDto)
    @ValidateNested({ each: true })
    readonly program_html?: TaskEvaluationProgramHtmlDto[]

    @ApiProperty({
        type: TaskEvaluationPageImageQueryDto,
        description:
            'The page image query of the evaluation, only used for PAGE_IMAGE_QUERY',
    })
    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => TaskEvaluationPageImageQueryDto)
    @ValidateNested({ each: true })
    readonly page_image_query?: TaskEvaluationPageImageQueryDto[]

    @ApiProperty({
        type: String,
        description: 'The URL note of the evaluation, only used for URL_MATCH',
        enum: TaskEvaluationUrlNote,
        enumName: 'TaskEvaluationUrlNote',
    })
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsEnum(TaskEvaluationUrlNote)
    readonly url_note?: TaskEvaluationUrlNote

    @ApiProperty({
        example: 'string',
        description:
            'The string note of the evaluation, only used for STRING_MATCH',
    })
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(128)
    readonly string_note?: string

    @ApiProperty({
        example: 'string',
        description:
            'The reference answer raw annotation of the evaluation, only used for STRING_MATCH',
    })
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(512)
    readonly reference_answer_raw_annotation?: string

    constructor(props: TaskEvaluationProps) {
        this.eval_types = props.eval_types
        this.reference_answers = props.reference_answers
        this.reference_url = props.reference_url
        this.program_html = props.program_html?.map(
            (html) => new TaskEvaluationProgramHtmlDto(html)
        )
        this.page_image_query = props.page_image_query?.map(
            (query) => new TaskEvaluationPageImageQueryDto(query)
        )
        this.url_note = props.url_note
        this.string_note = props.string_note
        this.reference_answer_raw_annotation =
            props.reference_answer_raw_annotation
    }
}

export class TaskEvaluationDto {
    @ApiProperty({
        type: () => [TaskEvaluationResultDto],
        description: 'The results of the evaluation',
    })
    readonly results: TaskEvaluationResultDto[]

    @ApiProperty({
        type: () => TaskEvaluationConfigDto,
        description: 'The configuration of the evaluation',
    })
    readonly config: TaskEvaluationConfigDto

    constructor(props: {
        results: TaskEvaluationResult[]
        config: TaskEvaluationProps
    }) {
        this.results = props.results.map(
            (result) => new TaskEvaluationResultDto(result)
        )
        this.config = props.config
    }
}
