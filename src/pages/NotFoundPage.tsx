import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="text-center py-12 space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-xl">ページが見つかりませんでした</p>
      <div>
        <Link
          to="/"
          className="px-6 py-2 inline-block text-gray-900 bg-slate-400
              hover:bg-slate-600 hover:text-white  rounded-md transition-colors"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
