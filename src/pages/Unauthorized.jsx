import UnauthorizedIllustration from "../assets/403_Unauthorized_illustration.png";

export default function Unauthorized() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md px-6">
        <img
          src={UnauthorizedIllustration}
          alt="403 illustration"
          className="w-72 mx-auto mb-6"
        />

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Unauthorized Access
        </h1>

        <p className="text-gray-500 mb-6">
          You don’t have permission to access this page. Please contact your
          administrator if you believe this is a mistake.
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
