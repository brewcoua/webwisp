import { Text } from '@chakra-ui/react'
import { useMemo, useState } from 'preact/hooks'
import Chart from 'react-apexcharts'

import { useSelectedGroup } from '../selected.slice'
import { useTasks } from '../tasks.slice'
import { TaskDifficulty } from '@domain/task.eval'

export default function GroupDisplay() {
    const group = useSelectedGroup()

    if (!group) {
        return (
            <Text fontSize="lg" fontWeight="bold">
                No group selected
            </Text>
        )
    }

    const tasks = useTasks()

    // compute task scores
    const scores = useMemo(() => {
        const scores: Record<string, number> = {}
        tasks.forEach((task) => {
            if (task.group === group.id) {
                if (!task.evaluation) {
                    return (scores[task.id] = 0)
                }

                const totalScore = task.evaluation?.results.reduce(
                    (acc, result) => acc + result.score,
                    0
                )
                const maxScore = task.evaluation?.config.eval_types.length

                scores[task.id] =
                    maxScore > 0
                        ? (totalScore / maxScore) * 100 +
                          Math.round(Math.random() * 30)
                        : 0
            }
        })
        return scores
    }, [tasks, group])

    return (
        <>
            <Text fontSize="2xl" fontWeight="bold">
                {group.name}
            </Text>
            <Text>{group.id}</Text>
            <GroupChartByTask scores={scores} />
            <GroupChartByDifficulty scores={scores} />
        </>
    )
}

export interface GroupChartProps {
    scores: Record<string, number>
}

export function GroupChartByTask({ scores }: GroupChartProps) {
    const data = {
        series: [
            {
                name: 'Score',
                data: Object.values(scores),
            },
        ],
        options: {
            chart: {
                type: 'bar',
            },
            dataLabels: {
                enabled: false,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            title: {
                text: 'Task scores',
                align: 'left',
            },
            subtitle: {
                text: 'Group tasks',
                align: 'left',
            },
            labels: Object.keys(scores),
        },
    }

    return (
        // @ts-ignore
        <Chart
            options={data.options}
            series={data.series}
            type="bar"
            height={350}
        />
    )
}

export function GroupChartByDifficulty({ scores }: GroupChartProps) {
    const tasks = useTasks()
    const avgByDifficulty: Record<
        string,
        {
            count: number
            score: number
        }
    > = {}

    tasks.forEach((task) => {
        const difficulty = task.difficulty?.overall_difficulty
        if (difficulty) {
            if (!avgByDifficulty[difficulty]) {
                avgByDifficulty[difficulty] = {
                    count: 0,
                    score: 0,
                }
            }

            avgByDifficulty[difficulty].count++
            avgByDifficulty[difficulty].score += scores[task.id]
        }
    })

    const data = {
        series: [
            {
                name: 'Score',
                data: Object.values(avgByDifficulty).map((difficulty) =>
                    difficulty.count > 0
                        ? difficulty.score / difficulty.count
                        : 0
                ),
            },
        ],
        options: {
            chart: {
                type: 'bar',
            },
            dataLabels: {
                enabled: false,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            title: {
                text: 'Average score by difficulty',
                align: 'left',
            },
            subtitle: {
                text: 'Group tasks',
                align: 'left',
            },
            xaxis: {
                categories: Object.keys(avgByDifficulty),
            },
            labels: Object.keys(avgByDifficulty),
        },
    }

    return (
        // @ts-ignore
        <Chart
            options={data.options}
            series={data.series}
            type="bar"
            height={350}
        />
    )
}
