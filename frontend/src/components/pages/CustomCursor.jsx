import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

 useEffect(() => {
   const moveCursor = (e) => {
     setPosition({ x: e.clientX, y: e.clientY });
   };

   const handleMouseOver = (e) => {
     if (e.target.closest("a, button")) {
       setHover(true);
     } else {
       setHover(false);
     }
   };

   document.addEventListener("mousemove", moveCursor);
   document.addEventListener("mouseover", handleMouseOver);

   return () => {
     document.removeEventListener("mousemove", moveCursor);
     document.removeEventListener("mouseover", handleMouseOver);
   };
 }, []);

  return (
    <>
      {/* Small Dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 bg-blue-600 rounded-full pointer-events-none z-[9999]"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      ></div>

      {/* Big Circle */}
      <div
        className={`fixed top-0 left-0 w-8 h-8 border border-blue-600 rounded-full pointer-events-none z-[9998] transition-all duration-200 ${
          hover ? "scale-150 bg-blue-200/30 border-blue-500" : ""
        }`}
        style={{
          transform: `translate(${position.x - 12}px, ${position.y - 12}px)`,
        }}
      ></div>
    </>
  );
};

export default CustomCursor;
