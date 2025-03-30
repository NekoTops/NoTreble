import React from "react";
//import NavLink from "./NavLink";
import Link from "next/link";
import "../cs/LevelButton.css"

function LevelButton(props) {
  return (
      <Link href={props.address}>
        <div
          className=" lvlBtn col-span-1 text-semibold w-60 bg-[#455090] text-white   
        rounded-lg hover:bg-[#102437] shadow-md "
        style={{ display: 'block', margin: 'auto', marginBottom: '20px', marginTop: '10px', height: '10vh'}}
        >
        <p>Level {props.level}</p>
        </div>
      </Link>
  );
}
export default LevelButton;
