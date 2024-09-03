import Navbar from "./Navbar.jsx";

const Notification = () => {


  return (
    <>
      <Navbar />
      <div className="p-3 mx-auto gap-y-4 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold text-center my-14">Notifications</h1>
        <div className="flex items-center justify-center w-[90%] border p-3 rounded-lg">
          No Notifications Yet !!
        </div>
      </div>
    </>
  );
};

export default Notification;
