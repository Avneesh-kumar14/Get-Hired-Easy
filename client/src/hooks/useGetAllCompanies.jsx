import { apiClient } from "@/lib/apiClient";
import { setCompanies } from "@/store/slices/companySlice";
import { GET_ALL_COMPANIES_ROUTE } from "@/utils/constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await apiClient.get(GET_ALL_COMPANIES_ROUTE, {
          withCredentials: true,
        });
        if (response.data.success) {
          dispatch(setCompanies(response.data.companies));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCompanies();
  }, [dispatch]);
};

export default useGetAllCompanies;
