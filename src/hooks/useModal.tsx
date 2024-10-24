import React, { useState, useContext, createContext, ReactNode } from "react";

const ModalContext =
  //   @ts-ignore
  createContext<(message: string) => Promise<boolean> | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
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
    <ModalContext.Provider value={confirm}>
      {children}
      {isVisible && (
        <div className="absolute top-0 z-20 flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-lg border border-white/20 bg-black p-5">
            <p
              className="text-white"
              dangerouslySetInnerHTML={{ __html: message }}
            ></p>
            <div className="mt-4 flex justify-between">
              <button
                className="rounded bg-green-700 px-4 py-2 text-white"
                onClick={handleConfirm}
              >
                Yeah
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};