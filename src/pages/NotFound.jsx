import NotFoundIllustration from "../assets/404_NotFound_illustration.svg";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md px-6">
        <img
          src={NotFoundIllustration}
          alt="404 illustration"
          className="w-72 mx-auto mb-6"
        />

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h1>

        <p className="text-gray-500 mb-6">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <a
          href="/"
          className="inline-block px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
