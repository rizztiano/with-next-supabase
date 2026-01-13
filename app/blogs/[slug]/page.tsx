import { use } from 'react'

const Page = ({ params }: { params: Promise<{ slug: string }> }) => {
   const { slug } = use(params)
   return <div>{slug}</div>
}

export default Page
