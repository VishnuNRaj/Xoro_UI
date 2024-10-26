import React, { SetStateAction, useEffect, useState } from 'react';
import { Comments } from '@/Store/UserStore/CommonManagements/interfaces';
import { User } from '@/Store/UserStore/Authentication/Interfaces';
import { useEssentials } from '@/Hooks/useEssentials';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useComments } from '@/Hooks/User/useComments';

interface Props {
    setComments: React.Dispatch<SetStateAction<Comments[]>>;
    comments: Comments[];
    PostId: string;
    live?: any
}

const CommentList: React.FC<{ tags: User[]; value: string[] }> = ({ tags, value }) => {
    const [values, setValues] = useState<string[]>([]);
    const { navigate } = useEssentials()

    useEffect(() => {
        const updatedValues = [...value];

        updatedValues.forEach((data, idx, arr) => {
            if (idx > 0 && arr[idx - 1] === "@") {
                const response = tags.find((tag) => tag._id === data);
                if (response) {
                    arr[idx] = "@" + response.Username;
                    arr[idx - 1] = "";
                }
            }
        });
        setValues(updatedValues)
    }, []);

    return (
        <>
            <span key={Math.random()}>{values.map((cmt) => (
                <span onClick={() => {
                    const response = tags.find((tag) => "@" + tag.Username === cmt)
                    if (response) {
                        navigate(`/profile/${response.ProfileLink}`)
                    }
                }} className={` ${tags.find((tag) => "@" + tag.Username === cmt) ? "text-blue-700 cursor-pointer" : "text-white"} font-semibold text-sm`} >{cmt} </span>
            ))}</span>
        </>
    );
};


const Comment: React.FC<{ comment: Comments }> = ({ comment }) => {
    const { navigate } = useEssentials();
    const [hover, setHover] = useState(false);
    const [menu, setMenu] = useState(false);

    return (
        <div
            className='flex items-center relative'
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
        >
            <div className='flex items-center'>
                <div className='w-8 rounded-full h-8 bg-gray-600 flex-shrink-0'>
                    <Avatar>
                        <AvatarImage
                            src={comment.user.Profile}
                            onClick={() => navigate(`/profile/${comment.user.ProfileLink}`)}
                            className='rounded-full cursor-pointer w-8 h-8 object-contain'
                            alt="" />
                    </Avatar>
                </div>
                <div className='bg-gray-900 p-1 min-w-[250px] px-2 ml-2 rounded-md relative'>
                    <p className='text-[10px] text-white font-semibold'>@{comment.user.Username}</p>
                    <p><CommentList tags={comment.tags} value={comment.Comment} /></p>
                </div>
            </div>
            {hover && (
                <div className='flex justify-end ml-8 w-full'>

                    <button
                        className='rounded-full w-8 h-8 aspect-square bg-white border-black border-2'
                        onClick={() => setMenu(!menu)}
                    >
                        <i className='fa fa-gear text-lg'></i>
                    </button>
                </div>
            )}
        </div>
    );
}


const CommentComponent: React.FC<Props> = ({ PostId, live }) => {
    const { text, addComment, users, addTag, upload, comments, setComments } = useComments({ PostId, live });
    return (
        <div className='p-2'>
            <div className='relative w-full'>
                <div className='w-full bg-blue-200 dark:bg-blue-dark rounded-md h-[380px]' style={{ overflowY: "auto", scrollbarWidth: "none" }}>
                    {users ? (
                        <div style={{ overflowX: "scroll", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }} className='grid grid-cols-1 p-2 rounded-md'>
                            {users.length > 0 ? users.map((usr) => (
                                <div className='w-full h-12 p-2 gap-2 flex items-center justify-center rounded-sm bg-blue-light' key={usr._id}>
                                    <div onClick={() => addTag(usr.Username, usr._id)} className='flex items-center px-4 rounded-md hover:bg-blue-300  justify-between w-full h-10 '>
                                        <div className='h-8 w-8'>
                                            <img crossOrigin="anonymous" src={usr.Profile} className='w-8 h-8 rounded-full' alt="" />
                                        </div>
                                        <div className='flex ml-3'>
                                            <h1 className='text-gray-900 font-semibold text-lg'>{usr.Username}</h1>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <>Tag Users</>
                            )}
                        </div>
                    ) : (
                        <>
                            {comments.length > 0 ? comments.map((comment, idx) => (
                                <div className='w-full flex flex-col-1 relative' key={idx}>
                                    <div className='p-2 w-[95%] flex items-center'>
                                        <div className='w-[90%] rounded-md block'>
                                            <div className='text-sm items-center flex w-full justify-between text-gray-900'>
                                                <Comment comment={comment} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <>
                                    <div className='h-full flex w-full items-center justify-center'>
                                        <h1 className='text-gray-600 shadow-sm text-sm font-semibold'>No Comments Yet</h1>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className='py-2'>
                <div className='flex flex-row justify-between gap-1 h-12'>
                    <div className='w-full'>
                        <textarea onKeyDown={async (e) => {
                            if (e.code === "Enter") {
                                const response: any = await upload(PostId);
                                console.log(response)
                                if (response) setComments([...comments, response]);
                            }
                        }} value={text} onChange={addComment} rows={2} style={{ overflowY: "auto", scrollbarWidth: "none" }} className='resize-none p-3 text-background bg-blue-light dark:bg-background font-semibold w-full h-12 border-2 border-gray-700 rounded-md'></textarea>
                    </div>
                    <div className='w-12 h-12'>
                        <button onClick={async () => {
                            const response: any = await upload(PostId);
                            console.log(response)
                            if (response) setComments([...comments, response]);
                        }} className='w-12 h-12 p-3 text-white bg-blue-700 cursor-pointer rounded-md flex justify-center items-center'>
                            <svg fill="#fff" viewBox="0 0 48 48"><path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentComponent;
