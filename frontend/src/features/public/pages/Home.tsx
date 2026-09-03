import HomepageAbout from "../components/home/HomepageAbout.tsx";
import HomepageContact from "../components/home/HomepageContact.tsx";
import HomepageDoctors from "../components/home/HomepageDoctors.tsx";
import HomepageHero from "../components/home/HomepageHero.tsx";
import HomepageServices from "../components/home/HomepageServices.tsx";
import HomepageWhyChooseUs from "../components/home/HomepageWhyChooseUs.tsx";
import HomepageFooter from "@/layout/HomepageFooter.tsx";
import HomepageHeader from "@/layout/HomepageHeader.tsx";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader />

      <main>
        <HomepageHero />
        <HomepageServices />
        <HomepageAbout />
        <HomepageDoctors />
        <HomepageWhyChooseUs />
        <HomepageContact />
      </main>

      <HomepageFooter />
    </div>
  );
}




