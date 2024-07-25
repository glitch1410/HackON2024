import "../styles/globals.css";
import {NavBar, Footer} from '../Components';
import { DonationProvider } from "../Context/Donation"; 

export default function App({ Component, pageProps }) {
  return (
    <>
		<DonationProvider>
		<NavBar />
		<Component {...pageProps} />
		</DonationProvider>
    </>
  );
}
