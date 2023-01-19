import {Link} from "react-router-dom";

export default function NotFound() {
    return (
      <div className="p-4">
        <h1 className="text-2xl">페이지를 사용할 수 없습니다</h1>
        <div className="">
          <Link to="/">홈으로 돌아가기</Link>
        </div>
      </div>  
    )
  }