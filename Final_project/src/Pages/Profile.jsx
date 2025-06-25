import { useEffect, useState } from "react";
import { getMe, updateUserAPI } from "@/api/user";
import Swal from "sweetalert2";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getMe();
        setUser(res.data);
        setName(res.data.name || "");
        setUsername(res.data.username || "");
        setEmail(res.data.email || "");
        setPhone(res.data.phone || "");
        setAvatar(res.data.avatar || "");
      } catch (err) {
        console.error("❌ Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    try {
      await updateUserAPI(user.id, { name, username, phone, avatar });
      setUser({ ...user, name, username, phone, avatar });
      setEditMode(false);
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating your profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-center mt-5">🔄 Loading profile...</p>;
  if (!user)
    return (
      <p className="text-center text-danger mt-5">
        ❌ User not found
      </p>
    );

  return (
    <div className="card shadow-lg p-4 mx-auto mt-5" style={{ maxWidth: "650px" }}>
      <h2 className="text-center mb-4 text-primary">
        <i className="fa-solid fa-user-circle me-2"></i> Profile
      </h2>

      {editMode ? (
        <form onSubmit={handleSave}>
          <div className="text-center mb-4">
            <img
              src={avatar || "https://via.placeholder.com/120"}
              alt="Avatar Preview"
              className="rounded-circle border shadow mb-2"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={saving}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              disabled
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={saving}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Avatar URL</label>
            <input
              className="form-control"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              disabled={saving}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditMode(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <img
              src={user.avatar || "https://via.placeholder.com/120"}
              alt="Avatar"
              className="rounded-circle border shadow"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <div className="flex-grow-1">
              <div className="mb-3">
                <i className="fa-solid fa-user text-secondary me-2"></i>
                <strong>Name:</strong> {user.name}
              </div>
              <div className="mb-3">
                <i className="fa-solid fa-at text-secondary me-2"></i>
                <strong>Username:</strong> {user.username}
              </div>
              <div className="mb-3">
                <i className="fa-solid fa-envelope text-secondary me-2"></i>
                <strong>Email:</strong> {user.email}
              </div>
              <div className="mb-3">
                <i className="fa-solid fa-phone text-secondary me-2"></i>
                <strong>Phone:</strong> {user.phone}
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <button
              className="btn btn-primary"
              onClick={() => setEditMode(true)}
            >
              <i className="fa-solid fa-pen me-1"></i> Edit Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
}
