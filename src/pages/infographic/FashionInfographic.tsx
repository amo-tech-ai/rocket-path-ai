import Slide01Hero from "@/components/infographic/Slide01Hero";
import Slide02TariffShock from "@/components/infographic/Slide02TariffShock";

const FashionInfographic = () => {
  return (
    <main className="w-full overflow-x-hidden scroll-smooth">
      {/* Slide 01: Hero — Fashion's Crossroads */}
      <Slide01Hero />

      {/* Slide 02: Tariff Shock */}
      <Slide02TariffShock />
    </main>
  );
};

export default FashionInfographic;
