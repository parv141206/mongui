import React, { useState, useContext, createContext, ReactNode } from "react";

const ConfirmContext =
  // @ts-ignore
  createContext<(message: string) => Promise<boolean> | null>(null);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};

interface ConfirmProviderProps {
  children: ReactNode;
}

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = (msg: string): Promise<boolean> => {
    setMessage(msg);
    setIsVisible(true);

    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsVisible(false);
    if (resolvePromise) resolvePromise(true);
  };

  const handleCancel = () => {
    setIsVisible(false);
    if (resolvePromise) resolvePromise(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {isVisible && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-xl translate-x-[-50%] translate-y-[-50%] gap-6 rounded-sm border border-red-500/50 bg-black/30 p-8 shadow-lg shadow-red-500/30">
            <div className="flex flex-col space-y-3 text-center text-white sm:text-left">
              <h2 className="futura text-4xl font-bold leading-none tracking-tight text-red-500">
                Warning!
              </h2>
              <p className="body text-lg text-white">{message}</p>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:space-x-3">
              <button
                onClick={handleCancel}
                className="body rounded-sm border-2 border-white/20 bg-black/30 px-4 py-2 text-base text-white transition-all duration-500 hover:border-black hover:bg-white hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="body rounded-sm border-2 border-white/20 bg-black/30 px-4 py-2 text-base text-white transition-all duration-500 hover:border-black hover:bg-red-500 hover:text-black"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
