import BrowseCategories from "@/components/homepage/BrowseCategories";
import Banner from "@/components/homepage/banner";
// import BrowseCategories from "@/components/homepage/BrowseCategories";
import FeaturedStudios from "@/components/homepage/FeaturedStudios";

export default function Home() {
  return (
    <main>
      <Banner />
      <BrowseCategories />
      <FeaturedStudios />
    </main>
  );
}
