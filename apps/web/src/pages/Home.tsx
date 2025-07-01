import Navbar from '../components/layout/navbar';
import Hero from '../components/layout/hero';
import Features from '../components/layout/features';
import Solutions from '../components/layout/solutions';
import Results from '../components/layout/results';
import UseCases from '../components/layout/useCases';
import Pricing from '../components/layout/pricing';
import CTA from '../components/layout/cta';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Solutions />
      <Results />
      <UseCases />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
};

export default Home;