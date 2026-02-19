import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiClient } from "@/lib/apiClient";
import { GET_RESUME_ANALYSIS_ROUTE } from "@/utils/constants";

export const useGetResumeAnalysis = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const getResumeAnalysis = async () => {
      try {
        if (user?._id) {
          const response = await apiClient.get(GET_RESUME_ANALYSIS_ROUTE, {
            withCredentials: true,
          });
          if (response.data.success && response.data.analysis) {
            // You can dispatch this to a slice if needed
            console.log("Resume Analysis:", response.data.analysis);
          }
        }
      } catch (error) {
        console.error("Error fetching resume analysis:", error);
      }
    };

    if (user?.role === "student") {
      getResumeAnalysis();
    }
  }, [user?._id]);
};

export default useGetResumeAnalysis;
