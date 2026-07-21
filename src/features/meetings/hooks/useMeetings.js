import { useState, useMemo, useEffect } from "react";
import api from '../../../services/api';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  width: 'auto',
});

const getMeetingColor = (type = "") => {
  switch (type.trim().toLowerCase()) {
    case "client consultation":
      return "bg-blue-50 text-blue-600 border-blue-200";

    case "client meeting":
      return "bg-blue-50 text-blue-600 border-blue-200";

    case "internal meeting":
      return "bg-green-50 text-green-600 border-green-200";

    case "presentation":
      return "bg-purple-50 text-purple-600 border-purple-200";

    case "training":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";

    case "online":
      return "bg-cyan-50 text-cyan-600 border-cyan-200";

    case "sales meeting":
      return "bg-orange-50 text-orange-600 border-orange-200";

    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

const mapMeeting = (meeting) => ({
  id: meeting._id,
  title: meeting.meetingTitle,
  type: meeting.meetingType,
  date: new Date(meeting.date).toISOString().split("T")[0],
  startTime: meeting.startTime,
  endTime: meeting.endTime,
  time: `${meeting.startTime} - ${meeting.endTime}`,
  client: meeting.client || "",
  location: meeting.location || "",
  locationScope: meeting.locationScope,
  organizer: meeting.host || "",
  host: meeting.host || "",
  notes: meeting.notes || "",
  participants: meeting.participants || [],
  color: getMeetingColor(meeting.meetingType),
});

export function useMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [meetingToEdit, setMeetingToEdit] = useState(null);
  const [activeView, setActiveView] = useState('Month');
  const [filterPreset, setFilterPreset] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchMeetings = async () => {
    try {
      const { data } = await api.get("/api/meetings");
      setMeetings(data.map(mapMeeting));
      console.log("Meetings from API:", data);
      console.log("Mapped meetings:", data.map(mapMeeting));
    } catch (error) {
      console.error(error);
  
      Toast.fire({
        icon: "error",
        title: "Unable to load meetings",
      });
    }
  };
  
  useEffect(() => {
    fetchMeetings();
  }, []);

  const filteredMeetings = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return meetings.filter((meeting) => {
      const matchesSearch =
        !query ||
        meeting.title.toLowerCase().includes(query) ||
        meeting.client.toLowerCase().includes(query) ||
        meeting.type.toLowerCase().includes(query);

      const meetingDate = new Date(meeting.date);
      const today = new Date();
      const isUpcoming = meetingDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isCompleted = meetingDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const matchesFilter =
        filterPreset === 'all' ||
        (filterPreset === 'upcoming' && isUpcoming) ||
        (filterPreset === 'completed' && isCompleted) ||
        (filterPreset === 'cancelled' && meeting.type.toLowerCase().includes('cancel'));

      return matchesSearch && matchesFilter;
    });
  }, [meetings, searchQuery, filterPreset]);

  const openCreateMeeting = () => {
    setMeetingToEdit(null);
    setIsFormOpen(true);
  };

  const openEditMeeting = (meeting) => {
    setMeetingToEdit(meeting);
    setIsFormOpen(true);
  };

  const closeMeetingForm = () => {
    setIsFormOpen(false);
    setMeetingToEdit(null);
  };

  const handleAddMeeting = async (meetingData) => {
    try {
      const payload = {
        meetingTitle: meetingData.title,
        meetingType: meetingData.type,
        client: meetingData.client,
        date: meetingData.date,
        startTime: meetingData.startTime,
        endTime: meetingData.endTime,
        host: meetingData.host || meetingData.organizer,
        location: meetingData.location,
        locationScope: meetingData.locationScope,
        notes: meetingData.notes,
        participants: meetingData.participants || [],
      };
  
      if (meetingToEdit) {
        await api.patch(`/api/meetings/${meetingToEdit.id}`, payload);
  
        Toast.fire({
          icon: "success",
          title: "Meeting updated successfully",
        });
      } else {
        await api.post("/api/meetings", payload);
  
        Toast.fire({
          icon: "success",
          title: "Meeting added successfully",
        });
      }
  
      await fetchMeetings();
  
      closeMeetingForm();
      setSelectedMeeting(null);
  
    } catch (error) {
      console.error(error);
  
      Toast.fire({
        icon: "error",
        title:
          error.response?.data?.error ||
          "Unable to save meeting",
      });
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await api.delete(`/api/meetings/${meetingId}`);
  
      await fetchMeetings();
  
      setSelectedMeeting(null);
  
      Toast.fire({
        icon: "success",
        title: "Meeting deleted successfully",
      });
  
    } catch (error) {
      console.error(error);
  
      Toast.fire({
        icon: "error",
        title: "Unable to delete meeting",
      });
    }
  };

  const stats = useMemo(() => {
    const today = new Date();
    const upcoming = meetings.filter((meeting) => new Date(meeting.date) >= new Date(today.getFullYear(), today.getMonth(), today.getDate())).length;
    const completed = meetings.filter((meeting) => new Date(meeting.date) < new Date(today.getFullYear(), today.getMonth(), today.getDate())).length;
    const cancelled = meetings.filter((meeting) => meeting.type.toLowerCase().includes('cancel')).length;

    return {
      total: meetings.length,
      upcoming,
      completed,
      cancelled,
    };
  }, [meetings]);

  return {
    meetings: filteredMeetings,
    selectedMeeting,
    setSelectedMeeting,
    currentMonth,
    setCurrentMonth,
    searchQuery,
    setSearchQuery,
    isFormOpen,
    setIsFormOpen,
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
    stats,
  };
}