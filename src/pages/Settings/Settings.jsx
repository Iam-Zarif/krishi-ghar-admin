import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaCamera, FaKey, FaSave, FaUserCog } from "react-icons/fa";
import { Api } from "../../Api/Api";
import { AuthContext } from "../../Context/GetProfile/GetProfile";

const blankUser = "/photos/common/user.png";

const emptyProfileForm = {
  name: "",
  email: "",
  phone: "",
  nid: "",
  division: "",
  district: "",
  thana: "",
  address: "",
};

const Settings = () => {
  const { profile, setProfile } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [form, setForm] = useState(emptyProfileForm);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (!profile) return;

    setForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      nid: profile.nid || "",
      division: profile.division || "",
      district: profile.district || "",
      thana: profile.thana || "",
      address: profile.address || "",
    });
    setImagePreview(profile.image || "");
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      toast.error("Unauthorized access");
      return;
    }

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });
    if (image) payload.append("image", image);

    try {
      setSavingProfile(true);
      const response = await axios.put(`${Api}/api/v1/admin/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setProfile(response.data?.admin || profile);
      setImage(null);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      toast.error("Both password fields are required");
      return;
    }

    try {
      setSavingPassword(true);
      await axios.put(`${Api}/api/v1/admin/change-password`, passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setPasswordForm({ oldPassword: "", newPassword: "" });
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="w-full p-6 text-gray-800">
      <ToastContainer />
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-lg bg-white px-6 py-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-3 text-green-700">
              <FaUserCog />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
              <p className="text-sm text-gray-500">Update your admin profile and password.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex flex-col items-center lg:w-56">
              <img
                src={imagePreview || blankUser}
                alt="Admin profile"
                className="h-32 w-32 rounded-full border-4 border-green-100 object-cover"
              />
              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <FaCamera className="text-green-600" />
                Change Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            <div className="grid flex-1 gap-4 md:grid-cols-2">
              {[
                ["name", "Full Name"],
                ["phone", "Phone Number"],
                ["email", "Email"],
                ["nid", "NID Number"],
                ["division", "Division"],
                ["district", "District"],
                ["thana", "Thana"],
                ["address", "Address"],
              ].map(([name, label]) => (
                <div key={name} className={name === "address" ? "md:col-span-2" : ""}>
                  <label htmlFor={name} className="mb-2 block text-sm font-semibold text-gray-700">
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={name === "email" ? "email" : "text"}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-green-500"
                    placeholder={label}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300 cursor-pointer"
            >
              <FaSave />
              {savingProfile ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>

        <form onSubmit={handlePasswordSubmit} className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-3 text-yellow-700">
              <FaKey />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
              <p className="text-sm text-gray-500">Use a new password that differs from the old one.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="password"
              value={passwordForm.oldPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, oldPassword: event.target.value }))
              }
              placeholder="Old password"
              className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-green-500"
            />
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
              }
              placeholder="New password"
              className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-green-500"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer"
            >
              <FaKey />
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
