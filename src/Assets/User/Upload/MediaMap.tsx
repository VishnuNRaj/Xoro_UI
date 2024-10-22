import React, { memo, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"

interface MediaMapProps {
  Media: File[]
}

const MediaMap: React.FC<MediaMapProps> = memo(({ Media }) => {
  const [show, setShow] = useState<File>(Media[0])

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className='w-full md:w-2/3'>
        {Media.length > 0 && (
          <>
            {show.type.startsWith('image') ? (
              <img 
                crossOrigin="anonymous" 
                className="w-full max-h-[600px] min-h-[200px] h-full object-cover rounded-lg" 
                src={URL.createObjectURL(show)} 
                alt="" 
              />
            ) : (
              <video 
                crossOrigin="anonymous" 
                src={URL.createObjectURL(show)} 
                className='w-full max-h-[600px] h-full object-cover rounded-lg' 
                controls={false} 
                onMouseOver={(e) => e.currentTarget.controls = true} 
                onMouseOut={(e) => e.currentTarget.controls = false}
              ></video>
            )}
          </>
        )}
      </div>
      <ScrollArea className="w-full md:w-1/3 ">
        <div className="grid grid-cols-2 max-h-[600px] h-full md:grid-cols-1 gap-4">
          {Media.filter((img)=>img.name !== show.name).map((img: File) => (
            <div 
              key={URL.createObjectURL(img)} 
              className={`aspect-square bg-black rounded-lg cursor-pointer ${show.name === img.name ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setShow(img)}
            >
              {img.type.startsWith('image') ? (
                <img 
                  crossOrigin="anonymous" 
                  className="w-full h-full object-cover rounded-lg hover:opacity-80 transition-opacity" 
                  src={URL.createObjectURL(img)} 
                  alt="" 
                />
              ) : (
                <video 
                  crossOrigin="anonymous" 
                  src={URL.createObjectURL(img)} 
                  className='w-full h-full object-cover rounded-lg hover:opacity-80 transition-opacity' 
                  controls={false}
                ></video>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
})

export default MediaMap