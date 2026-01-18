'use client'

import { createContext } from 'react'

interface IBlogSingleContext {
   id: string
}

export const BlogSingleContext = createContext<IBlogSingleContext>({ id: '' })

interface IBLogSingleContextProviderProps {
   id: string
   children: React.ReactNode
}

const BlogSingleContextProvider = ({ id, children }: IBLogSingleContextProviderProps) => {
   return <BlogSingleContext.Provider value={{ id }}>{children}</BlogSingleContext.Provider>
}

export default BlogSingleContextProvider
