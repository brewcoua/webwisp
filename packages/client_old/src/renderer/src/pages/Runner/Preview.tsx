import { Box, BoxProps, Flex, Spinner, Text, useColorModeValue } from '@chakra-ui/react'
import { WebviewTag } from 'electron'
import { useEffect, useRef, useState } from 'preact/hooks'

export interface PreviewProps extends BoxProps {
  url: string
}

export default function Preview({ url, ...props }: PreviewProps): JSX.Element {
  const webviewRef = useRef<WebviewTag>()
  const [isRunnerStarting, setIsRunnerStarting] = useState(url === '')
  const [isWebviewLoading, setIsWebviewLoading] = useState(true)

  useEffect(() => {
    setIsRunnerStarting(url === '')
  }, [url])

  // Once webview is loaded, inject css
  useEffect(() => {
    const webview = webviewRef.current
    if (!webview) return

    webview.addEventListener('dom-ready', () => {
      webview.insertCSS(`
        div[slot="insertion-point-sidebar"] {
            display: none !important;
        }
      `)

      // Then, inject css inside the shadow root of div.split-widget
      const script = `
            let splitWidget = document.querySelector('div.split-widget')
            setInterval(() => {
                splitWidget = document.querySelector('div.split-widget')
                if (splitWidget) {
                    const shadowRoot = splitWidget.shadowRoot
                    if (shadowRoot) {
                        const style = document.createElement('style')
                        style.textContent = \`
                        div.shadow-split-widget-sidebar {
                            display: none !important;
                        }
                        \`
                        shadowRoot.appendChild(style)
                    }
                }
            }, 1000)
        `
      webview.executeJavaScript(script)
      setIsWebviewLoading(false)
    })
  }, [webviewRef])

  return (
    <Box {...props} style={{ width: '100%', height: '70%' }} position="relative" borderRadius={10}>
      <Flex
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg={useColorModeValue('white', 'gray.800')}
        display={isWebviewLoading || isRunnerStarting ? 'flex' : 'none'}
        alignItems="center"
        justifyContent="center"
      >
        {isRunnerStarting && <Text>Runner is starting...</Text>}
        <Spinner size="xl" />
      </Flex>
      <webview
        ref={webviewRef}
        src={url}
        style={{ width: '100%', height: '100%', borderRadius: '20px' }}
      />
    </Box>
  )
}
