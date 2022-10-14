import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PopularPosts } from '../components/PopularPosts'
import { PostItem } from '../components/PostItem'
import { getAllPosts } from '../redux/features/post/postSlice'
// import { getPostCategories } from '../redux/features/category/categorySlice'
import {Pagination} from '../components/Pagination'


export const MainPage = () => {
    const dispatch = useDispatch()
    const { posts, popularPosts } = useSelector((state) => state.post)
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(5)


    useEffect(() => {
        dispatch(getAllPosts())
    }, [dispatch])

    if (!posts.length) {
        return (
            <div className='text-xl text-center text-white py-10'>
                None posts.
            </div>
        )
    }

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <div className='max-w-[900px] mx-auto py-10'>
            <div className='flex justify-between gap-8'>
                <div className='flex flex-col gap-10 basis-4/5'>
                    {currentPosts?.map((post, idx) => (
                        <PostItem key={idx} post={post}/>
                    ))}
                </div>
                <div className='basis-1/5'>
                    <div className='text-xs uppercase text-white'>
                        Famous:
                    </div>

                    {popularPosts?.map((post, idx) => (
                        <PopularPosts key={idx} post={post} />
                    ))}
                </div>
            </div>
            <div className='max-w-[900px] mx-auto py-10'>
                <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
            </div>
        </div>
    )
}