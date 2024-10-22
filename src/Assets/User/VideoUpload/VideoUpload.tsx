import useVideoUpload from '@/Hooks/User/Upload/useVideoUpload'
import AddDetails from './AddDetails'
import SelectVideo from './VideoSelect'

import Preloader from '@/Assets/Preloader'
export default function VideoUploadComponent() {
    const { Thumbnail, Video, setVideo, progress, setThumbnail } = useVideoUpload()
    return (
        <div>
            {progress && <Preloader />}
            {Thumbnail.length === 0 && <SelectVideo Video={Video} setVideo={setVideo} setThumbnail={setThumbnail} />}
            {Thumbnail.length > 0 && Video && <AddDetails Video={Video} Thumbnail={Thumbnail} setThumbnail={setThumbnail} />}
        </div>
    )
}

