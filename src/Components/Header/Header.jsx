import React, { useState } from "react";
import "./Header.css";
import { TbMoneybag } from "react-icons/tb";
import { AiFillSetting } from "react-icons/ai";
import Profile from "../Profile/Profile";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openOrder, setOpenOrder] = useState(0);

  const handleOpen = () => {
    if (openOrder === 0) {
      setIsOpen(true);
      setOpenOrder(1);
    } else if (openOrder === 1) {
      setIsOpen(false);
      setOpenOrder(0);
    }
  };

  return (
    <>
      <div className="navbar">
        <h1>
          Budgetize
          <TbMoneybag className="logo-image" />
        </h1>
        <AiFillSetting className="menu-btn" onClick={handleOpen} />
      </div>
      {isOpen && <Profile className="profile" />}
    </>
  );
};

export default Header;
