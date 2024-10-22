import PostShowComponent from './PostShowComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
import ChatLoader from '@/Assets/ChatLoader';
import Preloader from '../../Preloader';
import { useEssentials } from '@/Hooks/useEssentials';
import usePosts from '@/Hooks/User/Home/usePosts';

export default function HomeComponent() {
    const { auth } = useEssentials()
    const { post, noMore, skipping } = usePosts()
    const { loading } = auth;

    return (
        <>
            {loading && <Preloader />}
            {post.length === 0 && <Preloader />}
            <div className='flex'>
                <div className='w-full flex px-4'>
                    <div className='flex flex-col gap-8 w-full'>
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

