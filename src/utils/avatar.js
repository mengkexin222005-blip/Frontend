import defaultProfileM from "../assets/images/default_profile_m.jpg";
import defaultProfileF from "../assets/images/default_profile_f.jpg";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export const buildProfileImageUrl = (profilePicture) => {
  if (!profilePicture) return "";
  if (/^https?:\/\//i.test(profilePicture)) return profilePicture;
  return `${API_BASE_URL}${profilePicture}`;
};

export const getProfileImage = (person = {}) => {
  if (person?.profilePicture) {
    return buildProfileImageUrl(person.profilePicture);
  }

  return person?.sex === "Female" ? defaultProfileF : defaultProfileM;
};