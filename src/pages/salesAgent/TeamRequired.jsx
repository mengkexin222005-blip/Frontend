import { UsersRound } from "lucide-react";

export default function TeamRequired() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <UsersRound size={28} />
        </div>

        <h1 className="text-xl font-semibold text-gray-900">
          Team assignment required
        </h1>

        <p className="mt-2 text-sm text-gray-500 leading-6">
          Your account is not assigned to a sales team. Please contact an admin
          or sales manager to assign you to a team before accessing leads,
          clients, quotations, and other features.
        </p>
      </div>
    </div>
  );
}
