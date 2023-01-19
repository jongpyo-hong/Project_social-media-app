import {useState, useEffect, useContext} from "react";
import {useParams, Link} from "react-router-dom";
import AuthContext from "./AuthContext";
import fetchData from "../utils/fetchData";

export default function Profile() {
  const {username} = useParams();

	console.log(username);

  return (
    <>
      <Details username={username} />
      <Timeline username={username} />
    </>  
  )
}

function Details({username}) {
  const [profile, setProfile] = useState(null);
  const auth = useContext(AuthContext);

  const isMaster = auth.user.username === username;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

	console.log(profile)

  useEffect(() => {
    setIsLoaded(false);

    fetchData(`${process.env.REACT_APP_SERVER}/profiles/${username}`)
    .then(data => {
			// profile 업데이트
      setProfile(data);
    })
    .catch(error => {
      setError(error)
    })
    .finally(() => setIsLoaded(true))
  }, [username])

  function follow() {
    fetch(`${process.env.REACT_APP_SERVER}/profiles/${profile.username}/follow`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      // profile 업데이트
      const editedProfile = {...profile, isFollowing: true}
      setProfile(editedProfile);
    })
    .catch(error => {
      alert("Something's broken")
    })
  } 

  function unfollow() {
    fetch(`${process.env.REACT_APP_SERVER}/profiles/${profile.username}/follow`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      // profile 업데이트
      const editedProfile = {...profile, isFollowing: false}
      setProfile(editedProfile);
    })
    .catch(error => {
      alert("Something's broken")
    })
  }

  if (error) {
    return <p>failed to fetch profile</p>
  }
  if (!isLoaded) {
    return <p>fetching profile...</p>
  }
  return (
    <>
      <div className="mb-4 px-2">
        {/* 프로필 정보, 정보수정/로그아웃 버튼 */}
        <div className="flex items-center flex-col">
          <img 
            src={`${process.env.REACT_APP_SERVER}/data/users/${profile.image || "avatar.jpeg"}`} 
            className="w-36 h-36 object-cover rounded-full"
          />
          <h3 className="font-bold">{profile.username}</h3>
          <p className="">{profile.bio}</p>
          {isMaster && (
            <div className="">
              <Link to="/accounts/edit" className="text-xs text-gray-400">
                Edit profile
              </Link> {" "}
              <button className="text-xs text-red-500" onClick={auth.signOut}>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* 팔로우 버튼 */}
        {!isMaster && (
          <button 
            className={
              "mt-2 border p-1 w-full " + (
                profile.isFollowing ? "border-black before:content-['Following']" 
                : "border-blue-500 text-blue-500 before:content-['Follow']"
              )
            }
            onClick={profile.isFollowing ? unfollow : follow}
          >
          </button>
        )}
      </div>

      {/* 팔로워, 팔로잉, 게시물 개수 */}
      <div className="mb-4">
        <ul className="flex border-y">
          <li className="flex flex-col items-center w-1/3">
            <div>Follower</div>
            <Link to={`/profile/${username}/followers`}>
              {profile.followersCount}
            </Link>
          </li>
          <li className="flex flex-col items-center w-1/3">
            <div>
              Following
            </div>
            <Link to={`/profile/${username}/following`}>
              {profile.followingCount}
            </Link>
          </li>
          <li className="flex flex-col items-center w-1/3">
            <div>
              Articles
            </div>
            <div>
              {profile.articlesCount}
            </div>
          </li>
        </ul>
      </div>
    </>  
  )
}

function Timeline({username}) {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);

    fetchData(`${process.env.REACT_APP_SERVER}/profiles/${username}/articles`)
    .then(data => {
      setArticles(data)
    })
    .catch(error => {
      setError(error)
    })
    .finally(() => setIsLoaded(true))
  }, [username])

  const articleList = articles.map(article => (
    <li key={article._id} className="h-40">
      <Link key={article._id} to={`/article/${article._id}`}>
        <img
          src={`${process.env.REACT_APP_SERVER}/data/articles/${article.photos[0]}`}
          className="w-full h-full object-cover"
        />
      </Link>
    </li>
  ))

  return (
    <>
      <ul className="grid grid-cols-3 gap-1 mb-2">
        {articleList}
      </ul>

      {!isLoaded && <p>fetching timeline...</p>}
      {error && <p>failed to fetch timeline</p>}
    </>  
  )
}