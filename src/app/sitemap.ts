import { getPosts } from "@/utils/apiFunctions"

export default async function sitemap() {
    const publishedBlogs = await getPosts(1, 10, true, true) 
    
    const publishedBlogsSitemap = publishedBlogs?.posts ? publishedBlogs?.posts?.map((blog:{id?:string}) => (
        {
            url: `${process.env.NEXT_PUBLIC_HOST}/our-stores/${blog?.id}`,
            lastModified: new Date() ,
            changeFrequency: 'daily',
            priority: 0.7,
        })) : [{
            url: '', lastModified: new Date(), changeFrequency: 'daily',
            priority: 0.7,
        }]

    const unPublishedBlogs = await getPosts(1, 10, false, true) 
    
        
    const unPublishedBlogsSitemap = unPublishedBlogs?.posts ? unPublishedBlogs?.posts?.map((blog:{id?:string}) => (
        {
            url: `${process.env.NEXT_PUBLIC_HOST}/our-stores/${blog?.id}`,
            lastModified: new Date() ,
            changeFrequency: 'daily',
            priority: 0.7,
        })) : [{
            url: '', lastModified: new Date(), changeFrequency: 'daily',
            priority: 0.7,
        }]

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
    
   
  ].concat(publishedBlogsSitemap, unPublishedBlogsSitemap)
}