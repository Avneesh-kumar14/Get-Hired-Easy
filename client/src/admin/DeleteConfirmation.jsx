import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const DeleteConfirmation = ({ open, onOpenChange, onConfirm, companyName }) => {
  if (!open) return null;

  return (
    <div className="fixed h-[70vh] inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="sm:w-[400px] w-[250px] dark:bg-gray-800 dark:text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="text-red-500" />
              <span>Delete Confirmation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="dark:text-gray-300 text-gray-700">
              Are you sure you want to delete {companyName}?
            </p>
            <p className="text-sm dark:text-gray-400 text-gray-800 mt-2">
              You will be permanently removing this company and all associated data.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmation;