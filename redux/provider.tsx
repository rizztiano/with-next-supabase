'use client'

const ReduxAppProvider = ({ children }: { children: React.ReactNode }) => {
   // return <Provider store={store}>{children}</Provider>
   return children
}

export default ReduxAppProvider
