import React, { SetStateAction } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Camera } from 'lucide-react'
import Preloader from '@/Assets/Preloader'
import useEditChannel from '@/Hooks/User/Profile/useEditChannel'
import { toast } from 'sonner'

interface Props {
  open: boolean
  setOpen: React.Dispatch<SetStateAction<boolean>>
}

export default function EditChannel({ open, setOpen }: Props) {
  const {
    handleChange,
    handleCheckboxChange,
    handleFileChange,
    inputRef,
    category,
    setState,
    state,
    create,
    loadingProfile
  } = useEditChannel()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent style={{scrollbarWidth:"none"}} className="max-w-lg bg-blue-light max-h-[90%] overflow-y-scroll dark:text-white dark:bg-background text-foreground dark:text-foreground-dark">
        {loadingProfile && <Preloader />}
        <DialogHeader>
          <DialogTitle className="text-center dark:text-white">Edit Channel</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              <img
                className="rounded-full w-24 h-24 object-cover"
                src={state.Logo || 'https://images.pexels.com/photos/3377405/pexels-photo-3377405.jpeg?cs=srgb&dl=pexels-elina-araja-1743227-3377405.jpg&fm=jpg'}
                alt="Channel logo"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-0 text-white right-0 rounded-full"
                onClick={() => inputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input
                id="logo"
                type="file"
                ref={inputRef}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { files } = e.target
                  if (files && files[0].type.split('/')[0] !== 'image') return toast.error("Select an Image as Thumbnail")
                  if (files) {
                    handleFileChange(e)
                  }
                }}
                className="hidden"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="channelName" className='dark:text-white'>Channel Name</Label>
            <Input
              id="channelName"
              className='dark:text-white'
              value={state.Name}
              onChange={handleChange}
              name="Name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className='dark:text-white'>Description</Label>
            <Input
              id="description"
              value={state.Description}
              onChange={handleChange}
              className='dark:text-white'
              name="Description"
            />
          </div>
          {state.Type.length > 0 && (
            <div className="grid gap-2">
              <Label className='dark:text-white'>Contents</Label>
              <ScrollArea className="h-20 w-full rounded-md border">
                <div className="flex gap-2 p-4">
                  {state.Type.map((data, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 dark:text-white bg-secondary rounded-md p-1 px-2"
                    >
                      <span className="text-sm font-semibold">{data}</span>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6 text-sm font-semibold"
                        onClick={() => {
                          const arr = state.Type.filter((_val, idx) => idx !== index)
                          setState({ ...state, Type: arr })
                        }}
                      >
                        <X className="h-4 w-4 text-sm" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          <div className="grid gap-2">
            <Label className='dark:text-white'>What type of content do you upload?</Label>
            <ScrollArea className="h-[200px] dark:text-white w-full rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {category.map((data, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${index}`}
                      checked={state.Type.includes(data.Name)}
                      onCheckedChange={() => handleCheckboxChange(data.Name)}
                    />
                    <Label
                      htmlFor={`category-${index}`}
                      className="text-sm font-medium dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {data.Name}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <Button onClick={create}>Save Changes</Button>
      </DialogContent>
    </Dialog>
  )
}