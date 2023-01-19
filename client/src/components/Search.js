import {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import Avatar from "./Avatar";
import fetchData from "../utils/fetchData";

export default function Search() {
  const [users, setUsers] = useState([]);
  // useRef: 엘리먼트에 직접 접근할 때 사용한다
  const inputRef = useRef(null)

  console.log(users);

  function handleChange(e) {
    const username = e.target.value;

    // 김찬미님: 검색어가 없을 때 검색결과는 없다
    if (!username.trim()) {
      return setUsers([]);
    }

    fetchData(`${process.env.REACT_APP_SERVER}/search/?username=${username}`)
    .then(data => {
      setUsers(data)
    })
    .catch(error => {
      alert("Something's broken");
    })
  }

  // DOM이 리턴된 뒤에 엘리먼트에 접근할 수 있다
  // useEffect에 [], dep가 없으면 언제 실행될까요 ? 
  // 허성혁, 유현중 님: 컴포넌트가 실행 될때마다 effect가 실행된다
  useEffect(() => {
    // input에 focus를 한다
    inputRef.current.focus();
  },[])

  return (
    <div className="px-2">
      <div className="mb-4">
        <input
          type="text"
          className="border px-2 py-1 w-full"
          onChange={handleChange}
          placeholder="Search"
          ref={inputRef}
        />
      </div>

      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <Avatar user={user} />
          </li>
        ))}
      </ul>
    </div>
  )
}