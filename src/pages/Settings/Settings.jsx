

const Settings = () => {




  return (
    <div className="p-8 lg:w-[50rem] mx-auto col-span-6 shadow-xl rounded-xl   mt-2 bg-white border-t-4 border-green-500">
      <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
        Super Admin Settings
      </h2>
      <form className="space-y-6 grid lg:grid-cols-2 gap-x-6">
        <div className="flex flex-col">
          <label htmlFor="fullName" className="mb-2 font-semibold">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="border border-gray-300 rounded-lg p-3 w-full outline-none"
            placeholder="Full Name"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="birthdate" className="mb-2 font-semibold">
            Birthdate
          </label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            className="border border-gray-300 rounded-lg p-3 w-full outline-none"
            placeholder="Birthdate"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="nid" className="mb-2 font-semibold">
            NID Number
          </label>
          <input
            type="text"
            id="nid"
            name="nid"
            className="border border-gray-300 rounded-lg p-3 w-full outline-none"
            placeholder="NID Number"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="phone" className="mb-2 font-semibold">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="border border-gray-300 rounded-lg p-3 w-full outline-none"
            placeholder="Phone Number"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="border border-gray-300 rounded-lg p-3 w-full outline-none"
            placeholder="Email"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="permanentAddress" className="mb-2 font-semibold">
            Permanent Address
          </label>
          <input
            type="text"
            id="permanentAddress"
            name="permanentAddress"
            className="border border-gray-300 rounded-lg p-3 w-full outline-none"
            placeholder="Permanent Address"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="presentAddress" className="mb-2 font-semibold">
            Present Address
          </label>
          <input
            type="text"
            id="presentAddress"
            name="presentAddress"
            className="border border-gray-300 rounded-lg p-3 w-full outline-none"
            placeholder="Present Address"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="profession" className="mb-2 font-semibold">
            Profession
          </label>
          <input
            type="text"
            id="profession"
            name="profession"
            className="border border-gray-300 rounded-lg p-3 w-full outline-none"
            placeholder="Profession"
          />
        </div>

        <div className="flex col-span-2 flex-col">
          <label htmlFor="declaration" className="mb-2 font-semibold">
            Declaration (প্রতিষ্ঠানের ভূমিকা ও দায়বদ্ধতা)
          </label>
          <textarea
            id="declaration"
            name="declaration"
            rows="4"
            className="border w-full border-gray-300 rounded-lg p-3 w-full outline-none"
            placeholder="Write your declaration..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full col-span-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 cursor-pointer"
        >
          Save Information
        </button>
      </form>
    </div>
  );
};

export default Settings;
