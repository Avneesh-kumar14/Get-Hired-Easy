import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Mail,
  Phone,
  Twitter,
  Linkedin,
  CheckCircle2,
  XCircle,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { DUMMY_PROFILE_URL } from "@/utils/constants";

const CompanyDetails = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  const company = companies.find((c) => c._id === companyId);
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (!company) {
    return (
      <motion.div
        className="flex items-center justify-center "
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
              Company Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              The requested company could not be found.
            </p>
            <Button
              onClick={() => navigate("/admin/companies")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Companies
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className=" my-10 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/companies")}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Companies
          </Button>
          <Button
            onClick={() => navigate(`/admin/companies/${company?._id}`)}
            variant="outline"
            className="bg-white/60 dark:bg-gray-950/65 text-blue-600 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-gray-700"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Company
          </Button>
        </div>

        <Card className="bg-white/30 dark:bg-gray-950/30 shadow-md rounded-lg overflow-hidden">
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 rounded-full ring-2 ring-white dark:ring-gray-800 shadow-sm">
                <AvatarImage
                  src={company?.logo || DUMMY_PROFILE_URL}
                  alt={company?.name}
                />
                <AvatarFallback className="text-2xl">
                  {company?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                  {company?.name}
                </CardTitle>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                  {company?.description || "No description available"}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:space-x-12 ">
              <div className="lg:w-1/3 mb-8 lg:mb-0 ">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Company Information
                </h2>
                <div className="space-y-4">
                  <SocialItem
                    icon={<Globe className="h-5 w-5 text-blue-500" />}
                    platform="Website"
                    handle={company?.website}
                  ></SocialItem>

                  <InfoItem
                    icon={<MapPin className="h-5 w-5 text-red-500" />}
                    label="Location"
                  >
                    {company?.location || "N/A"}
                  </InfoItem>
                  <InfoItem
                    icon={<Mail className="h-5 w-5 text-green-500" />}
                    label="Email"
                  >
                    {company?.email || "N/A"}
                  </InfoItem>
                  <InfoItem
                    icon={<Phone className="h-5 w-5 text-yellow-500" />}
                    label="Phone"
                  >
                    {company?.contact || "N/A"}
                  </InfoItem>
                </div>
              </div>

              <Separator orientation="vertical" className="hidden lg:block" />

              <div className="lg:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Social Profiles
                    </h2>
                    <div className="space-y-3">
                      <SocialItem
                        icon={<Twitter className="h-5 w-5 text-blue-400" />}
                        platform="Twitter Profile"
                        handle={company?.twitter}
                      />
                      <SocialItem
                        icon={<Linkedin className="h-5 w-5 text-blue-700" />}
                        platform="LinkedIn Profile"
                        handle={company?.linkedIn}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <div className="bg-gray-50 dark:bg-gray-900 px-8 py-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            <span>
              Created: {new Date(company.createdAt).toLocaleDateString()}
            </span>
            <Badge variant="secondary">ID: {company._id}</Badge>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

const InfoItem = ({ icon, label, children }) => (
  <div className="flex items-center space-x-3">
    {icon}
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-base font-semibold text-gray-900 dark:text-white">
        {children}
      </p>
    </div>
  </div>
);

const SocialItem = ({ icon, platform, handle }) => (
  <div className="flex items-center space-x-3">
    {icon}
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {platform}
      </p>
      <a
        className="text-base font-semibold hover:underline text-blue-600"
        href={handle}
        target="_blank"
        rel="noopener noreferrer"
      >
        {platform} 
      </a>
    </div>
  </div>
);

export default CompanyDetails;
