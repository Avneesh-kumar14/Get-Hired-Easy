import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
  Tooltip as RechartsTooltip
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Plus, Clock, CheckCircle, Users } from "lucide-react";
import JobsTable from "./JobsTable";
import { useSelector } from "react-redux";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#6366F1"];
const CHART_HEIGHT = 300;

const ChartCard = ({ title, children }) => (
  <Card className="shadow-lg bg-white/30 dark:bg-gray-950/30">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const AdminJobs = () => {
  const navigate = useNavigate();
  useGetAllAdminJobs();
  const { allAdminJobs } = useSelector((store) => store.job);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobMetrics, setJobMetrics] = useState({
    companyData: [],
    activeJobs: 0,
    expiredJobs: 0,
    totalActiveApplications: 0
  });

  const isJobExpired = (job) => {
    if (!job.expiryDate) return false;
    return new Date(job.expiryDate) < new Date();
  };

  useEffect(() => {
    if (!allAdminJobs?.length) return;

    const activeJobs = allAdminJobs.filter(job => !isJobExpired(job));
    const expiredJobs = allAdminJobs.filter(job => isJobExpired(job));

    // Only consider active jobs for the company data
    const jobsByCompany = activeJobs.reduce((acc, job) => {
      const companyName = job.company?.name || "Unknown";
      const applicantsCount = job.applications?.length || 0;
      
      if (!acc[companyName]) {
        acc[companyName] = { name: companyName, applicants: applicantsCount, jobs: 1 };
      } else {
        acc[companyName].applicants += applicantsCount;
        acc[companyName].jobs += 1;
      }
      return acc;
    }, {});

    // Calculate total applications for active jobs
    const totalActiveApplications = activeJobs.reduce((total, job) => 
      total + (job.applications?.length || 0), 0);

    setJobMetrics({
      companyData: Object.values(jobsByCompany)
        .sort((a, b) => b.applicants - a.applicants)
        .slice(0, 7)
        .map(company => ({
          name: company.name,
          value: company.applicants
        })),
      activeJobs: activeJobs.length,
      expiredJobs: expiredJobs.length,
      totalActiveApplications
    });
  }, [allAdminJobs]);
  
  useEffect(() => {
    if (!allAdminJobs) return;

    const filtered = allAdminJobs.filter(job => {
      const matchesSearch = !searchText ? true : (
        job?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        job?.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(searchText.toLowerCase())
      );

      const matchesTab = activeTab === "active" ? !isJobExpired(job) : isJobExpired(job);
      
      return matchesSearch && matchesTab;
    });

    setFilteredJobs(filtered);
  }, [searchText, allAdminJobs, activeTab]);

  const Stats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-white/30 dark:bg-gray-950/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
              <div>
                <p className="text-sm font-medium">Active Jobs</p>
                <p className="text-2xl font-bold">{jobMetrics.activeJobs}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white/30 dark:bg-gray-950/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500 mr-2" />
              <div>
                <p className="text-sm font-medium">Active Applications</p>
                <p className="text-2xl font-bold">{jobMetrics.totalActiveApplications}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white/30 dark:bg-gray-950/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-500 mr-2" />
              <div>
                <p className="text-sm font-medium">Expired Jobs</p>
                <p className="text-2xl font-bold">{jobMetrics.expiredJobs}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-4 md:mb-0">
            <Briefcase className="mr-2 h-6 w-6 text-blue-500" />
            Job Management Dashboard
          </h1>
          <Button
            onClick={() => navigate("/admin/jobs/create")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4 text-white" />
            <p className="text-white">Post New Job</p>
          </Button>
        </div>
      </motion.div>

      <Stats />

      {jobMetrics.companyData.length > 0 && (
        <div className="mb-6">
          <ChartCard title="Active Job Applications by Company">
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <PieChart>
                <Pie
                  data={jobMetrics.companyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  dataKey="value"
                >
                  {jobMetrics.companyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Search Jobs</h2>
        <Input
          type="text"
          placeholder="Search by title, description, or company..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-4 bg-white/30 dark:bg-gray-950/30"
        />
        
        <Tabs defaultValue="active" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Active Jobs
            </TabsTrigger>
            <TabsTrigger value="expired" className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Expired Jobs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <JobsTable jobs={filteredJobs} />
          </TabsContent>
          <TabsContent value="expired">
            <JobsTable jobs={filteredJobs} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminJobs;