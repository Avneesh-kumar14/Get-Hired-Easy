import { apiClient } from "@/lib/apiClient";
import { getAllJobs, setAllSearchedJobs } from "@/store/slices/jobSlice";
import { GET_ALL_JOB_ROUTE } from "@/utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector(store => store.job);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        let url = GET_ALL_JOB_ROUTE;
        if (searchedQuery.length > 0) {
          url += `?keyword=${searchedQuery}`;
        }
        const response = await apiClient.get(url, {
          withCredentials: true,
        });
        // console.log(response)
        // console.log(url===GET_ALL_JOB_ROUTE)
        // console.log(response.data.jobs)
        if (response.data.success) {
          if(url===GET_ALL_JOB_ROUTE) dispatch(getAllJobs(response.data.jobs));
          else dispatch(setAllSearchedJobs(response.data.jobs))
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllJobs();
  }, [searchedQuery, dispatch]);
};

export default useGetAllJobs;