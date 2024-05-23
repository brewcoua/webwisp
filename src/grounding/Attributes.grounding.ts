import { None, Option, Some } from 'oxide.ts'
import { extractColors } from 'extract-colors'
import { get } from '@andreekeberg/imagedata'
import { ElementHandle, Locator } from 'playwright'

import { useConfig } from '../hooks'
import { Grounding } from '../domain/Grounding'
import type { ClickableElement, Element } from '../domain/Public'

export enum Direction {
    North= "north",
    NorthEast = "north-east",
    NorthWest = "north-west",
    East = "east",
    South = "south",
    SouthEast = "south-east",
    SouthWest = "south-west",
    West = "west"
}

export type ElementPointer = {
    role: ClickableElement
    name?: string
    background_color?: string
    neighbors?: ElementNeighbor[]
}

type ElementNeighbor = {
    role: Element
    direction: Direction
    name?: string
    background_color?: string
}

export class AttributesGrounding extends Grounding {
    private get_hsl(color: string): [number, number, number] {
        if (color.startsWith('#')) color = color.substring(1)
        const r = parseInt(color.substring(0, 2), 16) / 255
        const g = parseInt(color.substring(2, 4), 16) / 255
        const b = parseInt(color.substring(4, 6), 16) / 255

        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        let h = 0, s = 0, l = (max + min) / 2

        if (max === min) {
            h = s = 0 // achromatic
        } else {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0)
                    break
                case g:
                    h = (b - r) / d + 2
                    break
                case b:
                    h = (r - g) / d + 4
                    break
            }
            h /= 6
        }
        return [h, s, l]
    }

    private async is_background(element: ElementHandle, color: string): Promise<boolean> {
        const screenshot = await element.screenshot()
        const blob = new Blob([screenshot], { type: 'image/png' })

        const data = await get(blob)
        const colors = await extractColors(data)
        const ftune = useConfig().per_method.attrib

        const hsl = this.get_hsl(color)
        return colors.some(c =>
            Math.abs(c.hue - hsl[0]) < ftune.hue_distance &&
            Math.abs(c.saturation - hsl[1]) < ftune.saturation_distance &&
            Math.abs(c.lightness - hsl[2]) < ftune.lightness_distance,
        )
    }

    private async get_neighbors(handle: ElementHandle, direction: Direction, pointer: ElementPointer): Promise<ElementHandle[]> {
        const radius = useConfig().per_method.attrib.max_neighbor_radius
        // Find all neighbors that match the elementpointer within a given radius and that are towards the angle
        const neighBox = await handle.boundingBox()
        if (!neighBox) return []

        // First get all elements that are clickable (either by default or with a click event)
        const clickable = await this.page.locator(
            useConfig().per_method.attrib.selectors[pointer.role].join(', '),
        ).elementHandles()
        const filtered = await Promise.all(clickable.map(async handle => {
            if (pointer.name) {
                const text = await handle.innerText()
                if (!text.includes(pointer.name)) return false
            }

            const box = await handle.boundingBox()
            if (!box) return false

            const distance = Math.sqrt(Math.pow(box.x - neighBox.x, 2) + Math.pow(box.y - neighBox.y, 2))
            if (distance >= radius) {
                return false
            }

            // Check if direction is right (the direction is the one from the pointer to the neighbor)
            // Namely, we want to find the element for which the handle is the neighbor and in the given direction
            const angle = Math.atan2(box.y - neighBox.y, box.x - neighBox.x)
            const isDirection = () => {
                switch (direction) {
                    case Direction.South:
                        return angle < Math.PI / 2 && angle > -Math.PI / 2
                    case Direction.SouthWest:
                        return angle < 0 && angle > -Math.PI / 2
                    case Direction.SouthEast:
                        return angle < Math.PI / 2 && angle > 0
                    case Direction.West:
                        return angle < Math.PI / 2 && angle > -Math.PI / 2
                    case Direction.North:
                        return angle > Math.PI / 2 || angle < -Math.PI / 2
                    case Direction.NorthWest:
                        return angle > 0 && angle < Math.PI / 2
                    case Direction.NorthEast:
                        return angle > -Math.PI / 2 && angle < 0
                    case Direction.East:
                        return angle < Math.PI && angle > Math.PI / 2
                }
            }

            if (!isDirection()) {
                return false
            }

            if (pointer.background_color) {
                const isBackground = await this.is_background(handle, pointer.background_color)
                if (!isBackground) return false
            }

            this.logger.debug(`Found neighbor at distance ${distance}`)

            return [handle, distance]
        }))

        return (filtered
            .filter(Boolean) as [ElementHandle, number][])
            .sort((a, b) => a[1] - b[1])
            .map(([handle]) => handle)
    }

    private async resolve_loc(locator: Locator, pointer: ElementPointer): Promise<Option<ElementHandle>> {
        const count = await locator.count()
        if (count === 0) {
            return None
        } else if (count === 1) {
            const element = await locator.elementHandle()
            return element ? Some(element) : None
        }

        // Count by applying additional filters
        const handles = await locator.elementHandles()
        const filtered = await Promise.all(handles.map(async handle => {
            if (pointer.background_color) {
                const isBackground = await this.is_background(handle, pointer.background_color)
                if (!isBackground) return false
            }

            if (pointer.neighbors) {
                this.logger.debug('Checking neighbors')
                const neighbors = await Promise.all(pointer.neighbors.map(async neighbor => {
                    // Resolve the neighbor
                    let loc;
                    if (neighbor.role === 'text') {
                        loc = this.page.getByText(neighbor.name || '').first()
                    } else {
                        loc = this.page.getByRole(
                            neighbor.role,
                            { name: neighbor.name }
                        ).first()
                    }

                    const handle = await loc.elementHandle();
                    if (!handle) return false;
                    this.logger.debug('Resolved neighbor handle')

                    const neighborHandles = await this.get_neighbors(handle, neighbor.direction, pointer)
                    return neighborHandles.length > 0
                }))
                if (!neighbors.every(Boolean)) return false
            }

            return handle
        }))
        const flattened = filtered.filter(Boolean) as ElementHandle[];

        this.logger.debug(`Filtered ${flattened.length} elements by background color and neighbors`)

        return flattened.length > 0 ? Some(flattened[0]) : None
    }

    public async resolve(pointer: ElementPointer): Promise<Option<ElementHandle>> {
        // First iteration: name & role
        const selector1 = this.page.getByRole(pointer.role, { name: pointer.name })
        const element1 = await this.resolve_loc(selector1, pointer)

        if (element1.isSome()) {
            return element1
        }
        this.logger.debug('Element not found by role and name, trying by label and placeholder')

        // Second iteration: if name is set, try by label and by placeholder
        if (!pointer.name) {
            return None
        }

        const selector2 = this.page.getByLabel(pointer.name)
        const element2 = await this.resolve_loc(selector2, pointer)
        if (element2.isSome()) {
            return element2
        }

        const selector3 = this.page.getByPlaceholder(pointer.name)
        return await this.resolve_loc(selector3, pointer)
    }
}