export interface DatasetBaseProps {
    id: string
    name: string
    url: string
}

export abstract class DatasetBase<DataFormat> {
    public readonly id: string
    public readonly name: string
    public readonly url: string

    constructor(props: DatasetBaseProps) {
        this.id = props.id
        this.name = props.name
        this.url = props.url
    }

    public async getDataset(): Promise<DataFormat[]> {
        const response = await fetch(this.url)
        return await response.json()
    }
}
