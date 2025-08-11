import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_51Rud5g0F6kBP6SN7lfvJSE8tplrXJKket3rJPrPJwVzic4lliXKJ7XDNcunPYrTHzTRjt1xWHQCRdsQKWnrCOrF400ISYrEuhN");


createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
