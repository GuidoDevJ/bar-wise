import { ReactNode } from 'react'
import MainFooter from '../footer/MainFooter'
import Header from '../header/Header'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        {children}
      </main>
      <MainFooter />
    </>
  )
}

export default MainLayout
