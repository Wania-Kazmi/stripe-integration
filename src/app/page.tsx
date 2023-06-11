import Image from 'next/image'
import Link from 'next/link'


export default function Home() {
  return (
    <div>
      <div>
        <Link href={'./StripePayment'} ><button className='bg-gray-300 p-4'>Go to checkout page</button></Link>
      </div>
    </div>

  )
}
