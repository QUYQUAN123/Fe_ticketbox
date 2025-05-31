import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import OrganizerSignUp from "../pages/OrganizerSignUp";
import DetailEvent from "../pages/DetailEvent";
import GuestHome from "../pages/GuestHome";
import CreateEvent from "../pages/CreateEvent";
import EventInfo from "../pages/event-create/EventInfo";
import TicketAndTime from "../pages/event-create/TicketAndTime";
import SettingEvent from "../pages/event-create/SettingEvent";
import ApproveEvent from "../pages/event-create/ApproveEvent";
import InfoPaymentEvent from "../pages/event-create/InfoPaymentEvent";
import MyEvent from "../pages/event-create/MyEvent";
import MyRevenue from "../pages/event-create/MyRevenue";
import AdminRevenue from "../pages/event-create/AdminRevenue";
import MyAccount from "../pages/MyAccount";
import UserManager from "../pages/event-create/UserManager";
import TicketManager from "../pages/event-create/TicketManager";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed";
import MyTickets from "../pages/MyTickets";

export const listRouter = [
  { path: "/login", element: <Login /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/organizer-sign-up", element: <OrganizerSignUp /> },
  { path: "/event-info", element: <EventInfo /> },
  { path: "/ticket-and-time", element: <TicketAndTime /> },
  { path: "/info-payment-event", element: <InfoPaymentEvent /> },
  { path: "/setting-event", element: <SettingEvent /> },
  { path: "/approve-event", element: <ApproveEvent /> },
  { path: "/my-event", element: <MyEvent /> },
  { path: "/my-revenue", element: <MyRevenue /> },
  { path: "/my-tickets", element: <MyTickets /> },
  { path: "/my-review", element: <TicketManager /> },
  { path: "/admin-revenue", element: <AdminRevenue /> },
  { path: "/admin-manager-user", element: <UserManager /> },
  { path: "/admin-manager-ticket", element: <TicketManager /> },

  { path: "/event/create", element: <CreateEvent /> },
  { path: "/event/:id", element: <DetailEvent /> },
  { path: "/account/:id", element: <MyAccount /> },
  { path: "/payment-success", element: <PaymentSuccess /> },
  { path: "/payment-failed", element: <PaymentFailed /> },
  { path: "/", element: <GuestHome /> },
];
