import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    AiFillEye,
    AiTwotoneEdit,
    AiFillDelete,
    AiFillLike,
    AiOutlineMinusCircle
} from 'react-icons/ai'
import Moment from 'react-moment'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from '../utils/axios'
import { removePost, createLike_Dislike, deleteLike_Dislike } from '../redux/features/post/postSlice'
import { getPostCategories } from '../redux/features/category/categorySlice'
import {
    createComment,
    getPostComments
} from '../redux/features/comment/commentSlice'
import { CommentItem } from '../components/CommentItem'
import { updatePost } from '../redux/features/post/postSlice'
import { CategoryItem } from '../components/CategoryItem'
import '../like_dislike.css'

export const PostPage = () => {
    const [post, setPost] = useState(null)
    const [comment, setComment] = useState('')
    let [type, setLike] = useState('')
    const [users, setUser] = useState([])
    const { userID } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.auth)
    const { categories } = useSelector((state) => state.category)
    const { comments } = useSelector((state) => state.comment)
    const [checked, setChecked] = useState(false)
    const [checkedDislike, setCheckedDislike] = useState(false)
    const [status, setStatus] = useState('')

    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()


    const submitHandler = () => {
        try {
            const id = params.id
            let formData = new FormData()
            formData.append('id', id)
            if (post.status === 'active')
                formData.append('status', 'inactive')
            if (post.status === 'inactive')
                formData.append('status', 'active')
            dispatch(updatePost(formData))
            navigate('/main')
        } catch (error) {
            console.log(error)
        }
    }

    const removePostHandler = () => {
        try {
            dispatch(removePost(params.id))
            toast('Post was deleted')
            navigate('/main')
        } catch (error) {
            console.log(error)
        }
    }

    const fetchAllUser = useCallback(async () => {
        const { data } = await axios.get(`/users`)
        setUser(data)
    }, [])

    const handleSubmit = () => {
        try {
            const postId = params.id
            dispatch(createComment({ postId, comment }))
            setComment('')
        } catch (error) {
            console.log(error)
        }
    }

    const fetchComments = useCallback(async () => {
        try {
            dispatch(getPostComments(params.id))
        } catch (error) {
            console.log(error)
        }
    }, [params.id, dispatch])


    const fetchCategories = useCallback(async () => {
        try {
            dispatch(getPostCategories(params.id))
        } catch (error) {
            console.log(error)
        }
    }, [params.id, dispatch])


    const fetchPost = useCallback(async () => {
        const { data } = await axios.get(`/posts/${params.id}`)
        setPost(data)
    }, [params.id])

    const fetchLikes = async () => {
        const { data } = await axios.get(`/posts/${params.id}/like`)
        checkLike(data)
    }

    
    function onLoad (){
        if(!window.location.hash){
            // window.location=window.location+'#loaded'
            fetchLikes()
        }
    }

    useEffect(() => {
        fetchAllUser()
        onLoad()
    }, [fetchAllUser])

    useEffect(() => {
        fetchPost()
    }, [fetchPost])

    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const checkLike = (data) => {
        const authorr = []
        let types = ''
        data?.map((like) => {
            authorr.push(like.author)
            types = like.type
            return true
        })
        for (let i = 0; i < authorr.length; i++) {
            if (data.length > 0 && types === 'like' && authorr[i] === userID) {
                setChecked(!checked)
                setLike('islike')
            } else if (data.length > 0 && types === 'dislike' && authorr[i] === userID) {
                setCheckedDislike(!checked)
                setLike('islike')
            }
        }
    }


    const likeHandler = () => {
        try {
            const postId = params.id
            if (type !== 'islike') {
                if (type === 'like' || type === 'dislike') {
                    dispatch(createLike_Dislike({ postId, type }))
                    window.location.reload()
                    return 
                }
                else if (type === 'deletelike' || type === 'deletedislike') {
                    dispatch(deleteLike_Dislike({ postId }))
                    window.location.reload()
                    return 
                }
            }
        } catch (error) {
            console.log(error)
        }
    }


    if (!post || !user) {
        return (
            <div className='text-xl text-center text-white py-10'>
                Loading...
            </div>
        )
    }

    const author = () => {
        const userArr = []
        users.users?.map((author, idx) => {
            return userArr.push(author)
        })
        for (let i = 0; i < userArr.length; i++) {
            if (post.author === userArr[i]._id) {
                return userArr[i].username
            }
        }
    }

    const admin = () => {
        if (user?.role === 'admin') {
            return(
                <div className='flex gap-3 mt-4'>
                    <button className='flex items-center justify-center gap-2 text-white opacity-50 pr-4' onClick={submitHandler}>
                        <AiOutlineMinusCircle/>
                    </button>
                </div>
            )
        }
    }


    return (
        <div>
            <button className='flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4'>
                <Link className='flex' to={'/'}>
                    Back
                </Link>
            </button>

            <div className='flex gap-10 py-8'>
                <div className='w-full'>
                    <div className='flex flex-col basis-1/4 flex-grow'>
                        <div
                            className={
                                post?.imgUrl
                                    ? 'flex rounded-sm h-2/4 w-2/4'
                                    : 'flex rounded-sm'
                            }
                        >
                            {post?.imgUrl && (
                                <img
                                    src={`http://localhost:3002/${post.imgUrl}`}
                                    alt='img'
                                    className='object-cover w-full'
                                />
                            )}
                        </div>
                    </div>

                    <div className='flex justify-between items-center pt-2'>
                        <div className='text-sm text-white opacity-19'>
                            {author()}
                        </div>
                        <div className='text-xs text-white opacity-50'>
                            <Moment date={post.createdAt} format='D MMM YYYY' />
                        </div>
                    </div>
                    <div className='flex justify-between items-center pt-2'>
                         <div className='text-white text-xl'>{post.title}</div>
                         <div className='text-xs text-white opacity-50'>{post.status}</div>
                    </div>
                    
                    <p className='text-white opacity-60 text-xs pt-4'>
                        {post.text}
                    </p>

                    <div className='flex gap-3 items-center mt-2 justify-between'>
                        <div className='flex gap-3 mt-4'>
                            <button className='flex items-center justify-center gap-2 text-xs text-white opacity-50'>
                                <AiFillEye /> <span>{post.views}</span>
                            </button>
                            <button className='flex items-center justify-center gap-2 text-xs text-white opacity-50'>
                                <AiFillLike />{' '}
                                <span>{post.likes || 0} </span>
                            </button>
                        </div>

                        <div className='inline-flex'>
                            {categories?.map((category) => (
                                <CategoryItem key={category._id} category={category} />
                            ))}
                        </div> 
                        <div className='inline-flex'>
                                {admin()}
                        {user?._id === post.author && (
                                <div className='flex gap-3 mt-4'>
                                    <button className='flex items-center justify-center gap-2 text-white opacity-50'>
                                        <Link to={`/${params.id}/edit`}>
                                            <AiTwotoneEdit />
                                        </Link>
                                    </button>
                                    <button
                                        onClick={removePostHandler}
                                        className='pl-2 flex items-center justify-center gap-2  text-white opacity-50'
                                    >
                                        <AiFillDelete />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='inline-flex text-white opacity-50 mt-4'>
                        <div className="container">
                            <ul className="ks-cboxtags">
                                <li className='pr-4'>
                                    <input
                                        id={1}
                                        type='checkbox'
                                        checked={checked}
                                        onChange={function () {
                                            setChecked(!checked)
                                            setCheckedDislike(false)
                                            if (!checked) {
                                                setLike('like')
                                            } else if (checked)
                                                setLike('deletelike')
                                        }}
                                        className='like'
                                    /><label className='like' htmlFor={1}>like</label>
                                </li>
                                <li>
                                    <input
                                        id={2}
                                        type='checkbox'
                                        checked={checkedDislike}
                                        onChange={function () {
                                            setCheckedDislike(!checkedDislike)
                                            setChecked(false)
                                            if (!checkedDislike) {
                                                setLike('dislike')
                                            } else if (checkedDislike)
                                                setLike('deletedislike')
                                        }}
                                        className='dislike'
                                    />
                                    <label className='dislike' htmlFor={2}>dislike</label>
                                </li>
                            </ul>
                        </div>
                        {likeHandler()}
                    </div>
                    <div className='w-full p-8 bg-gray-700 flex flex-col gap-2 rounded-sm'>
                    <form
                        className='flex gap-2'
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type='text'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder='Comment'
                            className='text-black w-full rounded-sm bg-gray-400 border p-2 text-xs outline-none placeholder:text-gray-700'
                        />
                        <button
                            type='submit'
                            onClick={handleSubmit}
                            className='flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4'
                        >
                            Sent
                        </button>
                    </form>
                    <div>
                        {comments?.map((cmt) => (
                            <CommentItem key={cmt._id} cmt={cmt} />
                        ))}
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}
