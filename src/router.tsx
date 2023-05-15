import { Routes, Route } from "react-router-dom";
import Topics from "./pages/Topics";
import Producers from "./pages/Producers";
import Admins from "./pages/Admins";
import TopicDetails from "./pages/TopicDetails";
import { Role } from "./components/Auth";
import Errors from "./pages/Errors";

export default function _Routes({ role }: { role: Role }) {
  return (
    <Routes>
      <Route path="/" element={<Topics />} />
      <Route path="/producer" element={<Producers />} />
      {role === "owner" ? <Route path="/admin" element={<Admins />} /> : null}
      <Route path="/topic/details" element={<TopicDetails />} />
      <Route path="/errors" element={<Errors />} />
    </Routes>
  );
}
