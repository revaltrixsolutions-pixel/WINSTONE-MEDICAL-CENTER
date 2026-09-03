import HomepageAbout from "@/features/public/components/home/HomepageAbout.tsx";
import HomepageContact from "@/features/public/components/home/HomepageContact.tsx";
import HomepageDoctors from "@/features/public/components/home/HomepageDoctors.tsx";
import HomepageHero from "@/features/public/components/home/HomepageHero.tsx";
import HomepageServices from "@/features/public/components/home/HomepageServices.tsx";
import HomepageWhyChooseUs from "@/features/public/components/home/HomepageWhyChooseUs.tsx";
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




