import {
  CheckCircle,
  Edit2,
  PhoneCall,
  Trash2,
} from "lucide-react";

import BaseKanban from "../../../components/kanban/BaseKanban";
import BaseDraggableCard from "../../../components/kanban/BaseDraggableCard";
import KanbanColumnHeader from "../../../components/kanban/KanbanColumnHeader";
import LoaderCards from "../../../components/loader/CardsLazyLoader";


const CALL_CATEGORIES = [
  "Future Call",
  "Past Call",
];


const CATEGORY_LABEL = {
  "Future Call": "Future Calls",
  "Past Call": "Past Calls",
};


const CATEGORY_SUBTEXT = {
  "Future Call": "Scheduled client calls",
  "Past Call": "Completed or finished calls",
};




const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-PH", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};




const getContactValue = (call) => {
  return (
    call.contactValue ||
    call.phone ||
    call.email ||
    "-"
  );
};




const normalizeCategory = (call) => {
  if (
    call.category === "Past Call" ||
    call.status === "Completed"
  ) {
    return "Past Call";
  }

  return "Future Call";
};




const groupCallsByCategory = (
  calls = [],
  statuses = CALL_CATEGORIES,
) => {

  return statuses.reduce(
    (result, status) => {

      result[status] = calls.filter(
        (call) =>
          normalizeCategory(call) === status,
      );

      return result;

    },
    {},
  );

};






export default function CallsKanban({
  calls = [],
  loading = false,
  activeCategory = "All",
  onEdit,
  onDelete,
  onComplete,
  onCategoryChange,
}) {


  const visibleStatuses =
    activeCategory === "All"
      ? CALL_CATEGORIES
      : CALL_CATEGORIES.filter(
          (item) => item === activeCategory,
        );



  const columns =
    groupCallsByCategory(
      calls,
      visibleStatuses,
    );



  const handleDragEnd = async(result) => {

    const {
      destination,
      source,
      draggableId,
    } = result;


    if (!destination) return;


    const oldCategory =
      source.droppableId;


    const newCategory =
      destination.droppableId;



    if (oldCategory === newCategory) {
      return;
    }



    if (onCategoryChange) {

      await onCategoryChange(
        draggableId,
        newCategory,
      );

      return;
    }



    if (newCategory === "Past Call") {

      await onComplete?.(draggableId);

    }

  };




  if (loading) {

    return (
      <LoaderCards
        columns={visibleStatuses}
      />
    );

  }




  return (

    <BaseKanban

      columns={columns}

      statuses={visibleStatuses}

      onDragEnd={handleDragEnd}

      emptyMessage="No calls"

      successStatus="Past Call"

      maxHeight="calc(100vh - 280px)"



      renderHeader={(status, items) => (

        <KanbanColumnHeader

          label={status}

          count={items.length}

          successStatus="Past Call"

          subtext={
            CATEGORY_SUBTEXT[status]
          }

        />

      )}



      renderCard={(call, index, items) => {

        const category =
          normalizeCategory(call);


        const completed =
          call.status === "Completed" ||
          category === "Past Call";



        return (

          <BaseDraggableCard

            key={
              call._id || index
            }

            id={
              String(
                call._id || index,
              )
            }

            index={index}

            isLast={
              index === items.length - 1
            }

            wrapperClassName="
              hover:border-red-200
              hover:bg-red-50
            "

          >


            <div className="
              flex
              items-start
              justify-between
              gap-3
            ">


              <div className="min-w-0">

                <h4 className="
                  truncate
                  text-sm
                  font-semibold
                  text-gray-800
                ">

                  {
                    call.clientName ||
                    "Unnamed client"
                  }

                </h4>


                <p className="
                  mt-1
                  truncate
                  text-xs
                  text-gray-500
                ">

                  {
                    call.companyName ||
                    "No company"
                  }

                </p>


              </div>



              <span className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-red-50
                text-red-500
              ">

                <PhoneCall size={15} />

              </span>


            </div>




            <div className="
              mt-3
              space-y-1.5
              text-xs
              text-gray-500
            ">


              <p className="truncate">

                {
                  call.contactMethod ||
                  "Mobile"
                }

                :

                {" "}

                {
                  getContactValue(call)
                }

              </p>



              <p className="truncate">

                {
                  call.callType ||
                  "Follow-up Call"
                }

              </p>



              <p>

                {
                  formatDateTime(
                    call.scheduledAt,
                  )
                }

              </p>


            </div>




            <div className="
              mt-3
              flex
              flex-wrap
              gap-2
            ">


              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-xs
                  font-medium

                  ${
                    completed
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-sky-50 text-sky-700"
                  }
                `}
              >

                {
                  call.status ||
                  "Scheduled"
                }

              </span>



              <span className="
                rounded-full
                bg-gray-100
                px-2.5
                py-1
                text-xs
                font-medium
                text-gray-600
              ">

                {
                  CATEGORY_LABEL[category]
                }

              </span>


            </div>




            <div className="
              mt-4
              flex
              justify-end
              gap-2
            ">



              {!completed && (

                <button

                  type="button"

                  onClick={() =>
                    onComplete?.(
                      call._id,
                    )
                  }

                  className="
                    text-gray-400
                    hover:text-emerald-600
                  "

                  title="Complete"

                >

                  <CheckCircle size={15} />

                </button>

              )}



              <button

                type="button"

                onClick={() =>
                  onEdit?.(call)
                }

                className="
                  text-gray-400
                  hover:text-sky-600
                "

                title="Edit"

              >

                <Edit2 size={15} />

              </button>





              <button

                type="button"

                onClick={() =>
                  onDelete?.(
                    call._id,
                  )
                }

                className="
                  text-gray-400
                  hover:text-red-600
                "

                title="Delete"

              >

                <Trash2 size={15} />

              </button>



            </div>



          </BaseDraggableCard>

        );

      }}

    />

  );

}