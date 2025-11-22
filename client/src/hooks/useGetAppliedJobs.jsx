import { apiClient } from "@/lib/apiClient";
import { setAllAppliedJobs } from "@/store/slices/jobSlice";
import { GET_APPLIED_JOB_ROUTE } from "@/utils/constants";
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchAppliedJobs = async () => {
            try {
                const res = await apiClient.get(`${GET_APPLIED_JOB_ROUTE}`, {withCredentials:true});
                // console.log(res)
                if(res.data.success){
                    dispatch(setAllAppliedJobs(res.data.application));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAppliedJobs();
    },[])
};
export default useGetAppliedJobs;