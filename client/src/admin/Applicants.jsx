import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setAllApplicants } from "@/store/slices/applicationSlice";
import { APPLICATION_ROUTE } from "@/utils/constants";
import { apiClient } from "@/lib/apiClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Users, CheckCircle, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ApplicantsTable from "./ApplicantsTable";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, className }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className={`bg-white/30 dark:bg-gray-950/30 rounded-xl p-4 shadow-lg transform perspective-1000 ${className}`}
    style={{
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
    }}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg ${className}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  </motion.div>
);

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const fetchAllApplicants = async () => {
    try {
      setError(null);
      const res = await apiClient.get(
        `${APPLICATION_ROUTE}/${params.id}/applicants`,
        { withCredentials: true }
      );
      dispatch(setAllApplicants(res.data.job));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch applicants");
      console.error("Error fetching applicants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllApplicants();
  }, [dispatch, params.id]);

  const getStatusCounts = () => {
    if (!applicants?.applications)
      return { pending: 0, accepted: 0, rejected: 0, total: 0 };
    return applicants.applications.reduce(
      (acc, app) => {
        const status = app.status?.toLowerCase() || "pending";
        acc[status] = (acc[status] || 0) + 1;
        acc.total = (acc.total || 0) + 1;
        return acc;
      },
      { pending: 0, accepted: 0, rejected: 0, total: 0 }
    );
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const getPendingApplications = () =>
    applicants?.applications?.filter(
      (app) => !app.status || app.status.toLowerCase() === "pending"
    ) || [];

  const getCompletedApplications = () =>
    applicants?.applications?.filter(
      (app) =>
        app.status?.toLowerCase() === "accepted" ||
        app.status?.toLowerCase() === "rejected"
    ) || [];

  return (
    <div className="space-y-6 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid text-white grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Applications"
          value={statusCounts.total}
          icon={Users}
          className="bg-green-500 dark:bg-blue-700/80 text-blue-600 dark:text-blue-300"
        />
        <StatCard
          title="Pending Review"
          value={statusCounts.pending}
          icon={Clock}
          className="bg-yellow-50 dark:bg-yellow-700/80 text-yellow-600 dark:text-yellow-300"
        />
        <StatCard
          title="Accepted"
          value={statusCounts.accepted}
          icon={CheckCircle}
          className="bg-green-50 dark:bg-green-700/80 text-green-600 dark:text-green-300"
        />
        <StatCard
          title="Response Rate"
          value={`${Math.round(
            ((statusCounts.accepted + statusCounts.rejected) /
              statusCounts.total) *
              100
          )}%`}
          icon={TrendingUp}
          className="bg-purple-50 dark:bg-purple-700/80 text-purple-600 dark:text-purple-300"
        />
      </motion.div>

      <Card className="bg-white/30 dark:bg-gray-950/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Applications Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full "
          >
            <TabsList className="grid w-full sm:grid-cols-3 gap-5 grid-cols-1 sm:mb-8 mb-32">
              <TabsTrigger value="all" className="dark:text-gray-300">
                All Applications
              </TabsTrigger>
              <TabsTrigger value="pending" className="dark:text-gray-300">
                Pending Review
              </TabsTrigger>
              <TabsTrigger value="completed" className="dark:text-gray-300">
                Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ApplicantsTable
                applications={applicants?.applications}
                onStatusUpdate={fetchAllApplicants}
              />
            </TabsContent>

            <TabsContent value="pending">
              <ApplicantsTable
                applications={getPendingApplications()}
                onStatusUpdate={fetchAllApplicants}
              />
            </TabsContent>

            <TabsContent value="completed">
              <ApplicantsTable
                applications={getCompletedApplications()}
                onStatusUpdate={fetchAllApplicants}
                readonly
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Applicants;
