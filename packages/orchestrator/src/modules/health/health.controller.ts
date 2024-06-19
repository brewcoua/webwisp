import { Controller, Get } from '@nestjs/common'
import {
    HealthCheckService,
    HealthCheck,
    DiskHealthIndicator,
    MemoryHealthIndicator,
} from '@nestjs/terminus'

@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly disk: DiskHealthIndicator,
        private readonly memory: MemoryHealthIndicator
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () =>
                this.disk.checkStorage('storage', {
                    path: '/',
                    thresholdPercent: 0.8,
                }),
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
        ])
    }
}
