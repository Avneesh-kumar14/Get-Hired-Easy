import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import CompanyCard from "./CompanyCard";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { DELETE_COMPANY_BY_ID } from "@/utils/constants";
import { removeCompany } from "@/store/slices/companySlice";
import { removeCompanyJobs } from "@/store/slices/jobSlice";
import DeleteConfirmation from "./DeleteConfirmation";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";

const CompaniesTable = ({ searchedText }) => {
  useGetAllCompanies();
  // useGetAllAdminJobs();
  const dispatch = useDispatch();
  const { companies } = useSelector((store) => store.company);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;

    try {
      const response = await apiClient.delete(`${DELETE_COMPANY_BY_ID}/${companyToDelete._id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(removeCompany(companyToDelete._id));
        dispatch(removeCompanyJobs(companyToDelete._id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setDeleteConfirmOpen(false);
      setCompanyToDelete(null);
    }
  };

  useEffect(() => {
    if (Array.isArray(companies)) {
      const filtered = companies.filter((company) =>
        company?.name?.toLowerCase().includes(searchedText.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchedText, companies]);

  if (!Array.isArray(companies) || companies.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-white">
          No companies registered yet
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Get started by adding your first company.
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div layout className="space-y-4">
        <AnimatePresence>
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company?._id}
              company={company}
              onDelete={() => handleDeleteClick(company)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      <DeleteConfirmation
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        companyName={companyToDelete?.name}
      />
    </>
  );
};

export default CompaniesTable;