import PageHeader from "../../components/page/PageHeader";

export default function SettingsPage() {
  return (
    <div className="border bg-white border-gray-200 rounded-md p-6 mt-4 min-h-[calc(100vh-120px)]">
      <PageHeader
        title="Settings"
        subtitle="Application settings will be added here soon"
      />

      <div className="mt-6 rounded-md border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
        <p className="text-sm font-medium text-gray-500">
          Settings page is currently blank.
        </p>
      </div>
    </div>
  );
}