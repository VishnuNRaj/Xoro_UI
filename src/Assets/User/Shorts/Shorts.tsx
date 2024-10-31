import { useState, useCallback } from 'react';
import { Toaster } from 'sonner';
// import ShortsUpload from './ShortsUpload';
import ShortsPlayer from './ShortsPlayer';
import useWindowDimensions from '@/Hooks/useWindowDimesions';
import useShortsData from '@/Hooks/User/Shorts/useShortsData';
// import CommentComponent from '@/Assets/Components/Comments';

export default function ShortsComponent () {
  const [_open, setOpen] = useState(false);
  const { shorts, video, getMoreShorts, id } = useShortsData();
  const { width } = useWindowDimensions();

  const handleOpenUpload = useCallback(() => setOpen(true), []);

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster richColors closeButton position="top-right" />
      
      {/* {open && <ShortsUpload open={open} setOpen={setOpen} />} */}
      
      <div className="fixed right-5 top-20 z-10">
        <button
          onClick={handleOpenUpload}
          className="flex items-center justify-center gap-2 rounded-full bg-blue-600 p-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <i className="fa fa-upload" />
          <span className="hidden sm:inline">Upload Shorts</span>
        </button>
      </div>

      {shorts.length === 0 ? (
        <div className="flex h-[calc(100vh-80px)] items-center justify-center">
          <div
            onClick={handleOpenUpload}
            className="flex h-96 w-96 animate-pulse cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-200 text-gray-600 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <i className="fa fa-upload mb-4 text-6xl" />
            <h1 className="text-2xl font-semibold">Upload Shorts</h1>
            <p className="mt-2 text-sm">No Shorts Uploaded Yet</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-center pt-20 lg:flex-row lg:items-start lg:justify-between">
          <ShortsPlayer video={video} shorts={shorts} id={id} getMoreShorts={getMoreShorts} />
          
          {width >= 1024 && video && (
            <div className="mt-4 w-full max-w-md rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 lg:mt-0 lg:w-1/3">
              {/* <CommentComponent PostId={video._id} /> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

