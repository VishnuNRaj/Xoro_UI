import React, { memo, useMemo } from 'react'
import useUploadVideo, { detailsProps } from '@/Hooks/User/Upload/useUploadVideo'
import useCategory from '@/Hooks/useCategory'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, X } from 'lucide-react'

const AddDetails = memo(({ Video, Thumbnail, setThumbnail }: detailsProps) => {
    const { Hashtags, data, videoRef, thumbRef, handleChange, clear, handleContext, setHashtags, setData, addThumbnail, upload, handleThumbnailButtonClick, user } = useUploadVideo({ Video, Thumbnail, setThumbnail })
    const { category, emptySearch, handleSearchChange, search } = useCategory()

    const videoMemo = useMemo(() => (
        <video
            crossOrigin="anonymous"
            src={URL.createObjectURL(Video)}
            className="rounded-lg w-full aspect-video h-full object-cover"
            controls={true}
            poster={data.Thumbnail}
            ref={videoRef}
        />
    ), [Video, data.Thumbnail])

    const thumbnailsMemo = useMemo(() => (
        <div className="grid grid-cols-2 gap-2">
            {Thumbnail.map((img, index) => (
                <div key={index} className="">
                    <img
                        crossOrigin="anonymous"
                        src={img}
                        onClick={() => setData((prev) => {
                            return { ...prev, Thumbnail: img }
                        })}
                        alt=""
                        className={`rounded-lg w-full aspect-video object-cover cursor-pointer ${data.Thumbnail === img ? 'ring-2 ring-primary' : ''}`}
                    />
                </div>
            ))}
            {Thumbnail.length < 4 && (
                <div className="border-2 border-dashed border-border rounded-lg flex justify-center items-center">
                    <input
                        type="file"
                        id="thumbnailInput"
                        className="hidden"
                        ref={thumbRef}
                        onChange={addThumbnail}
                        accept="image/*"
                    />
                    <Button variant="secondary" className='text-white' onClick={handleThumbnailButtonClick}>
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>
            )}
        </div>
    ), [Thumbnail, data.Thumbnail])

    return (
        <div className="container mx-auto px-2 font-semibold py-4">
            <div className="dark:bg-background bg-blue-light dark:text-white rounded-lg shadow-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:pr-2">
                        {videoMemo}
                    </div>
                    <div className="md:mt-0 mt-3">
                        {thumbnailsMemo}
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-4">
                        <div>
                            <Label className='ml-2' htmlFor="Caption">Caption</Label>
                            <Input id="Caption" placeholder="Caption" value={data.Caption} onChange={handleChange} name="Caption" />
                        </div>
                        <div>
                            <Label className='ml-2' htmlFor="Description">Description</Label>
                            <Input id="Description" placeholder="Description" value={data.Description} onChange={handleChange} name="Description" />
                        </div>
                        <div className="flex space-x-2">
                            <div className="flex-grow">
                                <Label className='ml-2' htmlFor="Hashtags">Hashtags</Label>
                                <Input id="Hashtags" placeholder="Hashtags" value={data.Hashtags} onChange={handleChange} name="Hashtags" />
                            </div>
                            <Button
                                onClick={() => {
                                    if (data.Hashtags.startsWith('#') && data.Hashtags.length > 2) {
                                        setHashtags([...Hashtags, data.Hashtags])
                                        setData({ ...data, Hashtags: '' })
                                    }
                                }}
                                disabled={!data.Hashtags.startsWith('#') || data.Hashtags.length <= 2}
                                className="mt-6"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {Hashtags.length > 0 && (
                            <ScrollArea className="h-24">
                                <div className="grid grid-cols-3 gap-2">
                                    {Hashtags.map((hashtag, i) => (
                                        <div key={i} className="bg-secondary text-secondary-foreground p-2 rounded-lg flex items-center justify-between">
                                            <p className="text-sm truncate">{hashtag}</p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setHashtags(Hashtags.filter((_, index) => index !== i))}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex ml-3 items-center space-x-2">
                                <Checkbox
                                    id="CommentsOn"
                                    checked={data.CommentsOn}
                                    onCheckedChange={() => setData({ ...data, CommentsOn: !data.CommentsOn })}
                                />
                                <Label className='ml-2' htmlFor="CommentsOn">Comments</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="ListedContent"
                                    checked={data.ListedContent}
                                    onCheckedChange={() => setData({ ...data, ListedContent: !data.ListedContent })}
                                />
                                <Label className='ml-2' htmlFor="ListedContent">Listed</Label>
                            </div>
                            {user && user.VIP && (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="PremiumContent"
                                        checked={data.PremiumContent}
                                        onCheckedChange={() => setData({ ...data, PremiumContent: !data.PremiumContent })}
                                    />
                                    <Label className='ml-2' htmlFor="PremiumContent">Premium</Label>
                                </div>
                            )}
                        </div>
                        <div>
                            <Label className='ml-2' htmlFor="RelatedTags">Type</Label>
                            <Input
                                id="RelatedTags"
                                placeholder="Type"
                                value={search.length > 0 ? search : data.RelatedTags}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value.length === 0) {
                                        handleSearchChange(e)
                                        handleChange(e)
                                    } else handleSearchChange(e)
                                }}
                                name="RelatedTags"
                            />
                            {category.length > 0 && (
                                <ScrollArea className="h-32 mt-2">
                                    <div className="space-y-1">
                                        {category.map((value, index) => (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                className="w-full justify-start"
                                                onClick={() => {
                                                    handleContext(value.Name)
                                                    emptySearch()
                                                }}
                                            >
                                                {value.Name}
                                            </Button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                        </div>
                        <div>
                            <Label className='ml-2' htmlFor="Restriction">Age Restriction</Label>
                            <Select onValueChange={(value) => setData({ ...data, Restriction: value })}>
                                <SelectTrigger id="Restriction">
                                    <SelectValue placeholder="Select age restriction" />
                                </SelectTrigger>
                                <SelectContent className='text-white'>
                                    <SelectItem className='' value="18">18+</SelectItem>
                                    <SelectItem value="16">16+</SelectItem>
                                    <SelectItem value="14">14+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-center gap-4'>
                    <div className="mt-6 flex justify-center">
                        <Button onClick={upload} className="bg-primary  text-white hover:bg-primary/90">Upload</Button>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <Button onClick={clear} className="bg-accent  text-white hover:bg-accent/90">Clear</Button>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default AddDetails