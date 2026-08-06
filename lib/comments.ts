export interface Comment {
  id: string;
  postId: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

const comments: Comment[] = [];

export function addComment(
  data: Omit<Comment, 'id' | 'createdAt'>
) {
  const item: Comment = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...data,
  };

  comments.unshift(item);

  return item;
}

export function getComments() {
  return comments;
}

export function getCommentsByPostId(postId: string) {
  return comments.filter(
    (comment) => comment.postId === postId
  );
}