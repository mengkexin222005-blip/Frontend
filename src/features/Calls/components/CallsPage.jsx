import { useState } from "react";
import { FaPlus } from "react-icons/fa";

import {
  PageBase,
  PageHeader,
  PageToolbar,
  PageContentState,
} from "../../../components/page";

import CallsForm from "./CallsForm";
import CallsTable from "./CallsTable";
import CallsKanban from "./CallsKanban";

import useCalls from "../hooks/useCalls";



export default function CallsPage() {

  const {
    calls,
    loading,
    addCall,
    editCall,
    removeCall,
    completeCall,
    onCategoryChange,
  } = useCalls();



  const [viewMode, setViewMode] = useState("table");

  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);

  const [editingCall, setEditingCall] = useState(null);





  const filteredCalls = calls.filter((call) => {

    const query = search
      .trim()
      .toLowerCase();


    if (!query) {
      return true;
    }


    return (
      call.clientName
        ?.toLowerCase()
        .includes(query)

      ||

      call.companyName
        ?.toLowerCase()
        .includes(query)

      ||

      call.callType
        ?.toLowerCase()
        .includes(query)
    );

  });






  const handleCreate = () => {

    setEditingCall(null);

    setFormOpen(true);

  };





  const handleEdit = (call) => {

    setEditingCall(call);

    setFormOpen(true);

  };





  const handleClose = () => {

    setFormOpen(false);

    setEditingCall(null);

  };






  const handleSubmit = async(payload) => {


    const success = editingCall

      ? await editCall(
          editingCall._id,
          payload,
        )

      : await addCall(payload);



    if (success) {

      handleClose();

    }



    return success;

  };







  return (

    <PageBase>


      <div className="
        mb-4
        flex
        items-center
        justify-between
      ">


        <PageHeader

          title="Calls"

          subtitle="Track future and past client calls."

        />




        <PageToolbar

          searchValue={search}

          onSearchChange={(event) =>
            setSearch(
              event.target.value,
            )
          }


          searchPlaceholder="Search calls..."


          view={viewMode}


          onViewChange={setViewMode}



          actionButton={

            <button

              type="button"

              onClick={handleCreate}

              className="
                flex
                items-center
                gap-2
                rounded-md
                bg-red-500
                px-5
                py-2
                text-sm
                font-medium
                text-white
                hover:bg-red-600
              "

            >

              <FaPlus size={11}/>

              Add Call


            </button>

          }


        />


      </div>







      <PageContentState loading={loading}>


        {
          viewMode === "table"

          ?


          <CallsTable

            calls={filteredCalls}

            loading={loading}

            onEdit={handleEdit}

            onDelete={removeCall}

            onComplete={completeCall}

          />



          :


          <CallsKanban

            calls={filteredCalls}

            loading={loading}

            onEdit={handleEdit}

            onDelete={removeCall}

            onComplete={completeCall}

            onCategoryChange={onCategoryChange}

          />

        }



      </PageContentState>







      <CallsForm


        open={formOpen}


        editingCall={editingCall}


        onSubmit={handleSubmit}


        onClose={handleClose}


        onCancel={handleClose}


        loading={loading}


      />



    </PageBase>

  );

}