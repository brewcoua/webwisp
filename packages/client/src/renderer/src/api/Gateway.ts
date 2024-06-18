import RunsGateway from './gateways/RunsGateway'

export default class Gateway {
    public readonly runs = new RunsGateway()
}
