import amqp from 'amqplib'

import Task from './domain/Task'

async function main() {
    const connection = await amqp.connect(
        `amqp://${process.env.RABBITMQ_HOST || 'localhost'}`
    )
    const channel = await connection.createChannel()

    channel.assertQueue('tasks_queue', { durable: true })
    channel.assertQueue('tasks_results_queue', { durable: true })
    channel.prefetch(1)

    channel.consume(
        'tasks_queue',
        async (msg) => {
            if (msg === null) {
                return
            }

            try {
                const task: Task = JSON.parse(msg.content.toString())
                console.log(`Received: ${task.id}`)

                await new Promise((resolve) => setTimeout(resolve, 5000))

                console.log(`Done: ${task.id}`)

                // Send acknowledgment, along with an event to another queue: tasks_results_queue
                channel.sendToQueue(
                    'tasks_results_queue',
                    Buffer.from(
                        JSON.stringify({
                            id: task.id,
                            status: 'done',
                        })
                    )
                )

                channel.ack(msg)
            } catch (error) {
                console.error(error)
                channel.nack(msg, false, true) // Requeue the message
            }
        },
        { noAck: false }
    )

    console.log('Worker started')
}

main().catch(console.error)
