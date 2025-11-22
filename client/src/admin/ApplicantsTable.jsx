import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { apiClient } from "@/lib/apiClient";
import { UPDATE_APPLICATION_STATUS_ROUTE } from "@/utils/constants";
import { Card } from "@/components/ui/card";

const statusOptions = [
  { label: "All Applications", value: "all" },
  { label: "Pending Review", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

const ApplicationsTable = ({ applications = [], onStatusUpdate, readonly = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUpdating, setIsUpdating] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // Memoized filtered and sorted applications
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app?.applicant?.fullName?.toLowerCase().includes(searchLower) ||
          app?.applicant?.email?.toLowerCase().includes(searchLower) ||
          app?.applicant?.phoneNumber?.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (app) =>
          (statusFilter === "pending" &&
            (!app.status || app.status.toLowerCase() === "pending")) ||
          app.status?.toLowerCase() === statusFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "applicant.fullName") {
        aValue = a.applicant?.fullName || "";
        bValue = b.applicant?.fullName || "";
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [applications, searchTerm, statusFilter, sortConfig]);

  const handleStatusUpdate = async (applicationId, status) => {
    if (!applicationId || !onStatusUpdate) return;

    try {
      setIsUpdating(true);
      const res = await apiClient.post(
        `${UPDATE_APPLICATION_STATUS_ROUTE}/${applicationId}/update`,
        { status },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(`Application ${status.toLowerCase()} successfully`, {
          icon: status === "Accepted" ? "✅" : "❌",
        });
        // Notify parent component to refresh data
        await onStatusUpdate();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${status.toLowerCase()} application`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const variants = {
      accepted: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };

    const icons = {
      accepted: <CheckCircle className="h-3 w-3" />,
      rejected: <XCircle className="h-3 w-3" />,
      pending: null,
    };

    const statusLower = status?.toLowerCase() || "pending";

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${variants[statusLower]}`}
      >
        {icons[statusLower]}
        {status || "Pending"}
      </span>
    );
  };

  const ActionButtons = ({ application }) => {
    if (!application.status || application.status.toLowerCase() === "pending") {
      return (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 
                       hover:bg-green-50 dark:hover:bg-green-900/20 
                       border-green-200 dark:border-green-800 
                       transition-all duration-200 
                       shadow-sm hover:shadow-md
                       focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-500/40
                       disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUpdating}
            onClick={() => handleStatusUpdate(application._id, "Accepted")}
          >
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Accept
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 
                       hover:bg-red-50 dark:hover:bg-red-900/20 
                       border-red-200 dark:border-red-800 
                       transition-all duration-200 
                       shadow-sm hover:shadow-md
                       focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/40
                       disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUpdating}
            onClick={() => handleStatusUpdate(application._id, "Rejected")}
          >
            <XCircle className="h-4 w-4 mr-1.5" />
            Reject
          </Button>
        </div>
      );
    }
    return <StatusBadge status={application.status} />;
  };

  return (
    <div className="space-y-6 sm:p-4 w-full mx-auto">
      {/* Header and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Applications
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search applications..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white/40 dark:bg-gray-950/40 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Applicant</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Date</TableHead>
              {!readonly && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredApplications.map((application) => (
                <motion.tr
                  key={application._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="group hover:dark:bg-gray-950/75 hover:bg-gray-200"
                >
                  <TableCell>
                    <div className="font-medium">
                      {application?.applicant?.fullName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {application._id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        {application?.applicant?.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        {application?.applicant?.phoneNumber || "N/A"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={application.status} />
                  </TableCell>
                  <TableCell>
                    {application.applicant?.profile?.resume ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        asChild
                      >
                        <a
                          href={application.applicant.profile.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="h-4 w-4" />
                          Resume
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No Documents
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(application.createdAt), "dd MMM yyyy")}
                  </TableCell>
                  {!readonly && (
                    <TableCell className="text-right">
                      <ActionButtons application={application} />
                    </TableCell>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        <AnimatePresence>
          {filteredApplications.map((application) => (
            <motion.div
              key={application._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card className="p-4 space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex flex-col justify-between">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">
                        {application?.applicant?.fullName}
                      </h3>
                      <StatusBadge status={application.status} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {application?.applicant?.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {application?.applicant?.phoneNumber || "N/A"}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">
                    {format(new Date(application.createdAt), "dd MMM yyyy")}
                  </div>
                  {application.applicant?.profile?.resume ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      asChild
                    >
                      <a
                        href={application.applicant.profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-4 w-4" />
                        Resume
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No Documents
                    </span>
                  )}
                </div>

                {!readonly && (
                  <div className="flex justify-end pt-2">
                    <ActionButtons application={application} />
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results Message */}
      {filteredApplications.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No applications found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTable;