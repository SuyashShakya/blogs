
export default async function sitemap() {
   

  return [
    {
        url: `${process.env.NEXT_PUBLIC_HOST}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
    },
    {
        url: `${process.env.NEXT_PUBLIC_HOST}/blog/add`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
    },
    {
        url: `${process.env.NEXT_PUBLIC_HOST}/blog/unpublished-blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
    },
    
   
  ]
}