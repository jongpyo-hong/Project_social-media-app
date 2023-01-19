import {useContext, useState, useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import AuthContext from "./AuthContext";
import Modal from "./Modal";
import Avatar from "./Avatar";
import fetchData from "../utils/fetchData";

export default function Comments() {
  const {articleId} = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [comments, setComments] = useState([]);

	console.log(comments);

  // 서버에 요청
  useEffect(() => {
    fetchData(`${process.env.REACT_APP_SERVER}/articles/${articleId}/comments`)
    .then(data => {
      setComments(data)
    })
    .catch(error => {
      setError(error)
    })
    .finally(() => setIsLoaded(true))
  }, [])
  
	// 댓글 등록
  function createComment(text, setText) {
    const formData = JSON.stringify({ content: text });

    fetch(`${process.env.REACT_APP_SERVER}/articles/${articleId}/comments`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: formData
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json()
    })
    .then(newComment => {
			// comments 업데이트
			const updatedComments = [newComment, ...comments];
      setComments(updatedComments) 
      // 박미현님: comment 폼을 비운다
			setText("") 
    })
    .catch(error => {
      alert("Something's broken")
    })
  }

  function deleteComment(commentId) {
    fetch(`${process.env.REACT_APP_SERVER}/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      const updatedComments = comments.filter(comment => comment._id !== commentId);
      setComments(updatedComments);
    })
    .catch(error => {
      alert("Something's broken");
    })
  }

  function unfavorite(commentId) {
    fetch(`${process.env.REACT_APP_SERVER}/comments/${commentId}/favorite`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      const editedCommentList = comments.map(comment => {
        if (commentId === comment._id) {
          return {...comment, isFavorite: false, favoriteCount: comment.favoriteCount - 1}
        }
        return comment;
      })
      setComments(editedCommentList);
    })
    .catch(error => {
      alert("Something's broken")
    })
  }

  function favorite(commentId) {
    fetch(`${process.env.REACT_APP_SERVER}/comments/${commentId}/favorite`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      const editedCommentList = comments.map(comment => {
        if (commentId === comment._id) {
          return {...comment, isFavorite: true, favoriteCount: comment.favoriteCount + 1}
        }
        return comment;
      })
      setComments(editedCommentList);
    })
    .catch(error => {
      alert("Something's broken")
    })
  }

  const commentList = comments.map(comment => (
    <Comment
      key={comment._id}
      comment={comment} 
      favorite={favorite}
      unfavorite={unfavorite}
      deleteComment={deleteComment} 
    />
  ))

  return (
    <div className="px-2">
      {/* 댓글 폼 */}
      <Form createComment={createComment} />

		  {/* 댓글 목록 */}
      <ul>
        {commentList} 
      </ul>

      {!isLoaded && <p>fetching comments...</p>}
      {error && <p>failed to fetch comments</p>}
    </div>  
  )
}

function Form({createComment}) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    createComment(text, setText);
  }

  function handleChange(e) {
    setText(e.target.value);
  }

  return(
    <form onSubmit={handleSubmit} className="mb-3">
      <textarea 
        rows="3"
        className="border w-full px-2 py-1"
        value={text} 
        onChange={handleChange} 
      />
      <button 
        type="submit" 
        className="px-2 border border-black disabled:opacity-[0.2]" 
        disabled={!text.trim()}
      >
        Submit
      </button>
    </form>  
  )
}
  
// 임성은님: comment는 하나의 댓글 객체
function Comment({comment, favorite, unfavorite, deleteComment}) {
  const auth = useContext(AuthContext);
  const isMaster = auth.user.username === comment.user.username;
  const created = new Date(comment.created).toLocaleDateString();

  function toggleFavorite() {
    if (comment.isFavorite) {
      unfavorite(comment._id)
    } else {
      favorite(comment._id)
    }
  }

  return (
    <li className="mb-4 border-b">
      <div className="flex justify-between items-center">
				{/* 아바타 */}
        <Avatar user={comment.user} />
        
				{/* 모달 */}
        {isMaster && (
          <Modal>
            <li className="border-b">
              <button
                className="w-full p-1"
                onClick={() => deleteComment(comment._id)}
              >
                Delete
              </button>
            </li>
          </Modal>
        )}
      </div>

			{/* 댓글 내용 */}
      <p className="mb-4">{comment.content}</p>
      
			{/* 좋아요 */}
      <div className="flex">
        <button onClick={toggleFavorite}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={"w-3 " + (comment.isFavorite ? "fill-red-500" : "fill-gray-200")}>
            <path d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z" />
          </svg>
        </button>
        <div className="ml-1 text-xs">{comment.favoriteCount} likes</div>
      </div>

      <small className="font-xs text-gray-400">{created}</small>
    </li>  
  )
}