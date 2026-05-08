import { Link, useNavigate, useRouteError } from "react-router-dom";
import { FaArrowLeft, FaHome, FaLeaf } from "react-icons/fa";
import { MdOutlineErrorOutline } from "react-icons/md";

const logo = "/photos/auth/brandLogo.svg";

const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();
  const status = error?.status || 404;
  const title =
    status === 404 ? "Page not found" : error?.statusText || "Something went wrong";

  return (
    <div className="min-h-screen overflow-hidden bg-gray-100 px-4 py-10 text-gray-800">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="relative w-full overflow-hidden rounded-xl border border-green-100 bg-white p-6 shadow-xl sm:p-10">
          <div className="absolute -right-12 -top-12 h-40 w-40 animate-pulse rounded-full bg-green-100" />
          <div className="absolute -bottom-16 -left-10 h-44 w-44 animate-pulse rounded-full bg-yellow-100" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <img src={logo} className="h-14 w-14" alt="KrishiGhar logo" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
                    KrishiGhar Admin
                  </p>
                  <h1 className="text-2xl font-bold">
                    <span className="text-green-600">Krishi</span>
                    <span className="text-yellow-500">Ghar</span>
                  </h1>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                <MdOutlineErrorOutline className="text-xl" />
                Error {status}
              </div>

              <h2 className="mt-5 text-4xl font-bold text-gray-900 sm:text-5xl">
                {title}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
                The page may have moved, the link may be old, or you may not have access to this admin area.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-green-300 hover:bg-green-50 cursor-pointer"
                >
                  <FaArrowLeft />
                  Go Back
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                >
                  <FaHome />
                  Home
                </Link>
              </div>
            </div>

            <div className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
              <div className="absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full border-2 border-dashed border-green-300" />
              <div className="absolute inset-8 animate-pulse rounded-full bg-green-50" />
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-lg">
                <FaLeaf className="animate-bounce text-6xl text-green-600" />
              </div>
              <span className="absolute left-4 top-10 h-4 w-4 animate-ping rounded-full bg-yellow-400" />
              <span className="absolute bottom-12 right-8 h-3 w-3 animate-ping rounded-full bg-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
