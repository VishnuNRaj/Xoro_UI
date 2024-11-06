import React, { SetStateAction } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Plus, X } from 'lucide-react'
import useCategory from '@/Hooks/useCategory'
import useStartLive, { CreateLive } from '@/Hooks/User/Stream/useStartLive'

interface CreateStreamProps {
  live: CreateLive
  setLive: React.Dispatch<SetStateAction<CreateLive>>
  state: boolean
  setState: React.Dispatch<SetStateAction<boolean>>
}

export default function CreateStream({ live, setLive, setState, state }:CreateStreamProps) {
  const { data, handleChange, inputRef, handleFile, handleRelated, handleSubmit, handleTagsRemove, setTagUsers } = useStartLive({ setLive })
  const { category, search, emptySearch, handleSearchChange } = useCategory()

  return (
    <Dialog open={live.Thumbnail && !state ? false : true} onOpenChange={() => setState(false)}>
      <DialogContent style={{scrollbarWidth:"none"}} className="sm:max-w-[425px] max-h-[600px] overflow-y-scroll bg-blue-light dark:bg-background dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-serif">Create Live</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div 
            onClick={() => inputRef.current?.click()} 
            className="w-full h-[220px] rounded-lg mt-2 hover:bg-blue-300 dark:hover:bg-blue-dark border-2 border-dashed border-darken dark:border-white flex items-center justify-center cursor-pointer"
          >
            {!data.Thumbnail ? (
              <div className="text-center">
                <input onChange={handleFile} ref={inputRef} type="file" hidden />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-semibold text-gray-900 dark:text-gray-300">Upload Thumbnail</span>
              </div>
            ) : (
              <img src={URL.createObjectURL(data.Thumbnail)} className="w-full h-full object-cover rounded-lg" alt="Thumbnail" />
            )}
          </div>

          <Input
            type="text"
            placeholder="Caption"
            name="Caption"
            onChange={handleChange}
            value={data.Caption}
          />

          <Textarea
            placeholder="Description"
            name="Description"
            onChange={handleChange}
            className="h-[100px] resize-none"
          />

          <div className="relative">
            <Input
              type="text"
              placeholder="Context"
              name="RelatedTags"
              onChange={(e) => {
                if (e.target.value.length === 0) {
                  handleChange(e)
                  handleSearchChange(e)
                } else handleSearchChange(e)
              }}
              value={search ? search : data.RelatedTags}
            />
            {category.length > 0 && (
              <ScrollArea className="absolute w-full mt-1 max-h-[150px] bg-white dark:bg-gray-700 rounded-md shadow-lg z-50">
                {category.map((value, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      handleRelated(value.Name)
                      emptySearch()
                    }}
                  >
                    {value.Name}
                  </Button>
                ))}
              </ScrollArea>
            )}
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="Set hashtags for recommendation ..."
              name="Tags"
              value={data.Tags}
              onChange={handleChange}
            />
            <Button
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={setTagUsers}
              disabled={!(data.Tags.startsWith("#") && data.Tags[1] !== "#" && data.Tags.length > 2)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[100px] w-full rounded-md border">
            <div className="p-4">
              {data.tags.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {data.tags.map((tag, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                      <span className="text-sm font-semibold">#{tag}</span>
                      <Button size="sm" variant="ghost" onClick={() => handleTagsRemove(idx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">Add Hashtags</p>
              )}
            </div>
          </ScrollArea>

          <Select name="Restriction" onValueChange={(value) => handleChange({ target: { name: 'Restriction', value } } as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select age restriction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="18">18+</SelectItem>
              <SelectItem value="16">16+</SelectItem>
              <SelectItem value="14">14+</SelectItem>
            </SelectContent>
          </Select>

          <Button className="w-full" onClick={handleSubmit}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

