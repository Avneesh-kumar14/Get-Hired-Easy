import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        duration: 2000, 
        classNames: {
          toast:
            "group toast relative p-4 bg-white bg-gray-500 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md rounded-md",
          description: "text-gray-600 dark:text-gray-300",
        },
        renderToast: (toastContent) => (
          <div className="relative">
            {toastContent}
            <button
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
              aria-label="Close"
              onClick={() => toastContent.dismiss()} 
            >
              &times;
            </button>
          </div>
        ),
      }}
      {...props}
    />
  );
};

export { Toaster };