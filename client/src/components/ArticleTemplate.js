import {useState, useContext} from "react";
import {Link} from "react-router-dom";
import AuthContext from "./AuthContext";
import Carousel from "./Carousel";
import Modal from "./Modal";
import Avatar from "./Avatar";

export default function ArticleTemplate({article, favorite, unfavorite, deleteArticle}) {

  const auth = useContext(AuthContext);
  const isMaster = auth.user.username === article.user.username;
  const created = new Date(article.created).toLocaleDateString();

  function toggleFavorite() {

    if (article.isFavorite) { // 이미 좋아요를 누른 게시물
      // 좋아요 취소
      unfavorite(article._id)
    } else {
      // 좋아요
      favorite(article._id)
    }
  }

  return (
    <>
      <div className="px-2 mb-2 flex justify-between items-center">
        {/* Avatar */}
        <Avatar user={article.user} />

        {/* Modal */}
        {isMaster && (
          <Modal>
            <li className="border-b">
              <button 
                className="w-full p-1" 
                onClick={() => deleteArticle(article._id)}
                >
                  Delete
                </button>
            </li>
          </Modal>
        )}
      </div>

      {/* Carousel */}
      <div className="mb-4">
        <Carousel images={article.photos} />
      </div>

      <div className="px-2">

        {/* 좋아요 */}
        <div className="flex">
          <button
            type="button"
            onClick={toggleFavorite}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={"w-6 " + (article.isFavorite ? "fill-red-500" : "fill-gray-200")}>
              <path d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z" />
            </svg>
          </button>
          <div className="ml-1">{article.favoriteCount} likes</div>
        </div>

        <p className="mb-2">
          <span className="font-bold">{article.user.username}</span>
          {" "}
          {article.description}
        </p>

        <div className="text-gray-400">
          <Link to={`/article/${article._id}/comments`}>Comments</Link>
        </div>

        <small className="text-gray-400 text-xs">{created}</small>
      </div>
    </>  
  )
}