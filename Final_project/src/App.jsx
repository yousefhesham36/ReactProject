import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavBar, Layout } from "@components";
import {
  HomePage,
  Login,
  Register,
  Profile,
  PostList,
  SinglePost,
} from "@pages";
import AuthGurdRoute from "./components/AuthGurd";
import CreatePost from "./Pages/CreatePost";
import EditPost from "./Pages/EditPost";

function App() {
  return (
    <Router>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<AuthGurdRoute />}>
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route
              path="/posts"
              element={
                <Layout>
                  <PostList />
                </Layout>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <Layout>
                  <SinglePost />
                </Layout>
              }
            />
          </Route>
          <Route
            path="/posts/:id/edit"
            element={
              <Layout>
                <EditPost />
              </Layout>
            }
          />



        </Routes>
      </div>
    </Router>
  );
}

export default App;
