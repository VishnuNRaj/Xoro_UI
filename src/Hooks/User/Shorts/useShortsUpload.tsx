import { getCookie } from "@/Functions/Cookies";
import { useEssentials } from "@/Hooks/useEssentials";
import { uploadShorts } from "@/Store/UserStore/Shorts-Management/shortSlice";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function useUploadShorts() {
  const [video, setVideo] = useState<File | null>(null);
  const { dispatch, navigate, shorts } = useEssentials();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<{
    Caption: string;
    Tags: string;
    Context: string;
  }>({
    Caption: "",
    Tags: "",
    Context: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const clear = (trim: any) => {
    setData({ Caption: "", Context: "", Tags: "" });
    setTags([]);
    setVideo(null);
    setSearch("");
    trim(null);
  };

  const selectVideo = (
    e: React.ChangeEvent<HTMLInputElement>,
    setTrim: any
  ) => {
    const { files } = e.target;
    if (files && files.length > 0 && files[0].type.startsWith("video/")) {
      setVideo(files[0]);
      setTrim(files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const setTagUsers = () => {
    if (
      !data.Tags.startsWith("#") ||
      data.Tags.length < 2 ||
      data.Tags[1] === "#"
    )
      return;
    const tag = data.Tags.split("#")[1];
    setTags([...tags, tag]);
    setData({ ...data, Tags: "" });
  };

  const handleContext = (name: string) => {
    setData({ ...data, Context: name });
  };

  const handleUpload = (trim: File, set: any) => {
    if (!trim) return toast.error("Select a Video To Upload");
    const token: string | undefined = getCookie("token");
    if (token) {
      dispatch(
        uploadShorts({
          Caption: data.Caption,
          Context: data.Context,
          CommentsOn: true,
          Private: false,
          Shorts: trim,
          Hashtags: tags,
          token,
        })
      ).then(({ payload }: any) => {
        if (payload.status === 202) return navigate("/login");
        toast[payload.status === 200 ? "success" : "error"](payload.message);
        payload.status === 200 && clear(set);
      });
    }
  };

  const handleRemoveTags = (i: number) => {
    setTags([...tags].filter((_val, idx) => idx !== i));
  };

  return {
    video,
    selectVideo,
    clear,
    data,
    inputRef,
    handleChange,
    handleContext,
    setTagUsers,
    handleUpload,
    search,
    setSearch,
    tags,
    handleRemoveTags,
    loading: shorts.loadingShorts,
  };
}
