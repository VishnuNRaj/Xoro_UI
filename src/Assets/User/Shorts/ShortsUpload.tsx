import React, { SetStateAction, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, X, Plus } from "lucide-react";
import { Slider } from "@mui/material";
import useUploadShorts from "@/Hooks/User/Shorts/useShortsUpload";
import useSlider from "@/Hooks/User/useSlider";
import useCategory from "@/Hooks/useCategory";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

export default function ShortsUpload({ open, setOpen }: Props) {
  const {
    video,
    selectVideo,
    inputRef,
    data,
    handleChange,
    tags,
    handleContext,
    clear,
    handleUpload,
    setTagUsers,
    handleRemoveTags,
    loading,
  } = useUploadShorts();
  const {
    start,
    duration,
    handleSlide,
    end,
    valueText,
    trim,
    handleTrimVideo,
    setTrim,
    handleClear,
  } = useSlider({ video });
  const { category, handleSearchChange, search, emptySearch } = useCategory();

  const videoElement = useMemo(() => {
    if (trim) {
      return (
        <video
          controls
          className="w-full max-h-[300px] rounded-md object-cover"
        >
          <source src={URL.createObjectURL(trim)} type="video/mp4" />
        </video>
      );
    }
    return (
      <div
        onClick={() => inputRef.current?.click()}
        className="w-full h-full flex items-center dark:text-white justify-center"
      >
        <Button variant="ghost" size="icon">
          <Upload className="h-6 w-6" />
        </Button>
      </div>
    );
  }, [video, inputRef, trim]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md max-h-[500px] h-full bg-blue-light dark:bg-background dark:text-white">
        <DialogHeader className="flex items-center justify-center h-[40px]">
          <DialogTitle className="">Upload Shorts</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <ScrollArea className="max-h-[420px] h-full w-full pr-4">
            <div className="">
              <div className="flex flex-col gap-4">
                <div className="w-full border dark:border-white border-darken border-dashed rounded-md">
                  <input
                    ref={inputRef}
                    onChange={(e) => selectVideo(e, setTrim)}
                    type="file"
                    name="image"
                    accept="video/*"
                    className="hidden"
                  />
                  {videoElement}
                  {video && (
                    <div className="w-full p-3">
                      <h2 className="text-center font-semibold mb-2">
                        Trim Video
                      </h2>
                      <Slider
                        className="p-3 bg-blue-100"
                        getAriaLabel={() => "Temperature range"}
                        min={0}
                        max={duration || 2}
                        valueLabelFormat={valueText}
                        value={[start, end]}
                        onChange={handleSlide}
                        valueLabelDisplay="auto"
                        color="primary"
                      />
                      <div className="text-center mt-2">
                        <Button
                          onClick={handleTrimVideo}
                          className="bg-blue-700 hover:bg-blue-800 text-white"
                        >
                          Trim
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="gap-4 flex flex-col">
                  <Textarea
                    placeholder="Enter Caption..."
                    className="min-h-[100px] resize-none border-darken dark:border-white border"
                    value={data.Caption}
                    onChange={handleChange}
                    name="Caption"
                  />
                  <div className="relative">
                    <Input
                      type="text"
                      value={search.length > 0 ? search : data.Context}
                      placeholder="Content Type..."
                      name="Context"
                      className="border-darken dark:border-white border"
                      onChange={(e) => {
                        if (e.target.value.length === 0) {
                          handleChange(e);
                          handleSearchChange(e);
                        } else handleSearchChange(e);
                      }}
                    />
                    {category.length > 0 && (
                      <ScrollArea className="absolute w-full max-h-[150px] mt-1 border border-darken dark:border-white rounded-md z-50">
                        {category.map((value) => (
                          <Button
                            key={value.Name}
                            variant="ghost"
                            className="w-full justify-start hover:bg-blue-100 dark:hover:bg-blue-dark"
                            onClick={() => {
                              handleContext(value.Name);
                              emptySearch();
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
                      value={data.Tags}
                      placeholder="Set hashtags for Recommendation ..."
                      name="Tags"
                      onChange={handleChange}
                      className="border-darken dark:border-white border"
                    />
                    <Button
                      size="sm"
                      className="absolute right-1 top-1 text-white"
                      onClick={setTagUsers}
                      disabled={
                        !(
                          data.Tags.startsWith("#") &&
                          data.Tags[1] !== "#" &&
                          data.Tags.length > 2
                        )
                      }
                      variant="default"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <ScrollArea className="h-[100px] border rounded-md p-2">
                      {tags.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {tags.map((tag, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-blue-100 dark:bg-background rounded-md p-2"
                            >
                              <span className="truncate">#{tag}</span>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveTags(idx)}
                                className="text-white"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          Add Hashtags
                        </div>
                      )}
                    </ScrollArea>
                  )}
                </div>
              </div>
              <div className="flex justify-center space-x-2 mt-3">
                <Button
                  variant="default"
                  onClick={() => clear(handleClear)}
                  className="text-white bg-accent-dark hover:bg-accent-light"
                >
                  Clear
                </Button>
                <Button
                  onClick={() => trim && handleUpload(trim as File, setTrim)}
                  disabled={!trim}
                  className="text-white"
                  variant="default"
                >
                  Upload
                </Button>
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
