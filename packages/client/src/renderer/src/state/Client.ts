import { signal } from '@preact/signals'
import Gateway from '@renderer/api/Gateway'

export const Client = signal<ClientProps>({
    url: 'http://localhost:3000',
    gateway: new Gateway(),
})

export type ClientProps = {
    url: string
    gateway: Gateway
}
