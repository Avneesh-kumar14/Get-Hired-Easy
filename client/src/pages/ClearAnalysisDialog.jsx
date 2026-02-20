import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ClearAnalysisDialog = ({ open, onOpenChange, onConfirm, isLoading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="sm:w-[450px] w-[280px] dark:bg-gray-800 dark:text-white bg-white border border-gray-200 dark:border-gray-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex items-center space-x-3 text-lg">
              <AlertCircle className="text-blue-600 dark:text-blue-400 h-5 w-5" />
              <span>Clear Analysis?</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">
              Are you sure you want to clear your resume analysis?
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This will remove:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 ml-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>All analysis results and suggestions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Uploaded resume file</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Improved resume file</span>
              </li>
            </ul>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-4 font-medium">
              ⚠️ This action cannot be undone.
            </p>
          </CardContent>

          <CardFooter className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 pt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="px-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-6 bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isLoading ? "Clearing..." : "Clear & Start Over"}</span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ClearAnalysisDialog;
