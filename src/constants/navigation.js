import {
  LayoutDashboard,
  Users,
  Network,
  UsersRound,
  Magnet,
  UserCheck,
  BarChart2,
  ListTodo,
  Briefcase,
  CalendarDays,
  Phone,
  FileText,
} from "lucide-react";

const createIcon = (Icon) => ({
  default: Icon,
  active: Icon,
});

export const BASE_NAV = {
  dashboard: {
    icon: createIcon(LayoutDashboard),
    label: "Dashboard",
  },

  users: {
    icon: createIcon(Users),
    label: "Users",
  },

  teams: {
    icon: createIcon(Network),
    label: "Teams",
  },

  team: {
    icon: createIcon(UsersRound),
    label: "My Team",
  },

  reports: {
    icon: createIcon(BarChart2),
    label: "Reports",
  },

  // Module Header
  module: {
    label: "Modules",
    type: "group",
  },

  prospects: {
    icon: createIcon(Briefcase),
    label: "Prospects",
  },

  leads: {
    icon: createIcon(Magnet),
    label: "Leads",
  },

  clients: {
    icon: createIcon(UserCheck),
    label: "Clients",
  },

  quotations: {
    icon: createIcon(FileText),
    label: "Quotations",
  },

  tasks: {
    icon: createIcon(ListTodo),
    label: "Tasks",
  },

  meetings: {
    icon: createIcon(CalendarDays),
    label: "Meetings",
  },

  calls: {
    icon: createIcon(Phone),
    label: "Calls",
  },
};

export const ROLE_ROUTES = {
  "Super Admin": [
    "dashboard",

    "users",

    "reports",

    "module",

    "prospects",
    "leads",
    "clients",
    "quotations",
    "tasks",
    "meetings",
    "calls",
  ],

  Admin: [
    "dashboard",

    "users",

    "reports",

    "module",

    "prospects",
    "leads",
    "clients",
    "quotations",
    "tasks",
    "meetings",
    "calls",
  ],

  "Sales Manager": [
    "dashboard",

    "module",

    "prospects",
    "leads",
    "clients",
    "quotations",
    "tasks",
    "meetings",
    "calls",
  ],

  "Sales Agent": [
    "dashboard",

    "module",

    "prospects",
    "leads",
    "clients",
    "quotations",
    "tasks",
    "meetings",
    "calls",
  ],

  "Support Staff": [
    "dashboard",
  ],
};

export const ROLE_BASE_PATH = {
  "Super Admin": "/admin",
  Admin: "/admin",
  "Sales Manager": "/sales-manager",
  "Sales Agent": "/sales-agent",
  "Support Staff": "/support-staff",
};