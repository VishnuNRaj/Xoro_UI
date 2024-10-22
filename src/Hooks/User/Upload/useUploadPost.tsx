import { useState, useEffect } from 'react';
import { resetState } from '@/Store/UserStore/Authentication/AuthSlice';
import { addPost } from '@/Store/UserStore/Post-Management/PostSlice';
import { resetStateProfile, searchUsers } from '@/Store/UserStore/ProfileManagement/ProfileSlice';
import { NavigateFunction } from 'react-router-dom';
import { getCookie, useToast } from '@/Functions/Cookies';
import { AppDispatch } from '@/Store/Store';

export default function useUploadPost (Media: File[], navigate: NavigateFunction, dispatch: AppDispatch) {
  const [hashTag, setHash] = useState<string[]>([]);
  const [Tag, setTag] = useState<{
    Username: string;
    _id: string;
    Profile: string;
  }[]>([]);

  const [Form, SetForm] = useState<{
    Caption: string;
    Tags: string;
    Hashtags: string;
    CommentsOn: boolean;
    Hidden: boolean;
  }>({
    Caption: '',
    Tags: '',
    Hashtags: '',
    CommentsOn: true,
    Hidden: false,
  });

  const [error] = useState({
    Caption: '',
    Tags: '',
    Hashtags: ''
  });

  const searchUserData = async (search: string) => {
    const token = getCookie('token');
    if (token) {
      if (search.length > 0) {
        dispatch(searchUsers({ token, search })).then((state: any) => {
          if (state.payload.status === 202) {
            return navigate('/login');
          }
        });
      } else {
        return dispatch(resetStateProfile());
      }
    } else {
      return navigate('/login');
    }
  };

  useEffect(() => {
    const Tag = Form.Tags;
    if (Tag.length > 0) {
      searchUserData(Tag);
    }
  }, [Form.Tags]);

  const upload = () => {
    const { Caption, CommentsOn, Hidden } = Form;
    const token = getCookie('token');
    if (token) {
      dispatch(addPost({
        Caption,
        CommentsOn,
        Hidden,
        Tags: Tag.map((tag) => tag._id),
        Hashtags: hashTag,
        Images: Media,
        token
      })).then((state: any) => {
        if (state.payload.status === 202) {
          dispatch(resetState());
          navigate('/login');
        } else {
          useToast(state.payload.message, 'success');
          return state.payload.status === 200 ? navigate('/profile') : null;
        }
      });
    } else {
      dispatch(resetState());
      navigate('/login');
    }
  };

  return {
    Form,
    SetForm,
    hashTag,
    setHash,
    Tag,
    setTag,
    error,
    upload
  };
};
