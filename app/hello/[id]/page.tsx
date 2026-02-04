import React from 'react'

export default async function page({params}: {params: {id: string} }) {
    const {id} = await params
  return (
    <div>{id}</div>
  )
}
