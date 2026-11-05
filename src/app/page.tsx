import BrowseCategories from "@/components/homepage/BrowseCategories";
import Banner from "@/components/homepage/banner";
import FeaturedStudios from "@/components/homepage/FeaturedStudios";
import HowItWorks from "@/components/homepage/HowItWorks";

export default function Home() {
  return (
    <main>
      <Banner />
      <BrowseCategories />
      <FeaturedStudios />
      <HowItWorks />
    </main>
  );
}
