import React from "react";

const ProfileHeader = ({ image, title }) => {
  return (
    <div className="profile-header">
      <h1 className="profile-title">{title}</h1>
      <img
        src={`${import.meta.env.BASE_URL}${image}`}
        alt="Profile"
        className="profile-image"
      />
    </div>
  );
};

export default ProfileHeader;

