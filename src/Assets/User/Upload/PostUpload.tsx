import React, { memo } from 'react'
import MediaMap from './MediaMap'
import Preloader from '@/Assets/Preloader'
import { useEssentials } from '@/Hooks/useEssentials'
import useUploadPost from '@/Hooks/User/Upload/useUploadPost'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, X } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface UploadProps {
    Media: File[]
    setMedia: React.Dispatch<React.SetStateAction<File[]>>
}

const Upload: React.FC<UploadProps> = memo(({ Media }) => {
    const { dispatch, navigate, post, profile } = useEssentials()
    const { loadingPost } = post
    const { loadingProfile, users } = profile

    const {
        Form,
        SetForm,
        hashTag,
        setHash,
        Tag,
        setTag,
        upload
    } = useUploadPost(Media, navigate, dispatch)

    return (
        <div className="container mx-auto">
            {loadingPost && <Preloader />}
            {Media.length > 0 && (
                <Card className="w-full mx-auto font-semibold text-sm bg-blue-light dark:text-white dark:bg-background">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="w-full lg:w-1/2">
                                <MediaMap Media={Media} />
                            </div>
                            <div className="w-full h-full lg:w-1/2 space-y-6">
                                <div className='space-y-2'>
                                    <Label htmlFor="Caption">Caption</Label>
                                    <Input
                                        id="Caption"
                                        name="Caption"
                                        placeholder="Enter Caption"
                                        value={Form.Caption}
                                        onChange={(e) => SetForm({ ...Form, Caption: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="comments"
                                            checked={Form.CommentsOn}
                                            onCheckedChange={() => SetForm({ ...Form, CommentsOn: !Form.CommentsOn })}
                                            className="data-[state=checked]:bg-secondary-light data-[state=unchecked]:bg-accent-light"
                                        />
                                        <Label htmlFor="comments">Comments</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="hidden"
                                            checked={Form.Hidden}
                                            onCheckedChange={() => SetForm({ ...Form, Hidden: !Form.Hidden })}
                                            className="data-[state=checked]:bg-secondary-light data-[state=unchecked]:bg-accent-light"
                                        />
                                        <Label htmlFor="hidden">Hidden</Label>
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor="Hashtags">Hashtags</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            id="Hashtags"
                                            name="Hashtags"
                                            placeholder="Enter Hashtags"
                                            value={Form.Hashtags}
                                            onChange={(e) => SetForm({ ...Form, Hashtags: e.target.value })}
                                        />
                                        <Button
                                            onClick={() => {
                                                const value = Form.Hashtags.trim().split('#')[1]
                                                if (value) {
                                                    setHash([...hashTag, value])
                                                    SetForm({ ...Form, Hashtags: '' })
                                                }
                                            }}
                                        >
                                            <Plus className="h-4 w-4 text-white" />
                                        </Button>
                                    </div>
                                </div>

                                {hashTag.length > 0 && (
                                    <ScrollArea className="h-20">
                                        <div className="grid lg:grid-cols-5 grid-cols-3 w-full gap-4">
                                            {hashTag.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="flex items-center justify-between w-full p-2 bg-secondary-light text-white dark:bg-blue-dark">
                                                    <span>#{tag}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-5 w-5 ml-1 rounded-full"
                                                        onClick={() => {
                                                            const updatedTags = [...hashTag]
                                                            updatedTags.splice(index, 1)
                                                            setHash(updatedTags)
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}

                                <div className='space-y-2 relative'>
                                    <Label htmlFor="Tags">Tags</Label>
                                    <Input
                                        id="Tags"
                                        name="Tags"
                                        placeholder="Enter Username"
                                        value={Form.Tags}
                                        onChange={(e) => SetForm({ ...Form, Tags: e.target.value })}
                                    />
                                    {users.length > 0 && Form.Tags && (
                                        <ScrollArea className="h-40 w-full mt-1 rounded-lg bg-white dark:bg-background">
                                            {loadingProfile ? (
                                                <div className='h-[80px]'>
                                                    <Preloader />
                                                </div>
                                            ) : (
                                                users.map((user, index) => (
                                                    <div
                                                        key={index}
                                                        className={`w-full p-2 text-foreground dark:text-foreground-dark border-b ${Tag.find((tag) => tag.Username === user.Username) ? 'opacity-70' : 'opacity-100 cursor-pointer'}`}
                                                        onClick={() => {
                                                            if (!Tag.find((tag) => tag.Username === user.Username)) {
                                                                setTag([...Tag, { Username: user.Username || '', Profile: user.Profile || '', _id: user._id }])
                                                                SetForm({ ...Form, Tags: '' })
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <Avatar>
                                                                <AvatarImage src={user.Profile} alt={user.Username} />
                                                                <AvatarFallback>{user.Username[0]}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-semibold">{user.Username}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </ScrollArea>
                                    )}
                                </div>

                                {Tag.length > 0 && (
                                    <ScrollArea className="h-20">
                                        <div className="flex flex-wrap gap-2">
                                            {Tag.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="flex items-center p-2 text-white dark:bg-blue-dark">
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={tag.Profile} alt={tag.Username} />
                                                            <AvatarFallback>{tag.Username[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <span>{tag.Username}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-5 w-5 ml-1 rounded-full"
                                                        onClick={() => {
                                                            setTag(Tag.filter((taged) => taged._id !== tag._id))
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}

                                <div className="flex space-x-2">
                                    <Button onClick={upload} className="flex-1">
                                        Upload
                                    </Button>
                                    <Button variant="default" className="flex-1 bg-accent-light hover:bg-accent">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
})

export default Upload