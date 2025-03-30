import React from "react";
//import NavLink from "./NavLink";
import Link from "next/link";
import "../cs/LessonHeader.css"

function LessonHeader(props) {
  return (
        <div
          className=" lesson col-span-1 font-bold text-3xl text-center"
        >
        <p>{props.lesson}</p>
        </div>
  );
}
export default LessonHeader;

