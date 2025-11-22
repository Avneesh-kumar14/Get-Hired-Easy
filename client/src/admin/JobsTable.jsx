import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Edit2, Trash2, Eye } from "lucide-react";
import moment from "moment";

const EmptyState = () => (
  <div className="text-center py-10">
    <img
      src="/api/placeholder/400/300"
      alt="No jobs"
      className="mx-auto mb-4 w-64 h-48 object-cover rounded-lg"
    />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      No jobs found
    </h3>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      Try adjusting your search or filters to find what you're looking for.
    </p>
  </div>
);

const JobRow = ({ job, onDelete }) => {
  const navigate = useNavigate();
  return (
    <motion.tr
      key={job._id}
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.3 }}
      className="transition-colors duration-200"
    >
      <TableCell className="text-gray-600 dark:text-gray-400">
        {job?.company?.name}
      </TableCell>
      <TableCell className="text-gray-600 dark:text-gray-400">
        {job?.title}
      </TableCell>
      <TableCell className="hidden sm:table-cell text-gray-600 dark:text-gray-400">
        {moment(job?.createdAt).format("YYYY-MM-DD")}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate(`/admin/jobs/${job?._id}/applicants`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>View Applicants</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(job?._id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </motion.tr>
  );
};

const JobsTable = ({ jobs }) => {
  const handleDelete = (id) => {};

  if (jobs?.length === 0) {
    return <EmptyState />;
  }
  return (
    <Card className="bg-white/50 dark:bg-gray-950/40">
      <CardHeader>
        <CardTitle>Registered Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-700 dark:text-gray-300">
                Company Name
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">
                Role
              </TableHead>
              <TableHead className="hidden sm:table-cell text-gray-700 dark:text-gray-300">
                Date
              </TableHead>
              <TableHead className="text-right text-gray-700 dark:text-gray-300">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {jobs?.map((job) => (
                <JobRow key={job._id} job={job} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default JobsTable;
