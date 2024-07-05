import { Text } from '@chakra-ui/react'
import { useSelectedGroup } from '../selected.slice'

export default function GroupDisplay() {
    const group = useSelectedGroup()

    return (
        <>
            {!group && (
                <Text fontSize="lg" fontWeight="bold">
                    No group selected
                </Text>
            )}
            {group && (
                <>
                    <Text fontSize="2xl" fontWeight="bold">
                        {group.name}
                    </Text>
                    <Text>{group.id}</Text>
                </>
            )}
        </>
    )
}
