import { Box, Code, Flex, Link, Stack, StackDivider } from '@chakra-ui/react'
import { TaskProps } from '@domain/task.types'

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
            <Code
                h="100%"
                w="100%"
                display="block"
                whiteSpace="pre"
                wordBreak="break-word"
            >
                {details}
            </Code>
        </Stack>
    )
}
