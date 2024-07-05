import { Select } from '@chakra-ui/react'

import {
    clearGroup,
    clearTask,
    selectGroup,
    setDisplay,
    useSelectedGroup,
} from '../selected.slice'
import { useGroups } from '../groups.slice'
import { useAppDispatch } from '@store/hooks'

export default function GroupSelector() {
    const groups = useGroups()
    const selectedGroup = useSelectedGroup()
    const dispatch = useAppDispatch()

    const onGroupSelect = (groupId: string) => {
        if (!groupId || groupId.trim() === '') {
            dispatch(clearGroup())
        } else {
            const group = groups.find((group) => group.id === groupId)
            if (group) {
                dispatch(selectGroup(group))
            }
        }
        dispatch(clearTask())
        dispatch(setDisplay(undefined))
    }

    return (
        <Select
            value={selectedGroup?.id}
            onChange={(e: any) => onGroupSelect(e.target.value)}
        >
            <option value="">Unassigned</option>
            {groups.map((group) => (
                <option key={group.id} value={group.id}>
                    {group.name}
                </option>
            ))}
        </Select>
    )
}
