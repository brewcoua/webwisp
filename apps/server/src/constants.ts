export const Contexts = {
    RunsService: 'RunsService',
    RunsGateway: 'RunsGateway',
    BrowserService: 'BrowserService',
    ContextWrapper: 'ContextWrapper',
    PageWrapper: (id: number) => `Page#${id}`,
    Runner: (id: string) => `Runner#${id}`,
    MindModule: 'MindModule',
}
