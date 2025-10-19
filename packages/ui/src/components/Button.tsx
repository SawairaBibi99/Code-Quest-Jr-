import React from 'react';
export default function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="px-5 py-3 rounded-xl bg-orange-400 text-white shadow active:translate-y-0.5 transition" {...props}>
      {children}
    </button>
  );
}
