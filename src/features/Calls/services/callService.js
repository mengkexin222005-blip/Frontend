import api from "../../../services/api";


const callService = {

  getCalls: async () => {

    const { data } =
      await api.get("/api/calls");

    return data;

  },


  createCall: async (payload) => {

    const backendPayload = {

      client:
        payload.contactPerson,

      company:
        payload.companyName,

      contactNumber:
        payload.contactValue,

      callType:
        payload.callType,

      schedule:
        payload.scheduledAt,

      status:
        payload.status,

      notes:
        payload.notes,

    };


    const { data } =
      await api.post(
        "/api/calls",
        backendPayload,
      );


    return data;

  },


  updateCall: async (
    id,
    payload,
  ) => {


    const backendPayload = {

      client:
        payload.contactPerson,

      company:
        payload.companyName,

      contactNumber:
        payload.contactValue,

      callType:
        payload.callType,

      schedule:
        payload.scheduledAt,

      status:
        payload.status,

      notes:
        payload.notes,

    };


    const { data } =
      await api.patch(
        `/api/calls/${id}`,
        backendPayload,
      );


    return data;

  },


  deleteCall: async (id) => {

    const { data } =
      await api.delete(
        `/api/calls/${id}`,
      );


    return data;

  },

};


export default callService;