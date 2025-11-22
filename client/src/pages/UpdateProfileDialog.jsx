import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { UPDATE_PROFILE_ROUTE } from "@/utils/constants";
import { addUser } from "@/store/slices/authSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [updateData, setUpdateData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    resume: null,
    profileImage: null,
    gender: user?.gender || "",
    github: user?.social?.github || "",
    linkedin: user?.social?.linkedin || ""
  });
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : value
    }));
  };

  const handleGenderChange = (value) => {
    setUpdateData(prev => ({ ...prev, gender: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.entries(updateData).forEach(([key, value]) => {
        if (!value && value !== 0) return;
        formData.append(key, value);
      });

      const response = await apiClient.post(UPDATE_PROFILE_ROUTE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      if (response.data.success) {
        dispatch(addUser(response.data.user));
        toast.success("Profile updated successfully");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const FileUploadButton = ({ id, name, label, accept, value }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
        <Button
          type="button"
          onClick={() => document.getElementById(id).click()}
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-3 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200"
        >
          <Upload className="mr-2 h-5 w-5" />
          {value ? value.name : `Upload ${label}`}
        </Button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[95%] md:max-w-[600px] lg:max-w-[800px] w-full bg-[url('https://i.pinimg.com/736x/bb/f3/7f/bbf37fb8161a5b94e57c7353a64dee6f.jpg')] dark:bg-[url('https://images.unsplash.com/photo-1569470451072-68314f596aec?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D')] text-gray-800 dark:text-gray-100 rounded-xl overflow-hidden shadow-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="p-4 sm:p-6"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  Update Your Profile
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="fullName" className="text-sm font-semibold">Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={updateData.fullName}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-800 border-0 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={updateData.email}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-800 border-0 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="gender" className="text-sm font-semibold">Gender</Label>
                    <Select
                      value={updateData.gender}
                      onValueChange={handleGenderChange}
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-0 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 transition-all duration-200">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="github" className="text-sm font-semibold">GitHub</Label>
                    <Input
                      id="github"
                      name="github"
                      value={updateData.github}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-800 border-0 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                      placeholder="GitHub profile URL"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="linkedin" className="text-sm font-semibold">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={updateData.linkedin}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-800 border-0 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                      placeholder="LinkedIn profile URL"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="phoneNumber" className="text-sm font-semibold">Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={updateData.phoneNumber}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-800 border-0 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="skills" className="text-sm font-semibold">Skills</Label>
                    <Input
                      id="skills"
                      name="skills"
                      value={updateData.skills}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-800 border-0 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                      placeholder="Enter your skills (comma-separated)"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="bio" className="text-sm font-semibold">Bio</Label>
                  <Input
                    id="bio"
                    name="bio"
                    value={updateData.bio}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-gray-800 border-0 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                    placeholder="Enter your bio"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FileUploadButton
                    id="resume"
                    name="resume"
                    label="Resume"
                    accept=".pdf"
                    value={updateData.resume}
                  />
                  <FileUploadButton
                    id="profileImage"
                    name="profileImage"
                    label="Profile Image"
                    accept="image/*"
                    value={updateData.profileImage}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Updating...
                    </div>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default UpdateProfileDialog;