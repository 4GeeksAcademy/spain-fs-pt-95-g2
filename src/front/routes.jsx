import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

{/* Nested Routes: Defines sub-routes within the BaseHome component. */ }

import { Layout } from "./pages/Layout";
import MainScreen from "./pages/MainScreen";
import { Demo } from "./pages/Demo";
import Profile from "./pages/Profile";
import ExternalProducts from "./pages/ExternalProducts";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { ResetPassword } from "./pages/ResetPassword";
import Navigation from "./components/Navigation";

 // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.
    // Root Route: All navigation will start from here.

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route index element={<MainScreen />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/external-products" element={<ExternalProducts />} />
      <Route path="/navigation" element={<Navigation />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Route>
  )
);
