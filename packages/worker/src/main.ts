import amqp from 'amqplib'

const queue = 'task_queue'

async function main() {
    const connection = await amqp.connect('amqp://rabbitmq')
    const channel = await connection.createChannel()

    channel.assertQueue(queue, { durable: true })
    channel.prefetch(1)

    channel.consume(
        queue,
        async (msg) => {
            if (msg === null) {
                return
            }

            const content = msg.content.toString()
            console.log(`Received: ${content}`)

            await new Promise((resolve) => setTimeout(resolve, 1000))

            console.log(`Done: ${content}`)
            channel.ack(msg)
        },
        { noAck: false }
    )

    console.log('Worker started')
}

main().catch(console.error)
