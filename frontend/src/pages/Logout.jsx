import { useEffect } from 'react'

export const Logout = () => {
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userType");
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/";
  }, []);
  return (
    <div></div>
  )
}
