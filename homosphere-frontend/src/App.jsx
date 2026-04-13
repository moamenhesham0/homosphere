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
import Profile from './pages/Profile';
import ReviewRequest from './pages/ReviewRequest';
import PaypalCheckout from './pages/PaypalCheckout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/paypal-checkout" element={<PaypalCheckout />} />
        <Route path="/search" element={<Search />} />
        <Route path="/property-details" element={<PropertyDetails />} />
        <Route path="/property-details/:propertyId" element={<PropertyDetails />} />
        <Route path="/create-property" element={<CreateProperty />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route path="/admin/property-approvals" element={<PropertyApprovals />} />
        <Route path="/admin/review-request" element={<ReviewRequest />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
