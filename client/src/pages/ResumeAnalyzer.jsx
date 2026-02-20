import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  RefreshCw,
  Loader2,
  X,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/apiClient";
import {
  ANALYZE_RESUME_ROUTE,
  GET_RESUME_ANALYSIS_ROUTE,
  UPLOAD_IMPROVED_RESUME_ROUTE,
  APPLY_ANALYZED_RESUME_ROUTE,
  CLEAR_RESUME_ANALYSIS_ROUTE,
} from "@/utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "@/store/slices/authSlice";
import { toast } from "sonner";
import ClearAnalysisDialog from "./ClearAnalysisDialog";

const ResumeAnalyzer = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [improvedFile, setImprovedFile] = useState(null);
  const [step, setStep] = useState("upload"); // upload, analyzing, results
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Load existing analysis on mount
  useEffect(() => {
    if (isOpen && !analysis) {
      loadExistingAnalysis();
    }
  }, [isOpen]);

  const loadExistingAnalysis = async () => {
    try {
      const response = await apiClient.get(GET_RESUME_ANALYSIS_ROUTE, {
        withCredentials: true,
      });
      if (response.data.success && response.data.analysis) {
        setAnalysis(response.data.analysis);
        setStep("results");
      }
    } catch (error) {
      // Error loading existing analysis
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleAnalyzeResume = async () => {
    if (!uploadedFile) {
      toast.error("Please select a resume file");
      return;
    }

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await apiClient.post(
        ANALYZE_RESUME_ROUTE,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        setAnalysis(response.data.analysis);
        setStep("results");
        toast.success("Resume analyzed successfully!");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error analyzing resume";
      toast.error(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImprovedFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setImprovedFile(file);
    }
  };

  const handleUploadImprovedResume = async () => {
    if (!improvedFile) {
      toast.error("Please select an improved resume file");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", improvedFile);

    try {
      const response = await apiClient.post(
        UPLOAD_IMPROVED_RESUME_ROUTE,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Improved resume uploaded successfully!");
        setImprovedFile(null);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error uploading improved resume";
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyToProfile = async () => {
    setIsApplying(true);
    try {
      const response = await apiClient.post(
        APPLY_ANALYZED_RESUME_ROUTE,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(addUser(response.data.user));
        toast.success("Improved resume applied to your profile!");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error applying resume to profile";
      toast.error(errorMsg);
    } finally {
      setIsApplying(false);
    }
  };

  const handleClearAnalysisClick = () => {
    setShowClearDialog(true);
  };

  const handleClearAnalysis = async () => {
    setIsClearing(true);
    try {
      const response = await apiClient.delete(CLEAR_RESUME_ANALYSIS_ROUTE, {
        withCredentials: true,
      });

      if (response.data.success) {
        setAnalysis(null);
        setUploadedFile(null);
        setImprovedFile(null);
        setStep("upload");
        toast.success("Analysis cleared!");
        setShowClearDialog(false);
      }
    } catch (error) {
      toast.error("Failed to clear analysis. Please try again.");
    } finally {
      setIsClearing(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return (
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        );
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "skills":
        return "🎯";
      case "format":
        return "📋";
      case "content":
        return "✍️";
      case "keywords":
        return "🔑";
      case "structure":
        return "🏗️";
      default:
        return "📝";
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full p-4 shadow-lg z-40 flex items-center justify-center group"
      >
        <FileText className="h-6 w-6" />
        <span className="absolute right-16 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Analyze Resume
        </span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-950 rounded-2xl shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="h-6 w-6" />
                  <h2 className="text-2xl font-bold">Resume Analyzer</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 rounded-lg p-2 transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {step === "upload" && (
                  <UploadSection
                    uploadedFile={uploadedFile}
                    isAnalyzing={isAnalyzing}
                    onUpload={handleResumeUpload}
                    onAnalyze={handleAnalyzeResume}
                  />
                )}

                {step === "analyzing" && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Analyzing your resume...
                    </p>
                  </div>
                )}

                {step === "results" && analysis && (
                  <ResultsSection
                    analysis={analysis}
                    improvedFile={improvedFile}
                    isUploading={isUploading}
                    isApplying={isApplying}
                    onImprovedFileUpload={handleImprovedFileUpload}
                    onUploadImproved={handleUploadImprovedResume}
                    onApplyToProfile={handleApplyToProfile}
                    onClear={handleClearAnalysisClick}
                    getPriorityColor={getPriorityColor}
                    getCategoryIcon={getCategoryIcon}
                    getScoreColor={getScoreColor}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Analysis Dialog */}
      <ClearAnalysisDialog 
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        onConfirm={handleClearAnalysis}
        isLoading={isClearing}
      />
    </>
  );
};

const UploadSection = ({
  uploadedFile,
  isAnalyzing,
  onUpload,
  onAnalyze,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upload Your Resume
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Get instant feedback and suggestions to improve your resume
        </p>
      </div>

      {/* Upload Area */}
      <div className="relative">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PDF, DOC, DOCX (Max 5MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={onUpload}
            accept=".pdf,.doc,.docx,.txt"
          />
        </label>
      </div>

      {/* Selected File */}
      {uploadedFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 flex items-center space-x-3"
        >
          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              {uploadedFile.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {(uploadedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </motion.div>
      )}

      {/* Analyze Button */}
      <Button
        onClick={onAnalyze}
        disabled={!uploadedFile || isAnalyzing}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Zap className="h-5 w-5 mr-2" />
            Analyze Resume
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Your resume will be analyzed for format, content, skills, and ATS
        optimization
      </p>
    </motion.div>
  );
};

const ResultsSection = ({
  analysis,
  improvedFile,
  isUploading,
  isApplying,
  onImprovedFileUpload,
  onUploadImproved,
  onApplyToProfile,
  onClear,
  getPriorityColor,
  getCategoryIcon,
  getScoreColor,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Score Card */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <ScoreCard
          label="Resume Score"
          value={analysis.score}
          icon={<Award className="h-6 w-6" />}
          color={getScoreColor(analysis.score)}
        />
        <ScoreCard
          label="Skills Found"
          value={analysis.skillsFound || 0}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <ScoreCard
          label="Metrics"
          value={analysis.metricsFound || 0}
          icon={<CheckCircle2 className="h-6 w-6" />}
        />
        <ScoreCard
          label="Sections"
          value={analysis.sectionCount || 0}
          icon={<FileText className="h-6 w-6" />}
        />
      </div>

      <Separator />

      {/* Suggestions */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <AlertCircle className="h-6 w-6 mr-2 text-blue-600" />
          Improvement Suggestions
        </h3>

        {analysis.suggestions && analysis.suggestions.length > 0 ? (
          <div className="space-y-3">
            {analysis.suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <span className="text-2xl flex-shrink-0">
                    {getCategoryIcon(suggestion.category)}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {suggestion.title}
                      </h4>
                      <Badge className={getPriorityColor(suggestion.priority)}>
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="text-green-800 dark:text-green-300 font-semibold">
              Your resume looks great! Keep it polished and up-to-date.
            </p>
          </div>
        )}
      </div>

      <Separator />

      {/* Improved Resume Upload */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Upload Improved Resume
        </h3>
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/40 transition-colors group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Click to upload improved resume
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PDF, DOC, DOCX
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={onImprovedFileUpload}
              accept=".pdf,.doc,.docx,.txt"
            />
          </label>

          {improvedFile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-3 flex items-center space-x-3"
            >
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {improvedFile.name}
              </p>
            </motion.div>
          )}

          <Button
            onClick={onUploadImproved}
            disabled={!improvedFile || isUploading}
            variant="outline"
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Improved Resume
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-3 pt-4">
        <Button
          onClick={onApplyToProfile}
          disabled={isApplying}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
        >
          {isApplying ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Applying...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Apply to My Profile
            </>
          )}
        </Button>

        <Button
          onClick={onClear}
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Clear & Start Over
        </Button>
      </div>
    </motion.div>
  );
};

const ScoreCard = ({ label, value, icon, color = "text-blue-600" }) => (
  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-900">
    <CardContent className="pt-6 pb-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </p>
        <div className={`${color}`}>{icon}</div>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </CardContent>
  </Card>
);

export default ResumeAnalyzer;
