import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Scene from '@/components/Scene'

async function getListing(id: string) {
  const listing = await db.listing.findUnique({
    where: {
      id: id,
    },
  })

  if (!listing) {
    notFound()
  }

  return listing
}

export default async function ViewListing({ params }: { params: { listingId: string } }) {
  let listing;
  try {
    listing = await getListing(params.listingId)
  }
  catch (error) {
    notFound()
  }

  if (!listing.structSrc) {
    notFound()
  }

  return (
    <div>
      <h1 className='text-2xl font-bold leading-[1.25]'>{listing.title}</h1>
      <Scene url={listing.structSrc}/>
    </div>
  )
}