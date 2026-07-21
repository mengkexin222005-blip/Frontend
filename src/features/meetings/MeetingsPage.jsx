import React, { useRef, useEffect } from 'react';
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Filter, Plus, XCircle } from 'lucide-react';

import { PageBase, PageHeader } from '../../components/page';
import StatCard from '../../components/card/StatCard';
import { useMeetings } from './hooks/useMeetings';
import MeetingCalendar from './MeetingCalendar';
import MeetingDetails from './MeetingDetails';
import MeetingForm from './MeetingForm';
import { formatMonthYear } from './utils/calendarUtils';

export default function MeetingsPage() {
  const {
    meetings,
    selectedMeeting,
    setSelectedMeeting,
    currentMonth,
    setCurrentMonth,
    searchQuery,
    setSearchQuery,
    isFormOpen,
    meetingToEdit,
    activeView,
    setActiveView,
    filterPreset,
    setFilterPreset,
    isFilterOpen,
    setIsFilterOpen,
    openCreateMeeting,
    openEditMeeting,
    closeMeetingForm,
    handleAddMeeting,
    handleDeleteMeeting,
  } = useMeetings();

  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <PageBase className="overflow-hidden">
      <div className="mb-5 flex items-start justify-between gap-4">
        <PageHeader
          title="Meetings"
          subtitle="Manage scheduled meetings and calendar events"
        />

        <div className="flex items-center gap-2">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56 rounded-md border border-gray-300 px-3 py-1.75 text-sm text-gray-700 placeholder-gray-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
          />

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.75 text-sm text-gray-600 transition-colors hover:bg-gray-50"
            >
              <Filter size={14} />
              Filter
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 z-20 mt-2 w-44 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
                {['all', 'upcoming', 'completed', 'cancelled'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setFilterPreset(option);
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full rounded-md px-2 py-1.5 text-left text-sm capitalize transition-colors ${
                      filterPreset === option ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {option === 'all' ? 'All meetings' : option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={openCreateMeeting}
            className="flex items-center gap-1.5 rounded-md bg-red-500 px-3 py-1.75 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            <Plus size={14} />
            Add Meeting
          </button>
        </div>
      </div>

      <div className={`grid flex-1 min-h-0 grid-cols-1 gap-4 ${selectedMeeting ? 'xl:grid-cols-[minmax(0,1fr)_320px]' : 'xl:grid-cols-1'}`}>
        <div className="flex min-h-0 flex-col gap-4">

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-gray-200 bg-white">
            <div className="relative flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                  className="rounded-md border border-gray-200 p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                  className="rounded-md border border-gray-200 p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="pointer-events-none absolute inset-x-0 flex justify-center">
                <span className="text-lg font-semibold text-gray-600">{formatMonthYear(currentMonth)}</span>
              </div>

              <div className="flex items-center rounded-md border border-gray-200 bg-gray-50 p-0.5">
                {['Day', 'Week', 'Month'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setActiveView(mode)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeView === mode
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              <MeetingCalendar
                currentMonth={currentMonth}
                meetings={meetings}
                onSelectMeeting={setSelectedMeeting}
                activeMeetingId={selectedMeeting?.id}
                activeView={activeView}
              />
            </div>
          </div>
        </div>

        {selectedMeeting && (
          <MeetingDetails
            meeting={selectedMeeting}
            onClose={() => setSelectedMeeting(null)}
            onEdit={() => openEditMeeting(selectedMeeting)}
            onDelete={() => handleDeleteMeeting(selectedMeeting?.id)}
          />
        )}
      </div>

      <MeetingForm
        isOpen={isFormOpen}
        onClose={closeMeetingForm}
        onSubmit={handleAddMeeting}
        meeting={meetingToEdit}
      />
    </PageBase>
  );
}