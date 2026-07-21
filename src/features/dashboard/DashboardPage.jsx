import { useState } from "react";

import {
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import {
  PageBase,
  PageHeader,
  PageContentState,
} from "../../components/page";

import { useDashboard } from "./hooks/useDashboard";



function normalizeStatus(status) {

  if (status === "To Do") return "Pending";

  if (status === "In Progress") return "Ongoing";

  return status || "Pending";

}



function Footer({ total }) {

  return (

    <div
      className="
      flex
      items-center
      justify-between
      border-t
      border-gray-200
      px-5
      py-4"
    >


      <span className="text-sm text-gray-500">
        Total Records {total}
      </span>



      <div className="flex items-center gap-2">


        <button
          className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-gray-200
          text-gray-300"
        >
          <ChevronLeft size={16}/>
        </button>



        <button
          className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          bg-red-500
          text-white"
        >
          1
        </button>



        <button
          className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-gray-200
          text-gray-300"
        >
          <ChevronRight size={16}/>
        </button>


      </div>


    </div>

  );

}




function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}) {

  return (

    <div className="mb-5 flex items-start gap-3">


      <div
        className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-lg
        bg-red-50
        text-red-500"
      >

        <Icon size={18}/>

      </div>



      <div>


        <h2
          className="
          text-lg
          font-semibold
          text-gray-700"
        >

          {title}

        </h2>



        <p
          className="
          text-sm
          text-gray-400"
        >

          {subtitle}

        </p>


      </div>


    </div>

  );

}   
function MyTasksTable({ tasks }) {

  const [activeStatus, setActiveStatus] =
    useState("Pending");



  const statuses = [
    {
      name: "Pending",
      color: "text-orange-500",
    },
    {
      name: "Ongoing",
      color: "text-blue-600",
    },
    {
      name: "Completed",
      color: "text-green-600",
    },
    {
      name: "Overdue",
      color: "text-red-600",
    },
  ];



  const filteredTasks = tasks.filter(
    (task) =>
      normalizeStatus(task.status) === activeStatus
  );



  return (

    <div
      className="
      overflow-hidden
      rounded-xl
      border
      border-gray-200
      bg-white"
    >


      <div className="p-5">


        <SectionHeader
          icon={CheckSquare}
          title="My Tasks"
          subtitle="Track your tasks by status"
        />



        {/* STATUS TABS */}

        <div
          className="
          flex
          gap-10
          border-b
          border-gray-200"
        >


          {
            statuses.map((item)=>(


              <button
                key={item.name}
                onClick={() =>
                  setActiveStatus(item.name)
                }
                className={`
                pb-3
                text-sm
                font-semibold
                transition

                ${
                  activeStatus === item.name
                  ?
                  `${item.color} border-b-2 border-red-500`
                  :
                  "text-gray-500"
                }
                `}
              >


                {item.name}



                <span
                  className="
                  ml-2
                  rounded-full
                  bg-gray-100
                  px-2
                  py-1
                  text-xs
                  text-gray-500"
                >

                  {
                    tasks.filter(
                      (task)=>
                        normalizeStatus(task.status)
                        === item.name
                    ).length
                  }

                </span>


              </button>


            ))

          }


        </div>




        {/* EMPTY CONTENT AREA */}

        <div
          className="
          flex
          min-h-95
          items-center
          justify-center
          text-sm
          font-medium
          text-gray-400"
        >


          {
            filteredTasks.length > 0

            ?

            `${filteredTasks.length} ${activeStatus} task(s)`

            :

            "No tasks found."
          }


        </div>



      </div>




      <Footer
        total={filteredTasks.length}
      />


    </div>

  );

} 
function MyMeetingsTable({ meetings }) {

  return (

    <div
      className="
      overflow-hidden
      rounded-xl
      border
      border-gray-200
      bg-white"
    >


      <div className="p-5">


        <SectionHeader
          icon={CalendarDays}
          title="My Meetings"
          subtitle="View scheduled meetings and appointments"
        />



        <div
          className="
          flex
          min-h-95
          items-center
          justify-center
          text-sm
          font-medium
          text-gray-400"
        >

          {
            meetings.length > 0

            ?

            `${meetings.length} meeting(s) scheduled`

            :

            "No meetings scheduled."
          }

        </div>


      </div>



      <Footer
        total={meetings.length}
      />


    </div>

  );

}






export default function DashboardPage() {


  const {
    stats,
    loading,
    error,
    refetch,
  } = useDashboard();



  const tasks =
    Array.isArray(stats?.openTasks)
      ? stats.openTasks
      : [];



  const meetings =
    Array.isArray(stats?.meetings)
      ? stats.meetings
      : [];



  return (

    <PageBase>


      {/* HEADER */}

      <div
        className="
        mb-5
        flex
        items-center
        justify-between"
      >


        <PageHeader
          title="Dashboard"
          subtitle="Manage your tasks and meetings"
        />



        <button
          type="button"
          onClick={refetch}
          className="
          flex
          items-center
          gap-2
          rounded-lg
          bg-red-500
          px-5
          py-2.5
          text-sm
          font-semibold
          text-white
          hover:bg-red-600"
        >

          <RefreshCw size={16}/>

          Refresh

        </button>


      </div>





      {
        error && (

          <div
            className="
            mb-4
            rounded-lg
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600"
          >

            {error}

          </div>

        )
      }






      <PageContentState loading={loading}>


        <div
          className="
          grid
          gap-6
          xl:grid-cols-2"
        >


          <MyTasksTable
            tasks={tasks}
          />



          <MyMeetingsTable
            meetings={meetings}
          />


        </div>


      </PageContentState>



    </PageBase>

  );

}