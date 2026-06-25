import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { categorizeProduct } from '../../utils/cat-prod.jsx';
import { recommendedProducts, newArrivals } from '../../data/mock-data.jsx';




const categoryColors = {
  insurance: 'from-slate-900 via-slate-700 to-slate-800',
  investments: 'from-sky-800 via-sky-600 to-sky-700',
  'device contracts': 'from-emerald-800 via-emerald-600 to-emerald-700',
  other: 'from-slate-600 via-slate-500 to-slate-700',
};

const AdvisorContactForm = ({ productName }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Replace with your actual endpoint once available
      // await axios.post('/client/v1/advisor-request', { ...form, productName });
      await new Promise((res) => setTimeout(res, 800)); // placeholder delay
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit advisor request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-2">Thanks — we've got it</h3>
        <p className="text-sm text-slate-600">
          An advisor will reach out to you shortly about {productName}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-slate-200 space-y-4">
      <div>
        <label className="flex text-sm font-medium text-slate-700 mb-1">Full name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-slate-900"
        />
      </div>

      <div>
        <label className="flex text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-slate-900"
        />
      </div>

      <div>
        <label className="flex text-sm font-medium text-slate-700 mb-1">Phone</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-slate-900"
        />
      </div>

      <div>
        <label className="flex text-sm font-medium text-slate-700 mb-1">Message (optional)</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={3}
          className="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-slate-900"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition disabled:opacity-60"
      >
        {submitting ? 'Sending...' : 'Request a callback'}
      </button>
    </form>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate =useNavigate(); 

  useEffect(() => {
  
    const allProducts = [...recommendedProducts, ...newArrivals];
    const found = allProducts.find((item) => String(item.id) === String(id));
    setProduct(found || null);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
        <div className="text-center">
          <p className="text-slate-700 text-lg">Loading product details…</p>
        </div>
      </div>
    );
  }

  const benefits = product.benefits || [
    'Theft and loss recovery',
    'Comprehensive coverage',
    'Hardware malfunction coverage',
  ];
  const requirements = product.requirements || [
    'Minimum age of 18 years old',
    'South African resident',
    'Have an account with us in good standing',
  ];

  // Benefit icons mapping
  const benefitIcons = {
    'Theft and loss recovery': '',
    'Comprehensive coverage': '',
    'Hardware malfunction coverage': '',
  };

  // Get long description or fallback to different text
  const longDescription = product.longDescription || product.about ||
    'This product is designed to provide you with comprehensive financial solutions tailored to your specific needs. We combine flexibility, competitive pricing, and expert support to ensure you get the best value for your financial journey.';

  // Get billing period or default to "per month"
  const billingPeriod = product.billingPeriod || 'per month';

  const productCategory = categorizeProduct(product);
  const productColor = categoryColors[productCategory] || categoryColors.other;

  return (
    <div className="min-h-screen bg-white">

      <div className="border-b border-slate-200">
        {/* <div className="max-w-6xl mx-auto px-6 py-4">
          <Link to="/products" className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-2">
            ← Back to products
          </Link>
        </div> */}
      </div>


      <div className={`bg-gradient-to-br ${productColor} py-10 md:py-4`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div className="flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-[300px] md:h-[400px] object-cover rounded-2xl shadow-lg"
                />
              ) : (
                <div className="w-full h-[300px] md:h-[400px] bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-white/80 text-sm uppercase tracking-widest font-semibold">
                      {product.name}
                    </p>
                  </div>
                </div>
              )}
            </div>


            <div className="text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] opacity-90 mb-4">
                {productCategory}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {product.name}
              </h1>
              <p className="text-lg opacity-90 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition">
                  Learn more
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition">
                  Contact us
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="mb-16">
          <div className="grid lg:grid-cols-3 gap-8">

            <div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 sticky top-8">
                <p className="text-sm text-slate-600 font-medium mb-2">From</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-5xl font-bold text-slate-900">
                    R {product.price}
                  </p>
                  <p className="text-sm text-slate-600">
                    {billingPeriod}
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-8 pb-6 border-b border-slate-200">
                  <span className="text-lg"></span>
                  <p className="text-xs text-slate-600 font-medium">
                    NCR Regulated &amp; Registered
                  </p>
                </div>

                <button
                   onClick={() => navigate('/client-profile')}
                className="
                w-full bg-slate-900 text-white py-4 
                
                rounded-xl font-semibold hover:bg-slate-800
                 transition mb-3">
                  Buy now
                </button>

                <p className="text-xs text-slate-500 mt-6 text-center">
                  Pricing may vary based on your circumstances
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-8">
                <div>
                  <h2 className="flex text-2xl font-bold text-slate-900 mb-4">About this product</h2>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {longDescription}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-2">Key benefit</h3>
                    <p className="text-sm text-slate-600">Designed to meet your financial needs with flexibility and ease.</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-2">Who it's for</h3>
                    <p className="text-sm text-slate-600">Anyone looking for reliable financial solutions and peace of mind.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="border-t border-slate-200 pt-16 pb-16">
          <div className="grid lg:grid-cols-2 gap-10">

            <div>
              <h2 className="flex text-2xl font-bold text-slate-900 mb-8">Key benefits</h2>
              <ul className="space-y-4">
                {benefits.map((item, idx) => (
                  <li key={idx} className="gap-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">
                      {benefitIcons[item] || ''}
                    </span>
                    <span className="flex text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>


            <div>
              <h2 className="flex text-2xl font-bold text-slate-900 mb-8">Requirements</h2>
              <ul className="space-y-4">
                {requirements.map((item, idx) => (
                  <li key={idx} className=" flex text-slate-700">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Speak to an expert — kept inside the same max-w-6xl container and white background
            so it reads as a continuation of the page, not a separate bolted-on section */}
        <div className="border-t border-slate-200 pt-16 pb-4">
          <div className="grid lg:grid-cols-5 gap-10">

            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Need help choosing?
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Our team can walk you through pricing, eligibility, and whether{' '}
                {product.name} is the right fit for you. Leave your details and
                an advisor will get back to you.
              </p>
              {/* <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 flex-shrink-0"></span>
                  Response within 1 business day
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 flex-shrink-0"></span>
                  No obligation, no pressure
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 flex-shrink-0"></span>
                  NCR regulated advisors
                </li>
              </ul> */}
            </div>

            <div className="lg:col-span-3">
              <AdvisorContactForm productName={product.name} />
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;