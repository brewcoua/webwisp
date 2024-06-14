import { Flex, FlexProps, Icon, Link, useColorModeValue } from '@chakra-ui/react'
import { IconType } from 'react-icons'

export interface NavItemProps extends FlexProps {
  icon: IconType
  href: string
  children: string | string[]
}

export default function NavItem({ icon, children, href, ...props }: NavItemProps): JSX.Element {
  return (
    <Link href={href} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: useColorModeValue('gray.200', 'gray.700'),
          color: useColorModeValue('gray.900', 'gray.200')
        }}
        transition=".05s"
        {...props}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white'
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  )
}
