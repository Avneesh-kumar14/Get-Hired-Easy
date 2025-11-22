import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Globe,
  MapPin,
  FileText,
  Upload,
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_COMPANY_ROUTE } from "@/utils/constants";
import { apiClient } from "@/lib/apiClient";
import { setSingleCompany } from "@/store/slices/companySlice";
import { toast } from "sonner";
import useGetCompanyById from "@/hooks/useGetCompanyById";

const CompanySetup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { companyId } = useParams();
  useGetCompanyById(companyId);
  const { singleCompany } = useSelector((store) => store.company);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    email: "",
    phone: "",
    twitter: "",
    linkedIn: "",
    location: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setInput((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  useEffect(() => {
    setInput({
      name: singleCompany?.name || "",
      description: singleCompany?.description || "",
      website: singleCompany?.website || "",
      email: singleCompany?.email || "",
      phone: singleCompany?.contact || "",
      twitter: singleCompany?.twitter || "",
      linkedIn: singleCompany?.linkedIn || "",
      location: singleCompany?.location || "",
      file: singleCompany?.file || null,
    });
  }, [singleCompany]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", input?.name);
      formData.append("description", input?.description);
      formData.append("website", input?.website);
      formData.append("email", input?.email);
      formData.append("contact", input?.phone);
      formData.append("twitter", input?.twitter);
      formData.append("linkedIn", input?.linkedIn);
      formData.append("location", input?.location);
      if (input.file) {
        formData.append("file", input?.file);
      }

      const response = await apiClient.put(
        `${UPDATE_COMPANY_ROUTE}/${companyId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setSingleCompany({ ...input, ...response?.data?.company }));
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto my-10"
    >
      <Card className="bg-white/40 dark:bg-gray-950/40 shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/companies")}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-3xl font-bold">Company Setup</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Top Row - Name and Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="flex items-center text-gray-700 dark:text-gray-200"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Company Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={input.name}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="bg-white/80 dark:bg-gray-950/80"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="website"
                  className="flex items-center text-gray-700 dark:text-gray-200"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  value={input.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="bg-white/80 dark:bg-gray-950/80"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="flex items-center text-gray-700 dark:text-gray-200"
              >
                <FileText className="w-4 h-4 mr-2" />
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={input.description}
                onChange={handleChange}
                placeholder="Describe your company"
                rows={4}
                className="bg-white/80 dark:bg-gray-950/80"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center text-gray-700 dark:text-gray-200"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={input.email}
                  onChange={handleChange}
                  placeholder="Enter company email"
                  className="bg-white/80 dark:bg-gray-950/80"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="flex items-center text-gray-700 dark:text-gray-200"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={input.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="bg-white/80 dark:bg-gray-950/80"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="twitter"
                  className="flex items-center text-gray-700 dark:text-gray-200"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={input.twitter}
                  onChange={handleChange}
                  placeholder="@handle"
                  className="bg-white/80 dark:bg-gray-950/80"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="linkedIn"
                  className="flex items-center text-gray-700 dark:text-gray-200"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedIn"
                  name="linkedIn"
                  value={input.linkedIn}
                  onChange={handleChange}
                  placeholder="LinkedIn profile URL"
                  className="bg-white/80 dark:bg-gray-950/80"
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label
                htmlFor="file"
                className="flex items-center text-gray-700 dark:text-gray-200"
              >
                <Upload className="w-4 h-4 mr-2" />
                Company Logo
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-white/80 dark:bg-gray-950/80"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="flex items-center text-gray-700 dark:text-gray-200"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Address
              </Label>
              <Input
                id="location"
                name="location"
                value={input.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="bg-white/80 dark:bg-gray-950/80"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Company"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CompanySetup;
