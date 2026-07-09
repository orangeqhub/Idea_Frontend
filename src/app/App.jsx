import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const PublicLayout = lazy(() => import('@/layouts/PublicLayout'));
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));

const Home = lazy(() => import('@/pages/public/Home'));
const Members = lazy(() => import('@/pages/public/Members'));
const MemberDetail = lazy(() => import('@/pages/public/MemberDetail'));
const Events = lazy(() => import('@/pages/public/Events'));
const EventDetail = lazy(() => import('@/pages/public/EventDetail'));
const About = lazy(() => import('@/pages/public/About'));
const Contact = lazy(() => import('@/pages/public/Contact'));

const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const HeadTable = lazy(() => import('@/pages/admin/HeadTable'));
const AdminMembers = lazy(() => import('@/pages/admin/Members'));
const AdminEvents = lazy(() => import('@/pages/admin/Events'));
const AdminEnquiries = lazy(() => import('@/pages/admin/Enquiries'));
const AdminContent = lazy(() => import('@/pages/admin/Content'));
const AdminSettings = lazy(() => import('@/pages/admin/Settings'));
const AdminTestimonials = lazy(() => import('@/pages/admin/Testimonials'));
const AdminCoordinators = lazy(() => import('@/pages/admin/Coordinators'));
const AdminChapters = lazy(() => import('@/pages/admin/Chapters'));

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-idea-ivory">
      <div className="w-8 h-8 border-2 border-idea-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/:slug" element={<MemberDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="chapters" element={<AdminChapters />} />
          <Route path="head-table" element={<HeadTable />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="coordinators" element={<AdminCoordinators />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
