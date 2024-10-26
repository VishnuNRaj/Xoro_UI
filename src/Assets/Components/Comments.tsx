import React, { SetStateAction, useEffect, useState } from 'react';
import { Comments } from '@/Store/UserStore/CommonManagements/interfaces';
import { User } from '@/Store/UserStore/Authentication/Interfaces';
import { useEssentials } from '@/Hooks/useEssentials';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useComments } from '@/Hooks/User/useComments';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreHorizontal, Send } from "lucide-react"

interface Props {
    setComments: React.Dispatch<SetStateAction<Comments[]>>;
    comments: Comments[];
    PostId: string;
    live?: any
}

export function CommentList ({ tags, value }:{ tags: User[]; value: string[] }) {
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
    }, [value, tags]);

    return (
        <span>
            {values.map((cmt, index) => (
                <span
                    key={index}
                    onClick={() => {
                        const response = tags.find((tag) => "@" + tag.Username === cmt)
                        if (response) {
                            navigate(`/profile/${response.ProfileLink}`)
                        }
                    }}
                    className={`${tags.find((tag) => "@" + tag.Username === cmt) ? "text-blue-500 cursor-pointer" : "text-foreground"} text-sm`}
                >
                    {cmt}{' '}
                </span>
            ))}
        </span>
    );
};

export function Comment ({ comment }:{ comment: Comments }) {
    const { navigate } = useEssentials();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className='flex items-start space-x-2 group'>
            <Avatar className="w-8 h-8 cursor-pointer" onClick={() => navigate(`/profile/${comment.user.ProfileLink}`)}>
                <AvatarImage src={comment.user.Profile} alt={comment.user.Username} />
            </Avatar>
            <div className='flex-grow'>
                <div className='flex items-center'>
                    <span className='font-semibold text-sm text-foreground mr-2'>{comment.user.Username}</span>
                    <span className='text-xs text-muted-foreground'></span>
                </div>
                <p className='text-sm text-foreground mt-1'>
                    <CommentList tags={comment.tags} value={comment.Comment} />
                </p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setShowMenu(!showMenu)}
            >
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </div>
    );
}

export default function CommentComponent ({ PostId, live }:Props) {
    const { text, addComment, users, addTag, upload, comments, setComments } = useComments({ PostId, live });

    const handleSubmit = async () => {
        const response: any = await upload(PostId);
        if (response) setComments([...comments, response]);
    };

    return (
        <div className='flex flex-col h-full dark:text-white'>
            <ScrollArea className="flex-grow">
                {users ? (
                    <div className='grid grid-cols-1 gap-2 p-2'>
                        {users.length > 0 ? users.map((usr) => (
                            <div
                                key={usr._id}
                                className='flex items-center space-x-2 p-2 hover:bg-blue-100 dark:hover:bg-blue-dark rounded-md cursor-pointer'
                                onClick={() => addTag(usr.Username, usr._id)}
                            >
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={usr.Profile} alt={usr.Username} />
                                </Avatar>
                                <span className='font-semibold'>{usr.Username}</span>
                            </div>
                        )) : (
                            <div className='text-center text-muted-foreground'>Tag Users</div>
                        )}
                    </div>
                ) : (
                    <div className='space-y-4 p-4'>
                        {comments.length > 0 ? comments.map((comment, idx) => (
                            <Comment key={idx} comment={comment} />
                        )) : (
                            <div className='text-center text-muted-foreground'>No Comments Yet</div>
                        )}
                    </div>
                )}
            </ScrollArea>
            <div className='p-4 border-t dark:border-white border-black'>
                <div className='flex items-center space-x-2'>
                    <Input
                        value={text}
                        onChange={addComment}
                        onKeyDown={async (e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                await handleSubmit();
                            }
                        }}
                        placeholder="Add a comment..."
                        className="flex-grow dark:border-white border-black"
                    />
                    <Button onClick={handleSubmit} size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

