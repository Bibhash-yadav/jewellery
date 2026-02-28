import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";

export default function Home() {

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 80,
      easing: "ease-out-cubic"
    });
  }, []);

  return (
    <div className="bg-black text-white overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center text-center">

        <img
          src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1600"
          className="absolute w-full h-full object-cover opacity-30"
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="relative px-6 max-w-3xl" data-aos="fade-up">

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Eternal Beauty,
            <br />
            <span className="text-yellow-500">Crafted in Gold</span>
          </h1>

          <p className="text-gray-300 mt-6 text-lg md:text-xl">
            Handcrafted jewelry designed to celebrate elegance, tradition, and modern luxury.
          </p>

          <div className="mt-10 flex gap-4 justify-center flex-wrap">

            <button
              onClick={() => navigate("/products")}
              className="bg-yellow-500 text-black px-10 py-4 rounded-full font-semibold hover:bg-yellow-400 transition">
              Shop Collection
            </button>

            <button
              onClick={() => navigate("/products")}
              className="border border-yellow-500 px-10 py-4 rounded-full hover:bg-yellow-500 hover:text-black transition">
              Explore Designs
            </button>

          </div>
        </div>
      </section>


      {/* WHY US */}
      <section className="py-24 px-6 max-w-7xl mx-auto">

        <h2 className="text-4xl font-semibold text-center text-yellow-500 mb-16" data-aos="fade-up">
          Why Choose NexChakra
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {[
            { title: "Certified Gold", desc: "Hallmark certified purity & authenticity.", icon: "💎" },
            { title: "Handcrafted", desc: "Designed by skilled artisans with passion.", icon: "🛠️" },
            { title: "Lifetime Shine", desc: "Premium polish for everlasting brilliance.", icon: "✨" }
          ].map((f, i) => (
            <div key={i} data-aos="zoom-in"
              className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-3xl border border-yellow-600/20 hover:border-yellow-500/50 transition">

              <div className="text-5xl mb-6">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>

            </div>
          ))}

        </div>
      </section>


      {/* FEATURED COLLECTION */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">

        <h2 className="text-4xl text-center text-yellow-500 mb-16" data-aos="fade-up">
          Featured Collections
        </h2>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 px-6">

          {[
            "https://i.pinimg.com/736x/00/ec/f7/00ecf734af26a21e28379c03dd64bd6e.jpg",
            "https://i.pinimg.com/736x/9c/0a/4b/9c0a4b55da315a8e692f801d61e9bfd3.jpg",
            "https://i.pinimg.com/1200x/f7/74/59/f774596236a976722a5c9c73404a187f.jpg"
          ].map((img, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={i * 150}
              className="group overflow-hidden rounded-3xl border border-yellow-600/20">

              <img src={img}
                className="h-80 w-full object-cover group-hover:scale-110 transition duration-700" />

              <div className="p-6 bg-black">
                <button
                  onClick={() => navigate("/products")}
                  className="w-full border border-yellow-500 py-3 rounded-full hover:bg-yellow-500 hover:text-black transition">
                  View Collection
                </button>
              </div>

            </div>
          ))}

        </div>
      </section>


      {/* TESTIMONIALS */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black">

        <h2 className="text-4xl text-center text-yellow-500 mb-16" data-aos="fade-up">
          Loved by Customers
        </h2>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6">

          {[
            { name:"Ananya Sharma", text:"The ring quality is unbelievable. Looks even better than showroom jewelry." },
            { name:"Rohit Mehta", text:"Bought for my wedding — packaging and shine both premium." },
            { name:"Priya Kapoor", text:"Finally an online jewelry store I can trust. Will order again!" }
          ].map((t,i)=>(
            <div key={i} data-aos="fade-up" data-aos-delay={i*150}
              className="bg-black border border-yellow-600/20 p-8 rounded-3xl">

              <p className="text-gray-300 italic mb-6">“{t.text}”</p>
              <div className="text-yellow-500 font-semibold">★★★★★</div>
              <p className="mt-4 font-semibold">{t.name}</p>

            </div>
          ))}

        </div>
      </section>


      {/* NEWSLETTER */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900 text-center px-6">

        <div data-aos="fade-up">

          <h2 className="text-4xl md:text-5xl font-bold">
            Get 10% Off Your First Order
          </h2>

          <p className="text-gray-400 mt-4">
            Join our exclusive club for new launches & offers
          </p>

          <div className="mt-10 flex flex-col md:flex-row justify-center gap-4 max-w-xl mx-auto">

            <input
              placeholder="Enter your email"
              className="flex-1 bg-black border border-yellow-600/40 px-5 py-4 rounded-full outline-none focus:border-yellow-500"
            />

            <button className="bg-yellow-500 text-black px-8 py-4 rounded-full font-semibold hover:bg-yellow-400 transition">
              Subscribe
            </button>

          </div>

        </div>
      </section>

    </div>
  );
}