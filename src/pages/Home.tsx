import HomepageAbout from "../components/home/HomepageAbout";
import HomepageContact from "../components/home/HomepageContact";
import HomepageDoctors from "../components/home/HomepageDoctors";
import HomepageHero from "../components/home/HomepageHero";
import HomepageServices from "../components/home/HomepageServices";
import HomepageWhyChooseUs from "../components/home/HomepageWhyChooseUs";
import HomepageFooter from "../components/layout/HomepageFooter";
import HomepageHeader from "../components/layout/HomepageHeader";

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