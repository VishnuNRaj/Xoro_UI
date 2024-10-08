import useHooks from './Hooks';
import PostShowComponent from './PostShowComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
import ChatLoader from '@/Assets/ChatLoader';
import Preloader from '../../Preloader';
import { useEssentials } from '@/Hooks/useEssentials';

export default function Home() {
    const { auth } = useEssentials()
    const { post, noMore, skipping } = useHooks()
    const { loading } = auth;

    return (
        <>
            {loading && <Preloader gifSrc='/Logo.png' />}
            <div className='flex'>
                <div className='w-full flex p-1 md:pl-4'>
                    <div className='grid grid-cols-1 space-y-8 w-full md:w-2/5'>
                        {!noMore && post.length > 8 ? (
                            <InfiniteScroll hasMore={noMore} next={skipping} loader={<ChatLoader />} dataLength={post.length} >
                                {post && post.length > 0 && post?.map((item) => (
                                    <div key={item._id} ><PostShowComponent postData={item} /></div>
                                ))}
                            </InfiniteScroll>
                        ) : (
                            <>{post && post.length > 0 && post?.map((item) => (
                                <div key={item._id} ><PostShowComponent postData={item} /></div>
                            ))}</>
                        )}
                    </div>
                </div>
            </div>

        </>
    )
}

