
  import { FaRegSmile } from "react-icons/fa";
  import OrdersTable from "../../../hooks/OrdersTable/OrdersTable";


  const ConsumerOrders = () => {
    const consumerOrdersData = [
      {
        sn: "01",
        trackingNo: "#R2345",
        productName: "Rice/ধান",
        quantity: "100",
        totalEarning: "10,000 TK",
        orderDate: "01/02/2024",
        status: "Done",
      },
      {
        sn: "02",
        trackingNo: "#R2326",
        productName: "Jute/পাঁট",
        quantity: "50",
        totalEarning: "15,00 TK",
        orderDate: "01/02/2025",
        status: "Done",
      },
      {
        sn: "03",
        trackingNo: "#R2365",
        productName: "Corn/ভুট্টা",
        quantity: "100",
        totalEarning: "10,000 TK",
        orderDate: "01/02/2025",
        status: "Done",
      },
      {
        sn: "04",
        trackingNo: "#R2345",
        productName: "Rice/ধান",
        quantity: "10",
        totalEarning: "100 TK",
        orderDate: "01/02/2025",
        status: "Pending",
      },
      {
        sn: "05",
        trackingNo: "#R2345",
        productName: "Rice/ধান",
        quantity: "10",
        totalEarning: "100 TK",
        orderDate: "01/02/2025",
        status: "Pending",
      },
      {
        sn: "06",
        trackingNo: "#R2345",
        productName: "Rice/ধান",
        quantity: "10",
        totalEarning: "100 TK",
        orderDate: "01/02/2025",
        status: "Pending",
      },
    ];

    return (
      <div>
        <div className="flex items-center justify-between px-4">
          <div className="text-lg mt-4 font-semibold text-gray-700 flex items-center">
            <FaRegSmile className="mr-2 text-green-500" /> Consumer Orders
          </div>
        
        </div>
        <OrdersTable data={consumerOrdersData} />
    
      </div>
    );
  };

  export default ConsumerOrders;
  


