import React, { useState } from 'react';

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open = false, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(open);
  const isOpen = onOpenChange ? open : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <DialogContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ asChild, children, ...props }: any) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error('DialogTrigger must be used within Dialog');

  return (
    <div onClick={() => context.setOpen(true)} {...props}>
      {children}
    </div>
  );
}

export function DialogContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error('DialogContent must be used within Dialog');

  if (!context.open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => context.setOpen(false)}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()} {...props}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="mb-4" {...props}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className="text-lg font-bold" {...props}>
      {children}
    </h2>
  );
}
