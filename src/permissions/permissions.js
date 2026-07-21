import { ROLES } from "./roles";

const { ADMIN, SALES_MANAGER, SALES_AGENT } = ROLES;

export const PERMISSIONS = {
  leads: {
    [ADMIN]: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canAssign: true,
      canConvert: true,
      canApproveConvert: true,
      canRequestConvert: false,
      canUpdateStatus: true,
    },
    [SALES_MANAGER]: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canAssign: true,
      canConvert: true,
      canApproveConvert: true,
      canRequestConvert: false,
      canUpdateStatus: false,
    },
    [SALES_AGENT]: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canAssign: false,
      canConvert: false,
      canApproveConvert: false,
      canRequestConvert: true,
      canUpdateStatus: true,
    },
  },
  clients: {
    [ADMIN]: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canAssign: true,
    },
    [SALES_MANAGER]: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canAssign: true,
    },
    [SALES_AGENT]: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canAssign: false,
    },
  },
  tasks: {
    [ADMIN]: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canAssign: true,
      canUpdateStatus: true,
    },
    [SALES_MANAGER]: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canAssign: true,
      canUpdateStatus: true,
    },
    [SALES_AGENT]: {
      canCreate: true,
      canEdit: true,
      canDelete: true, // can only delete their own created tasks
      canAssign: false,
      canUpdateStatus: true,
    },
  },
  quotations: {
    [ADMIN]: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canAssign: true,
      canUpdateStage: true,
    },
    [SALES_MANAGER]: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canAssign: true,
      canUpdateStage: true,
    },
    [SALES_AGENT]: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canAssign: false,
      canUpdateStage: true,
    },
  },
};
