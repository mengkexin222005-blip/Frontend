import { useMemo, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

import { PageBase, PageHeader, PageToolbar } from "../../../components/page";

import FilterPopover from "../../../components/filters/FilterPopover";
import { useFilterPopover } from "../../../components/filters/useFilterPopover";
import { getSelectProps } from "../../../components/select/selectConfig";

import ReportTable from "../components/ReportTable";
import ReportModal from "../components/ReportModal";

// const initialReports = [
//   {
//     id: 1,
//     title: "Sales Report",
//     description: "Monitor sales progress and revenue",
//     category: "Sales",
//     route: "/reports/sales",
//   },
//   {
//     id: 2,
//     title: "Lead Conversion Report",
//     description: "View lead conversion statistics",
//     category: "Leads",
//     route: "/reports/leads",
//   },
//   {
//     id: 3,
//     title: "Client Report",
//     description: "Generate client information reports",
//     category: "Clients",
//     route: "/reports/clients",
//   },
// ];

const emptyForm = {
  title: "",
  description: "",
  category: "Sales",
};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  width: "auto",
});

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const clearAllFilters = () => {
    setFilterCategory("All");
  };

  const { filterOpen, setFilterOpen, filterRef, activeFilterCount } =
    useFilterPopover(
      {
        filterCategory,
      },
      clearAllFilters,
    );

  const openCreateModal = () => {
    setEditingReport(null);
    setFormData({ ...emptyForm });
    setIsModalOpen(true);
  };

  const openEditModal = (report) => {
    setEditingReport(report);
    setFormData({
      title: report.title,
      description: report.description,
      category: report.category,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReport(null);
    setFormData({ ...emptyForm });
  };

  const handleFieldChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = formData.title.trim();
    const description = formData.description.trim();
    const category = formData.category.trim();

    if (!title || !category) {
      await Swal.fire({
        icon: "error",
        title: "Validation error",
        text: "Please enter a report name and category.",
      });
      return;
    }

    setSubmitting(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 400));

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "report";

      if (editingReport) {
        setReports((current) =>
          current.map((report) =>
            report.id === editingReport.id
              ? {
                  ...report,
                  title,
                  description,
                  category,
                  route: `/reports/${slug}`,
                }
              : report,
          ),
        );
        Toast.fire({ icon: "success", title: "Report updated successfully" });
      } else {
        setReports((current) => [
          {
            id: Date.now(),
            title,
            description,
            category,
            route: `/reports/${slug}`,
          },
          ...current,
        ]);
        Toast.fire({ icon: "success", title: "Report created successfully" });
      }

      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reportId) => {
    const result = await Swal.fire({
      title: "Delete report?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    setSubmitting(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      setReports((current) => current.filter((report) => report.id !== reportId));
      Toast.fire({ icon: "success", title: "Report deleted successfully" });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = useMemo(() => {
    const keyword = search.toLowerCase();

    return reports.filter((report) => {
      const searchMatch =
        report.title.toLowerCase().includes(keyword) ||
        report.description.toLowerCase().includes(keyword) ||
        report.category.toLowerCase().includes(keyword);

      const categoryMatch =
        filterCategory === "All" ||
        report.category === filterCategory;

      return searchMatch && categoryMatch;
    });
  }, [reports, search, filterCategory]);

  return (
    <PageBase>
      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="Reports"
          subtitle="Generate reports to monitor CRM activities, sales progress, and team performance."
        />

        <PageToolbar
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          searchPlaceholder="Search reports..."
          actionButton={
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
            >
              Add Report
            </button>
          }
          filterSlot={
            <FilterPopover
              filterRef={filterRef}
              filterOpen={filterOpen}
              onToggle={() => setFilterOpen((prev) => !prev)}
              activeFilterCount={
                filterCategory === "All" ? 0 : activeFilterCount
              }
              onClearAll={clearAllFilters}
            >
              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Report Category
                </p>

                <Select
                  {...getSelectProps({ variant: "filter" })}
                  placeholder="All Reports"
                  options={[
                    {
                      label: "All Reports",
                      value: "All",
                    },
                    {
                      label: "Sales",
                      value: "Sales",
                    },
                    {
                      label: "Leads",
                      value: "Leads",
                    },
                    {
                      label: "Clients",
                      value: "Clients",
                    },
                  ]}
                  value={{
                    label:
                      filterCategory === "All"
                        ? "All Reports"
                        : filterCategory,
                    value: filterCategory,
                  }}
                  onChange={(option) =>
                    setFilterCategory(option?.value || "All")
                  }
                />
              </div>
            </FilterPopover>
          }
        />
      </div>

      <ReportTable
        reports={filteredReports}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <ReportModal
        open={isModalOpen}
        editingReport={editingReport}
        formData={formData}
        loading={submitting}
        onChange={handleFieldChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </PageBase>
  );
}