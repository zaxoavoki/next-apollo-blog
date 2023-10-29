import { showNotification } from '@mantine/notifications';
import {
  GetPostDocument,
  Post,
  useGetPostLazyQuery,
  usePublishPostMutation,
  useToggleLikePostMutation,
} from 'generated/client';
import { useEffect } from 'react';
import { client } from 'web/lib/apollo';

export const usePublishPost = (postId: Post['id']) => {
  const [publishPost, { loading }] = usePublishPostMutation();

  const handlePublishClick = async () => {
    const { data, errors } = await publishPost({
      variables: {
        input: { id: postId },
      },
    });

    if (errors) {
      console.error(errors);
      showNotification({
        title: 'Something went wrong',
        message: errors[0].message,
        color: 'red',
      });
      return;
    }

    if (data?.publishPost) {
      showNotification({
        message: 'Post was successfully published',
        color: 'green',
      });
      await client.refetchQueries({
        include: [GetPostDocument],
      });
    }
  };

  return {
    handlePublishClick,
    isPublishing: loading,
  };
};

export const useToggleLikePost = (postId: Post['id']) => {
  const [toggleLikePost, { loading }] = useToggleLikePostMutation();

  const handleToggleLikePostClick = async () => {
    const { data, errors } = await toggleLikePost({
      variables: {
        input: { id: postId },
      },
    });

    if (errors) {
      console.error(errors);
      showNotification({
        title: 'Something went wrong',
        message: errors[0].message,
        color: 'red',
      });
      return;
    }

    if (data?.toggleLikePost) {
      await client.refetchQueries({
        include: [GetPostDocument],
      });
    }
  };

  return {
    handleToggleLikePostClick,
    isLiking: loading,
  };
};

export const useGetLazyPost = (postId: Post['id']) => {
  const [fetchPost, { data, loading, error }] = useGetPostLazyQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (postId) {
      fetchPost({
        variables: { input: { id: postId } },
      }).catch(console.error);
    }
  }, [postId, fetchPost]);

  return {
    post: data?.post,
    isFetchingPost: loading,
    errorFetchingPost: error,
  };
};
