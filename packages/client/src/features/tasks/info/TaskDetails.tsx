import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Code,
    Flex,
    Heading,
    HStack,
    Link,
    Stack,
    StackDivider,
    Tag,
    Text,
} from '@chakra-ui/react'
import { TaskDifficulty } from '@domain/task.eval'
import { TaskProps, TaskStatus } from '@domain/task.types'

export interface TaskDetailsProps {
    task: TaskProps
}

export default function TaskDetails({ task }: TaskDetailsProps) {
    const details = (
        <>
            <b>id:</b> {task.id}
            {task.group && (
                <>
                    <br />
                    <b>group:</b> {task.group}
                </>
            )}
            <br />
            <b>status:</b> {task.status}
            <br />
            <b>target: </b>
            <Link href={task.target} isExternal>
                {task.target}
            </Link>
            <br />
            <b>prompt:</b> {task.prompt}
            {task.message && (
                <>
                    <br />
                    <br />
                    <b>message:</b> {task.message}
                </>
            )}
            {task.value && (
                <>
                    <br />
                    <b>value:</b> {task.value}
                </>
            )}
            {task.difficulty && (
                <>
                    <br />
                    <br />
                    <b>difficulty:</b> {task.difficulty.visual_difficulty} /{' '}
                    {task.difficulty.reasoning_difficulty} /{' '}
                    {task.difficulty.overall_difficulty}
                    <br />
                </>
            )}
            {task.evaluation && (
                <>
                    <br />
                    <b>evaluation:</b>
                    <Flex ml={3} direction="column">
                        <Box>
                            <b>results: </b>
                            {task.evaluation.results
                                .reduce((acc, res) => acc + res.score, 0)
                                .toString() + ' '}
                            / {task.evaluation.results.length}
                        </Box>
                        <b>config:</b>
                        <Flex ml={3} direction="column">
                            {task.evaluation.config.eval_types.map((type) => (
                                <Box>
                                    <b>{type}: </b>
                                    {task.evaluation?.results.find(
                                        (res) => res.type === type
                                    )?.score || 'N/A'}
                                </Box>
                            ))}
                        </Flex>
                    </Flex>
                </>
            )}
        </>
    )

    return (
        <Stack
            spacing={4}
            divider={<StackDivider />}
            direction="column"
            h="100%"
            w="100%"
        >
            <OverallDetails task={task} />
            <TargetDetails task={task} />
            {task.difficulty && <DifficultyDetails task={task} />}
            {task.evaluation && <EvaluationDetails task={task} />}
        </Stack>
    )
}

export function OverallDetails({ task }: TaskDetailsProps) {
    const overallScore = task.evaluation?.results.reduce(
        (acc, res) => acc + res.score,
        0
    )
    const maxScore = task.evaluation?.results.length
    const overallPercentage = Number(
        overallScore && maxScore ? (overallScore / maxScore) * 100 : 0
    )

    let statusColor = 'gray'
    switch (task.status) {
        case TaskStatus.RUNNING:
            statusColor = 'blue'
            break
        case TaskStatus.PENDING:
            statusColor = 'yellow'
            break
        case TaskStatus.COMPLETED:
            statusColor = 'green'
            break
        case TaskStatus.FAILED:
            statusColor = 'red'
            break
    }

    return (
        <Card>
            <CardBody display="flex" flexDir="column" gap={2}>
                <HStack divider={<StackDivider />} spacing={2}>
                    <Flex gap={1}>
                        <Text fontWeight="bold">ID:</Text>
                        <Code>{task.id}</Code>
                    </Flex>
                    {task.group && (
                        <Flex gap={1}>
                            <Text fontWeight="bold">Group:</Text>
                            <Code>{task.group}</Code>
                        </Flex>
                    )}
                </HStack>
                <Flex gap={1}>
                    <Text fontWeight="bold">Status:</Text>
                    <Tag size="md" variant="solid" colorScheme={statusColor}>
                        {task.status.substring(0, 1).toUpperCase() +
                            task.status.substring(1).toLowerCase()}
                    </Tag>
                </Flex>
                {task.evaluation && (
                    <Flex gap={1}>
                        <Text fontWeight="bold">Overall Score:</Text>
                        {maxScore && maxScore > 0 && (
                            <>
                                <Tag
                                    size="md"
                                    variant="solid"
                                    colorScheme={
                                        overallPercentage >= 90
                                            ? 'green'
                                            : overallPercentage >= 70
                                              ? 'yellow'
                                              : 'red'
                                    }
                                >
                                    {overallPercentage.toFixed(2)}%
                                </Tag>
                                <Text fontSize="sm">
                                    ({overallScore}/{maxScore})
                                </Text>
                            </>
                        )}
                        {!maxScore && (
                            <Tag size="md" variant="solid" colorScheme="gray">
                                N/A
                            </Tag>
                        )}
                    </Flex>
                )}
            </CardBody>
        </Card>
    )
}

export function TargetDetails({ task }: TaskDetailsProps) {
    return (
        <Card>
            <CardBody display="flex" flexDir="column" gap={2}>
                <Flex gap={1}>
                    <Text fontWeight="bold">Target:</Text>
                    <Link href={task.target} isExternal>
                        {task.target}
                    </Link>
                </Flex>
                <Flex gap={1}>
                    <Text fontWeight="bold">Prompt:</Text>
                    <Text>{task.prompt}</Text>
                </Flex>
            </CardBody>
        </Card>
    )
}

export function DifficultyTag({ difficulty }: { difficulty: TaskDifficulty }) {
    let color
    switch (difficulty) {
        case TaskDifficulty.EASY:
            color = 'green'
            break
        case TaskDifficulty.MEDIUM:
            color = 'yellow'
            break
        case TaskDifficulty.HARD:
            color = 'red'
            break
    }

    return (
        <Tag size="sm" colorScheme={color}>
            {difficulty.substring(0, 1).toUpperCase() + difficulty.substring(1)}
        </Tag>
    )
}
export function DifficultyDetails({ task }: TaskDetailsProps) {
    if (!task.difficulty) return null

    return (
        <Card>
            <CardHeader pb={1}>
                <Heading size="md">Difficulty</Heading>
            </CardHeader>
            <CardBody display="flex" flexDir="column" gap={2} pt={1}>
                <Flex gap={1}>
                    <Text fontWeight="bold">Overall:</Text>
                    <DifficultyTag
                        difficulty={task.difficulty.overall_difficulty}
                    />
                </Flex>
                <Flex gap={1}>
                    <Text fontWeight="bold">Visual:</Text>
                    <DifficultyTag
                        difficulty={task.difficulty.visual_difficulty}
                    />
                </Flex>
                <Flex gap={1}>
                    <Text fontWeight="bold">Reasoning:</Text>
                    <DifficultyTag
                        difficulty={task.difficulty.reasoning_difficulty}
                    />
                </Flex>
            </CardBody>
        </Card>
    )
}

export function EvaluationDetails({ task }: TaskDetailsProps) {
    if (!task.evaluation) return null
    console.log(task.evaluation.results, task.evaluation.config.eval_types)

    return (
        <Card>
            <CardHeader pb={1}>
                <Heading size="md">Evaluation</Heading>
            </CardHeader>
            <CardBody display="flex" flexDir="column" gap={2} pt={1}>
                {task.evaluation.config.eval_types.map((type) => (
                    <Flex gap={1} key={type}>
                        <Code fontWeight="bold">{type}:</Code>
                        <Tag size="sm" colorScheme="blue">
                            {task.evaluation?.results.find(
                                (res) => res.type === type
                            )?.score ?? 'N/A'}
                        </Tag>
                    </Flex>
                ))}
            </CardBody>
        </Card>
    )
}
