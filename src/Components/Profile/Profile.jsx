import React, { useEffect, useState } from "react";
import "./Profile.css";
import { FaUserCircle } from "react-icons/fa";
import { auth } from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import ColorSwitcher from "../ColorSwitcher/ColorSwitcher";

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  const logout = () => {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Logout Successful!");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [color, setColor] = useState({
    "--primary-purple": "#6842ef",
    "--primary-purple-shade": "#8161f4",
  });

  const handleColorChange = (colors) => {
    Object.entries(colors).forEach(([variable, color]) => {
      document.documentElement.style.setProperty(variable, color);
    });
    setColor(colors);
  };

  return (
    <div className="profile-feature">
      {user && (
        <div className="user-profile">
          {user.photoURL ? (
            <img src={user.photoURL} alt="user-profile" className="img" />
          ) : (
            <FaUserCircle className="no-photo" />
          )}
        </div>
      )}
      <div className="buttons">
        {user && (
          <>
            <h4>{user.displayName ? user.displayName : user.email}</h4>
            <p onClick={logout} className="logout-btn">
              Logout
            </p>
          </>
        )}
      </div>
      <ColorSwitcher handleColorChange={handleColorChange} />
    </div>
  );
};

export default Profile;
