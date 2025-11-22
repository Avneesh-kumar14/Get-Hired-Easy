import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { REGISTER_COMPANY_ROUTE } from "@/utils/constants";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/store/slices/companySlice";

const CreateNewCompany = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const registerNewCompany = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(
        REGISTER_COMPANY_ROUTE,
        { companyName },
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(setSingleCompany(response.data.company));
        toast.success(response.data.message);
        const companyId=response?.data?.company?._id
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white/40 dark:bg-gray-950/40 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Your Company Name
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        What would you like to name your company? You can change this later.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            type="text"
            id="companyName"
            className="w-full"
            placeholder="JobHunt, Microsoft etc."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-10">
        <Button variant="outline" onClick={() => navigate("/admin/companies")}>
          Cancel
        </Button>
        <Button onClick={registerNewCompany} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateNewCompany;
