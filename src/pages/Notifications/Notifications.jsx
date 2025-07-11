import { useState } from "react";

const AdminNotifications = () => {
  const [activeTab, setActiveTab] = useState("consumer");

  const notifications = {
    consumer: [
      {
        id: 1,
        userId: "consumer_123",
        type: "Order Placed",
        message: "Consumer (ID: consumer_123) placed an order for 250kg Rice.",
        time: "Just now",
        date: "2025-02-20",
      },
      {
        id: 2,
        userId: "consumer_124",
        type: "Payment Successful",
        message:
          "Payment of 15,000 Tk received for Order #56789 from Consumer (ID: consumer_124).",
        time: "5 minutes ago",
        date: "2025-02-20",
      },
      {
        id: 3,
        userId: "consumer_125",
        type: "Delivery Scheduled",
        message:
          "Order for 250kg Rice will be delivered to Consumer (ID: consumer_125) between 12:00 PM - 3:00 PM.",
        time: "2 hours ago",
        date: "2025-02-19",
      },
    ],
    superSeller: [
      {
        id: 1,
        userId: "seller_1001",
        type: "New Order",
        message:
          "Super Seller (ID: seller_1001) has received a new order for 250kg Rice.",
        time: "Just now",
        date: "2025-02-20",
      },
      {
        id: 2,
        userId: "seller_1002",
        type: "Account Flagged",
        message:
          "Super Seller (ID: seller_1002) has been flagged due to a policy violation.",
        time: "10 minutes ago",
        date: "2025-02-20",
      },
      {
        id: 3,
        userId: "seller_1003",
        type: "Order Payment Received",
        message:
          "Super Seller (ID: seller_1003) received payment of 15,000 Tk for Order #56789.",
        time: "1 hour ago",
        date: "2025-02-19",
      },
    ],
    producer: [
      {
        id: 1,
        userId: "producer_321",
        type: "Stock Update",
        message:
          "Producer (ID: producer_321) updated their stock of 300kg Rice.",
        time: "Just now",
        date: "2025-02-20",
      },
      {
        id: 2,
        userId: "producer_322",
        type: "New Bulk Order",
        message:
          "Producer (ID: producer_322) received a new bulk order for 500kg Rice.",
        time: "30 minutes ago",
        date: "2025-02-20",
      },
      {
        id: 3,
        userId: "producer_323",
        type: "Maintenance Reminder",
        message:
          "Krishi Ghar will be under maintenance from 12:00 AM - 3:00 AM for Producer (ID: producer_323).",
        time: "2 hours ago",
        date: "2025-02-19",
      },
    ],
    wholesaler: [
      {
        id: 1,
        userId: "wholesaler_201",
        type: "Bulk Order Received",
        message:
          "Wholesaler (ID: wholesaler_201) received a new bulk order for 500kg Rice.",
        time: "Just now",
        date: "2025-02-20",
      },
      {
        id: 2,
        userId: "wholesaler_202",
        type: "Discount Offer",
        message:
          "Wholesaler (ID: wholesaler_202) has received a special discount offer for their next 1000kg order.",
        time: "1 hour ago",
        date: "2025-02-20",
      },
      {
        id: 3,
        userId: "wholesaler_203",
        type: "Payment Received",
        message:
          "Wholesaler (ID: wholesaler_203) received payment of 25,000 Tk for Order #56789.",
        time: "5 hours ago",
        date: "2025-02-19",
      },
    ],
  };

  return (
    <div className="w-full">
      <div className="pt-6 w-full">
        <div className="w-full flex items-center px-6 lg:px-0 justify-between">
          <p className="font-semibold text-green text-2xl">
            ADMIN NOTIFICATIONS
          </p>
          <div className="border text-sm rounded-lg px-3.5 py-1.5 bg-gray-500 text-white flex items-center gap-2">
            <p>Unread</p>
            <p>05</p>
          </div>
        </div>
        <div className="w-full h-[1px] bg-gray-300 mt-5 border-dashed"></div>
        <div className="mt-7 flex gap-2 justify-center">
          <button
            className={`cursor-pointer ${
              activeTab === "consumer"
                ? "bg-green-500 text-white"
                : " bg-gray-300 text-black"
            }  py-2 px-4 rounded-md`}
            onClick={() => setActiveTab("consumer")}
          >
            Consumer
          </button>
          <button
            className={`cursor-pointer ${
              activeTab === "superSeller"
                ? "bg-green-500 text-white500"
                : "bg-gray-300 text-black"
            }  py-2 px-4 rounded-md`}
            onClick={() => setActiveTab("superSeller")}
          >
            Super Seller
          </button>
          <button
            className={`cursor-pointer ${
              activeTab === "producer"
                ? "bg-green-500 text-white"
                : " bg-gray-300 text-black"
            }  py-2 px-4 rounded-md`}
            onClick={() => setActiveTab("producer")}
          >
            Producer
          </button>
          <button
            className={`cursor-pointer ${
              activeTab === "wholesaler"
                ? "bg-green-500 text-white00"
                : "bg-gray-300 text-black"
            }  py-2 px-4 rounded-md`}
            onClick={() => setActiveTab("wholesaler")}
          >
            Wholesaler
          </button>
        </div>
        <div className="mt-7 lg:max-w-[50%] mx-auto flex flex-col gap-y-3">
          {notifications[activeTab].map((notification) => (
            <div
              key={notification.id}
              className="grid grid-cols-10 gap-4 bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="col-span-2 lg:col-span-1 flex items-center justify-center">
                <img
                  src="https://i.ibb.co/kVzKKK1x/rice.jpg"
                  alt="Notification"
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <div className="col-span-6 lg:col-span-7">
                <p className="font-bold text-blue-600">{notification.type}</p>
                <p className="text-gray-700 text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.time}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Date: {notification.date}
                </p>
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <button className="text-sm bg-red-500 text-white px-3 py-1 rounded-md">
                  X
                </button>
              </div>
            </div>
          ))}
          <button className="mx-auto mt-6 text-sm px-6 py-3 bg-green-500 text-white rounded-lg shadow-sm">
            Load More Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
