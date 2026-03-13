import { useState } from "react";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
      <Navbar />

      {/* ──── Hero Section ──── */}
      <section id="home" className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-200/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            <div className="animate-fadeInUp">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulseDot" />
                Trusted Healthcare Platform
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Health,<br />
                <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                Access world-class healthcare services from the comfort of your home. 
                Connect with top doctors, manage your health records, and book appointments seamlessly.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#services"
                  className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white
                             bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700
                             shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50
                             transition-all hover:-translate-y-0.5">
                  Explore Services
                </a>
                <a href="#about"
                  className="px-8 py-3.5 rounded-xl text-sm font-semibold text-emerald-700
                             bg-white border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50
                             shadow-sm transition-all hover:-translate-y-0.5">
                  Learn More
                </a>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                {[
                  { value: "10K+", label: "Patients" },
                  { value: "500+", label: "Doctors" },
                  { value: "50+", label: "Hospitals" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-emerald-600">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-96 h-96 rounded-3xl bg-gradient-to-br from-emerald-100 to-green-50 
                              border border-emerald-200 shadow-2xl shadow-emerald-100/50 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-8xl animate-floatY">🏥</div>
                    <div className="text-lg font-bold text-gray-800">Smart Healthcare</div>
                    <div className="text-sm text-gray-500">Powered by AI</div>
                  </div>
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 px-4 py-3 rounded-xl bg-white shadow-lg border border-gray-100 animate-floatY" style={{ animationDelay: "0.5s" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👨‍⚕️</span>
                    <div>
                      <div className="text-xs font-bold text-gray-800">Dr. Available</div>
                      <div className="text-[10px] text-emerald-600">Online Now</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 px-4 py-3 rounded-xl bg-white shadow-lg border border-gray-100 animate-floatY" style={{ animationDelay: "1s" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📋</span>
                    <div>
                      <div className="text-xs font-bold text-gray-800">Health Records</div>
                      <div className="text-[10px] text-emerald-600">Secure & Private</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──── About Section ──── */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
              About Us
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Transforming Healthcare with <span className="text-emerald-600">Technology</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We are revolutionizing the healthcare industry by making medical services accessible, 
              efficient, and patient-centered through cutting-edge technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🎯", title: "Our Mission", desc: "To provide accessible, affordable, and quality healthcare services to everyone through innovative digital solutions." },
              { icon: "👁️", title: "Our Vision", desc: "A world where healthcare is seamless, personalized, and available at everyone's fingertips regardless of location." },
              { icon: "💎", title: "Our Values", desc: "Patient-first approach, data privacy, transparency in medical processes, and continuous innovation in healthcare delivery." },
            ].map((item) => (
              <div key={item.title}
                className="p-8 rounded-2xl bg-gradient-to-b from-green-50 to-white border border-green-100 
                           hover:shadow-xl hover:shadow-green-100/50 hover:-translate-y-1 transition-all">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Services Section ──── */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
              Our Services
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive <span className="text-emerald-600">Healthcare</span> Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From consultations to diagnostics, we offer a complete suite of healthcare services.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "👨‍⚕️", title: "Expert Doctors", desc: "Connect with qualified, verified doctors across various specializations for expert medical advice.", color: "from-emerald-500 to-green-600" },
              { icon: "🏥", title: "Top Hospitals", desc: "Access a network of verified hospitals providing quality care with modern facilities.", color: "from-teal-500 to-emerald-600" },
              { icon: "❤️", title: "Patient Care", desc: "Comprehensive patient management with digital health records and follow-up tracking.", color: "from-green-500 to-emerald-600" },
              { icon: "📋", title: "Health Records", desc: "Secure digital storage of all medical records, prescriptions, and diagnostic reports.", color: "from-emerald-600 to-teal-600" },
              { icon: "📅", title: "Appointments", desc: "Easy online booking with real-time scheduling and automated reminders.", color: "from-green-600 to-emerald-700" },
              { icon: "🤖", title: "AI Diagnosis", desc: "AI-powered symptom checker for preliminary health assessment and guidance.", color: "from-teal-600 to-green-700" },
            ].map((service) => (
              <div key={service.title}
                className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm
                           hover:shadow-xl hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} 
                              flex items-center justify-center text-2xl text-white shadow-lg mb-4
                              group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Blog Section ──── */}
      <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
              Blog & News
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Latest <span className="text-emerald-600">Health</span> Insights
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { tag: "Wellness", title: "10 Tips for a Healthy Lifestyle in 2026", desc: "Discover proven strategies to maintain optimal health and prevent common diseases.", date: "Mar 10, 2026", readTime: "5 min" },
              { tag: "Technology", title: "How AI is Revolutionizing Diagnostics", desc: "Explore the cutting-edge AI tools transforming medical diagnosis accuracy.", date: "Mar 8, 2026", readTime: "7 min" },
              { tag: "Nutrition", title: "The Role of Diet in Mental Health", desc: "Understanding the connection between nutrition and psychological well-being.", date: "Mar 5, 2026", readTime: "6 min" },
            ].map((post, i) => (
              <div key={i} className="group rounded-2xl bg-gradient-to-b from-green-50 to-white border border-green-100 
                                     overflow-hidden hover:shadow-xl hover:shadow-green-100/50 hover:-translate-y-1 transition-all">
                <div className="h-48 bg-gradient-to-br from-emerald-200 to-green-100 flex items-center justify-center">
                  <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform">📰</span>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 mb-3">
                    {post.tag}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.desc}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{post.date}</span>
                    <span>{post.readTime} read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Contact Section ──── */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
              Contact Us
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Get in <span className="text-emerald-600">Touch</span>
            </h2>
            <p className="text-gray-600">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                { icon: "📍", title: "Address", detail: "123 Healthcare Boulevard, Medical City, MC 10001" },
                { icon: "📞", title: "Phone", detail: "+1 (555) 123-4567" },
                { icon: "✉️", title: "Email", detail: "support@healthcare.com" },
                { icon: "🕐", title: "Hours", detail: "Mon - Fri: 9 AM - 6 PM" },
              ].map((info) => (
                <div key={info.title} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-green-100 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-xl shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{info.title}</div>
                    <div className="text-gray-600 text-sm mt-0.5">{info.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="p-6 rounded-2xl bg-white border border-green-100 shadow-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 
                             focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  placeholder="Your name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 
                             focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  placeholder="your@email.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 
                             focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
                  placeholder="How can we help you?" required />
              </div>
              <button type="submit"
                className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer
                           bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700
                           shadow-lg shadow-emerald-200/50 transition-all hover:-translate-y-0.5">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ──── Footer ──── */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 
                              flex items-center justify-center text-white text-lg font-bold">H</div>
                <span className="text-xl font-bold">Health<span className="text-emerald-400">care</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Providing accessible and quality healthcare services through innovative digital solutions.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-emerald-400">Quick Links</h4>
              <div className="space-y-2">
                {["Home", "About", "Services", "Blog", "Contact"].map((link) => (
                  <a key={link} href={`#${link.toLowerCase()}`} className="block text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-emerald-400">Services</h4>
              <div className="space-y-2">
                {["Find Doctors", "Hospitals", "Appointments", "Health Records", "AI Diagnosis"].map((link) => (
                  <a key={link} href="#services" className="block text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-emerald-400">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>📍 123 Healthcare Blvd</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>✉️ support@healthcare.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            © 2026 Healthcare. All rights reserved. Built with ❤️ for better health.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
