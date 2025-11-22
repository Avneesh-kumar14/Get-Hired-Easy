import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Award,
  Building,
  Loader2,
  Calendar,
} from "lucide-react";
import { useLocationData } from "@/hooks/useLocationData";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { useNavigate } from "react-router-dom";
import { POST_JOB_ROUTE } from "@/utils/constants";

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FormInput = ({ label, name, value, onChange, icon: Icon, ...props }) => {
  return (
    <motion.div variants={inputVariants} initial="hidden" animate="visible">
      <Label
        htmlFor={name}
        className="flex items-center text-gray-700 dark:text-gray-300"
      >
        <Icon className="mr-2" size={18} />
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 bg-white/80 dark:bg-gray-950/80"
        {...props}
      />
    </motion.div>
  );
};

const FormSelect = ({ label, name, value, onChange, icon: Icon, options }) => {
  return (
    <motion.div variants={inputVariants} initial="hidden" animate="visible">
      <Label
        htmlFor={name}
        className="flex items-center text-gray-700 dark:text-gray-300"
      >
        <Icon className="mr-2" size={18} />
        {label}
      </Label>
      <Select
        onValueChange={(value) => onChange({ target: { name, value } })}
        value={value}
      >
        <SelectTrigger className="mt-1 bg-white/80 dark:bg-gray-950/80 ">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
};

const PostJob = () => {
  const { companies } = useSelector((store) => store.company);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    experience: "",
    salary: "",
    position: 0,
    expiryDate: "",
    jobType: "",
    location: "",
    companyId: "",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const {
    countries,
    states,
    cities,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
  } = useLocationData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "position" ? Number(value) : value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      setCountry(value);
      handleCountryChange(value);
      setState("");
      setCity("");
    } else if (name === "state") {
      setState(value);
      handleStateChange(value);
      setCity("");
    } else if (name === "city") {
      setCity(value);
      handleCityChange(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const fullLocation = [formData.location, city, state, country]
      .filter(Boolean)
      .join(", ");
    const finalFormData = {
      ...formData,
      location: fullLocation,
    };
    try {
      const response = await apiClient.post(POST_JOB_ROUTE, finalFormData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const jobTypeOptions = [
    { value: "internship", label: "Internship" },
    { value: "part-time", label: "Part-time" },
    { value: "full-time", label: "Full-time" },
    { value: "contract", label: "Contract Work" },
    { value: "freelance", label: "Freelance Work" },
  ];

  return (
    <Card className="w-full max-w-6xl mx-auto my-8 bg-white/40 dark:bg-gray-950/40 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          Post a New Job
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              icon={Briefcase}
              placeholder="e.g. Senior React Developer"
            />
            <FormSelect
              label="Company"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              icon={Building}
              options={companies.map((company) => ({
                value: company._id,
                label: company.name,
              }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Experience Level"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              icon={Award}
              placeholder="e.g. 3-5 years"
            />
            <FormSelect
              label="Job Type"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              icon={Clock}
              options={jobTypeOptions}
            />
          </div>

          <motion.div
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <Label
              htmlFor="description"
              className="flex items-center text-gray-700 dark:text-gray-300"
            >
              <Clock className="mr-2" size={18} />
              Job Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role and responsibilities"
              className="mt-1 bg-white/80 dark:bg-gray-950/80 "
            />
          </motion.div>

          <motion.div
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <Label
              htmlFor="requirements"
              className="flex items-center text-gray-700 dark:text-gray-300"
            >
              <Award className="mr-2" size={18} />
              Requirements
            </Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List the key requirements for this position"
              className="mt-1 bg-white/80 dark:bg-gray-950/80 "
            />
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="Salary Range"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              icon={DollarSign}
              placeholder="e.g. $80,000 - $120,000"
            />
            <FormInput
              label="Expiration Date(mm/dd/yyyy)"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              icon={Calendar}
              type="date"
              placeholder="Enter the expiration date"
            />

            <FormInput
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              icon={Briefcase}
              type="number"
              placeholder="Enter position number"
            />
          </motion.div>

          <FormInput
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            icon={MapPin}
            placeholder="Enter location"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormSelect
              label="Country"
              name="country"
              value={country}
              onChange={handleLocationChange}
              icon={MapPin}
              options={countries.map((country) => ({
                value: country.country_name,
                label: country.country_name,
              }))}
            />
            {country && (
              <FormSelect
                label="State"
                name="state"
                value={state}
                onChange={handleLocationChange}
                icon={MapPin}
                options={states.map((state) => ({
                  value: state.state_name,
                  label: state.state_name,
                }))}
              />
            )}
            {state && (
              <FormSelect
                label="City"
                name="city"
                value={city}
                onChange={handleLocationChange}
                icon={MapPin}
                options={cities.map((city) => ({
                  value: city.city_name,
                  label: city.city_name,
                }))}
              />
            )}
          </div>

          <motion.div
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-end"
          >
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                "Post Job"
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostJob;
