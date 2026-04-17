/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Subscription from './pages/Subscription';
import Search from './pages/Search';
import PropertyDetails from './pages/PropertyDetails';
import CreateProperty from './pages/CreateProperty';
import UserManagement from './pages/admin/UserManagement';
import PropertyApprovals from './pages/admin/PropertyApprovals';
import ViewProfile from './pages/admin/ViewProfile';
import Profile from './pages/Profile';
import PaypalCheckout from './pages/PaypalCheckout';
import About from './pages/About';
import Support from './pages/Support';
import AdminRoute from './components/AdminRoute';
import UserSubscriptionChecker from './components/UserSubscriptionChecker';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/paypal-checkout" element={<PaypalCheckout />} />
          
          {/* Global Subscription Check for Sellers and Brokers */}
          <Route element={<UserSubscriptionChecker />}>
            <Route path="/search" element={<Search />} />
            <Route path="/property-details" element={<PropertyDetails />} />
            <Route path="/property-details/:propertyId" element={<PropertyDetails />} />
            <Route path="/create-property" element={<CreateProperty />} />
            
            {/* Admin pages */}
            <Route path="/admin/user-management" element={<UserManagement />} />
            <Route path="/admin/user-management/:userId/profile" element={<ViewProfile />} />
            <Route path="/admin/property-approvals" element={<PropertyApprovals />} />

            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
