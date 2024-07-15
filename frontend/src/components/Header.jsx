import React from "react";

export function Header({ label }) {
  return (
    <header className="left-0 w-full bg-white  p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        <h1 className="text-left text-2xl font-semibold">{label}</h1>
      </div>
    </header>
  );
}
