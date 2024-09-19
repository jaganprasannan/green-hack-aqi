'use client'

import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'

import axios from 'axios'
import { Send } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  text: string
  isUser: boolean
}

export default function ChatInterface(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSend = async (): Promise<void> => {
    if (input.trim()) {
      const userMessage: Message = { text: input, isUser: true }
      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsLoading(true)

      try {
        const response = await axios.post('/api/v1/chat', { message: input })
        const aiMessage: Message = {
          text: response.data.response,
          isUser: false,
        }
        setMessages((prev) => [...prev, aiMessage])
      } catch (error) {
        console.error('Error fetching response from AI:', error)
        const errorMessage: Message = {
          text: "Sorry, I couldn't process that request.",
          isUser: false,
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Card className='h-full flex flex-col bg-transparent border shadow-lg backdrop-blur-sm'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold text-white'>
          Chat with AI
        </CardTitle>
      </CardHeader>
      <CardContent className='flex-grow'>
        <ScrollArea className='h-[calc(100vh-400px)]' ref={scrollRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
              <div
                className={`inline-block px-4 py-2 rounded-lg ${
                  message.isUser ? 'bg-green-700 text-white' : ' text-white'
                }`}>
                {message.isUser ? (
                  <p>{message.text}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ ...props }) => <p className='mb-2' {...props} />,
                      ul: ({ ...props }) => (
                        <ul className='list-disc ml-4 mb-2' {...props} />
                      ),
                      ol: ({ ...props }) => (
                        <ol className='list-decimal ml-4 mb-2' {...props} />
                      ),
                      li: ({ ...props }) => <li className='mb-1' {...props} />,
                      h1: ({ ...props }) => (
                        <h1 className='text-xl font-bold mb-2' {...props} />
                      ),
                      h2: ({ ...props }) => (
                        <h2 className='text-lg font-semibold mb-2' {...props} />
                      ),
                      strong: ({ ...props }) => (
                        <strong className='font-bold' {...props} />
                      ),
                    }}>
                    {message.text}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className='text-center'>
              <span className='inline-block p-2 rounded-lg bg-gray-700 text-white'>
                Thinking...
              </span>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className='flex w-full'>
          <Input
            type='text'
            placeholder='Type a message...'
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className='flex-grow mr-2 text-white'
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
