import { useState } from "react";

const reportData = {
  title: "Product Sales Report",
  description:
    "This report provides comprehensive insights into the sales performance of the product over the last quarter. The report covers regional sales, customer feedback, marketing strategies, and future recommendations.",
  date: "2025-02-20",
  salesData: [
    { region: "North America", sales: 1200 },
    { region: "Europe", sales: 900 },
    { region: "Asia", sales: 1500 },
    { region: "South America", sales: 600 },
    { region: "Africa", sales: 450 },
  ],
  detailedAnalysis:
    "In-depth analysis includes regional sales trends, customer satisfaction scores, product performance per region, and marketing strategies that drove growth. The analysis also provides insights into challenges faced in certain markets and how those were addressed.",
  feedback: {
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    feedbackText:
      "The product did not meet my expectations. Poor quality. The material feels cheap, and the overall performance is subpar.",
    rating: 2,
    date: "2025-02-19",
    responseNeeded: true,
  },
};

const ReportPage = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [isResponseSent, setIsResponseSent] = useState(false);

  const handleResponseChange = (e) => {
    setResponseMessage(e.target.value);
  };

  const handleSendMessage = (method) => {
    alert(`Message sent via ${method}: ${responseMessage}`);
    setIsResponseSent(true);
    setResponseMessage("");
  };

  return (
    <div className="max-w-5xl mx-auto p-10 bg-white shadow-xl rounded-lg">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800">{reportData?.title}</h1>
        <p className="text-xl text-gray-600 mt-2">Date: {reportData?.date}</p>
      </div>

      <div className="mb-10">
        <p className=" text-gray-700">{reportData.description}</p>
      </div>

      <div className="space-y-6 mb-10">
        <h3 className="text-3xl font-semibold text-green-700">
          Sales Data Overview
        </h3>
        <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            Sales by Region:
          </h4>
          <ul className="list-disc pl-8 space-y-3  text-gray-600">
            {reportData.salesData.map((data, index) => (
              <li key={index}>
                <strong className="text-green-600">{data.region}:</strong>
                {data.sales} units sold
              </li>
            ))}
          </ul>
          <p className="mt-6  text-gray-700">{reportData.detailedAnalysis}</p>
        </div>
      </div>

      <div className="space-y-6 mb-10">
        <h3 className="text-3xl font-semibold text-indigo-700">
          User Feedback
        </h3>
        <div className="bg-gray-50 p-8 rounded-lg shadow-lg flex items-center space-x-6">
          <img
            src={reportData.feedback.user.image}
            alt={reportData.feedback.user.name}
            className="w-16 h-16 rounded-full"
          />
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-800">
              Feedback from {reportData.feedback.user.name}
            </h4>
            <p className=" text-gray-700">
              &quot;{reportData.feedback.feedbackText}&quot;
            </p>
            <p className=" text-gray-600">
              Rating: {reportData.feedback.rating}/5
            </p>
            <p className="text-sm text-gray-400">
              Submitted on: {reportData.feedback.date}
            </p>
            <p className="text-sm text-blue-600">
              {reportData.feedback.user.email}
            </p>
            {reportData.feedback.responseNeeded && (
              <p className="mt-4 text-sm text-red-600 font-semibold">
                <span className="font-bold">Attention Required: </span> This
                feedback requires a response.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6 mt-10">
        <h3 className="text-3xl font-semibold text-indigo-700">
          Admin Response
        </h3>
        <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
          <h4 className="text-xl font-semibold text-gray-800">
            Write Your Response
          </h4>
          <textarea
            value={responseMessage}
            onChange={handleResponseChange}
            className="w-full p-6 mt-4 border rounded-lg  text-gray-700"
            rows="6"
            placeholder="Provide a detailed response to the user..."
          ></textarea>

          <div className="mt-6 flex space-x-6">
            <button
              onClick={() => handleSendMessage("In-App Message")}
              className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-auto cursor-pointer"
            >
              Send In-App Message
            </button>
            <button
              onClick={() => handleSendMessage("Email")}
              className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition duration-300 w-full sm:w-auto cursor-pointer"
            >
              Send Email
            </button>
            <button
              onClick={() => handleSendMessage("Call")}
              className="bg-yellow-600 text-white py-3 px-8 rounded-lg hover:bg-yellow-700 transition duration-300 w-full sm:w-auto cursor-pointer"
            >
              Make a Call
            </button>
          </div>

          {isResponseSent && (
            <div className="mt-6 text-center p-4 bg-green-100 text-green-700 rounded-lg">
              <p className="font-semibold">Response sent successfully!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
