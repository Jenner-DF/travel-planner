"use client";

import { useState } from "react";

export default function Page() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>
        {count} CLICK ME FUCKER!
      </button>
    </div>
  );
}
