import React from 'react';
import { Building2, CalendarDays, Clock3, MapPin, Trash2, UserRound, Users } from 'lucide-react';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function MeetingDetails({ meeting, onClose, onEdit, onDelete }) {
  if (!meeting) {
    return (
      <div className="flex min-h-90 items-center justify-center rounded-md border border-gray-200 bg-white p-6 text-sm text-gray-400 shadow-sm">
        Select a meeting to view its details.
      </div>
    );
  }

  const details = [
    {
      icon: <Building2 size={14} />,
      label: 'Meeting Venue',
      value: meeting.venue || meeting.client || 'Client location',
    },
    {
      icon: <MapPin size={14} />,
      label: 'Location',
      value: meeting.location || 'Enter location...',
    },
    {
      icon: <CalendarDays size={14} />,
      label: 'Date',
      value: meeting.date ? formatDate(meeting.date) : '—',
    },
    {
      icon: <Clock3 size={14} />,
      label: 'Time',
      value:meeting.startTime && meeting.endTime
          ? `${meeting.startTime} - ${meeting.endTime}`
          : meeting.startTime || meeting.time || '—',
    },
    {
      icon: <MapPin size={14} />,
      label: 'Location scope',
      value: meeting.locationScope || 'Inside the Philippines',
    },
    {
      icon: <UserRound size={14} />,
      label: 'Host',
      value: meeting.host || meeting.organizer || "—",
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-md border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
          {meeting?.type || 'Meeting'}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-xl font-light text-gray-400 transition-colors hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <h3 className="mt-4 text-sm font-semibold text-gray-800">{meeting?.title || 'Untitled Meeting'}</h3>

      <div className="mt-5 grid gap-4 text-sm text-gray-600">
        {details.map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500">
              <div>{item.icon}</div>
              <p className="text-[11px] uppercase tracking-wide text-gray-400">{item.label}</p>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {meeting.participants?.length ? (
          meeting.participants.map((person, index) => (
            <div
              key={`${person}-${index}`}
              className="flex items-center gap-2 rounded-md bg-gray-50 px-2.5 py-2"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-gray-600 shadow-sm">
                {person
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <span className="text-sm text-gray-700">{person}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No participants.</p>
        )}
      </div>

      <div className="mt-6 rounded-md border border-gray-100 bg-gray-50 p-3">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Notes</h4>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">{meeting?.notes || 'No notes available.'}</p>
      </div>

      <div className="mt-6 flex gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}