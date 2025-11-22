import { apiClient } from "@/lib/apiClient";
import { setSingleCompany } from "@/store/slices/companySlice";
import { GET_SINGLE_COMPANY_ROUTE } from "@/utils/constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getSingleCompany = async () => {
      try {
        const response = await apiClient.get(
          `${GET_SINGLE_COMPANY_ROUTE}/${companyId}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          dispatch(setSingleCompany(response.data.company));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSingleCompany();
  }, [dispatch,companyId]);
};

export default useGetCompanyById;
