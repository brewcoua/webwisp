import { Box, Drawer, DrawerContent, useDisclosure } from '@chakra-ui/react'
import SidebarContent from './SidebarContent'
import MobileNav from './MobileNav'

export default function Sidebar({ children }: { children?: JSX.Element }): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh" w="100%">
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} h="100%">
        {children}
      </Box>
    </Box>
  )
}
