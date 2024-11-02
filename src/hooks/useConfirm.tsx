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
        <div className="absolute top-0 z-20 flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="min-w-[25%] rounded-lg border border-white/20 bg-black p-5">
            <h1 className="text-3xl text-white">Attention!</h1>
            <p className="text-white">{message}</p>
            <div className="mt-4 flex justify-between">
              <button
                className="rounded bg-red-700 px-4 py-2 text-white"
                onClick={handleConfirm}
              >
                Yeah
              </button>
              <button
                className="rounded px-4 py-2 text-white"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
