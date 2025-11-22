import { apiClient } from "@/lib/apiClient";
import { setAllAdminJobs } from "@/store/slices/jobSlice";
import { GET_ALL_ADMIN_JOB_ROUTE } from "@/utils/constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getAdminJobs = async () => {
      try {
        const response = await apiClient.get(GET_ALL_ADMIN_JOB_ROUTE, {
          withCredentials: true,
        });
        if (response.data.success) {
          dispatch(setAllAdminJobs(response.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAdminJobs();
  }, [dispatch]);
};

export default useGetAllAdminJobs;
