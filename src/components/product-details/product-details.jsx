// import { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import axios from 'axios';
// import Image from '../../assets/inv1.jpg';

// const ProductDetails = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [expanded, setExpanded] = useState(false);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get('/client/v1/products');
//         const found = response.data?.find((item) => String(item.id) === String(id));
//         setProduct(found || null);
//       } catch (error) {
//         console.error('Failed to load product details', error);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
//         <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
//           <p className="text-slate-700">Loading product details…</p>
//         </div>
//       </div>
//     );
//   }

//   const description = product.description || '';
//   const teaser = description.length > 170 ? `${description.slice(0, 170)}...` : description;
//   const benefits = product.benefits || [
//     'Theft and loss recovery',
//     'Comprehensive coverage',
//     'Hardware malfunction coverage',
//   ];
//   const requirements = product.requirements || [
//     'Minimum age of 18 years old',
//     'South African resident',
//     'Have an account with us in good standing',
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 px-4 py-8">
//       <div className="mx-auto max-w-6xl space-y-8">
//         <div className="flex items-center gap-4 text-sm text-slate-600">
//           <Link to="/products" className="hover:text-slate-900">← Back to products</Link>
//           <span className="rounded-full bg-slate-200 px-3 py-1">Product details</span>
//         </div>

//         <div className="grid gap-8 xl:grid-cols-[1.35fr_0.85fr]">
//           <main className="space-y-6">
//             <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-xl">
//               <div className="relative">
//                 <img src={Image} alt={product.name} className="w-full object-cover" />
//                 <div className="absolute left-5 top-5 rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white">
//                   25% off
//                 </div>
//               </div>
//               <div className="space-y-6 p-8">
//                 <div>
//                   <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Islamic Investment Product</p>
//                   <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">{product.name}</h1>
//                   <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
//                     {expanded ? description : teaser}{' '}
//                     {description.length > 170 && (
//                       <button
//                         type="button"
//                         onClick={() => setExpanded((state) => !state)}
//                         className="font-semibold text-sky-600 hover:text-sky-700"
//                       >
//                         {expanded ? 'Read less' : 'Read more'}
//                       </button>
//                     )}
//                   </p>
//                 </div>

//                 <div className="flex flex-col gap-4 rounded-[32px] bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
//                   <div>
//                     <p className="text-sm text-slate-500">Starting from</p>
//                     <p className="mt-2 text-3xl font-semibold text-slate-900">R {product.price}</p>
//                   </div>
//                   <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
//                     Add to cart
//                   </button>
//                 </div>
//               </div>
//             </section>

//             <section className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-xl">
//               <h2 className="text-xl font-semibold text-slate-900">Related product</h2>
//               <div className="mt-6 grid gap-4 sm:grid-cols-2">
//                 <Link
//                   to="/products"
//                   className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
//                 >
//                   <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Product title</p>
//                   <p className="mt-3 text-lg font-semibold text-slate-900">Short term plan</p>
//                   <p className="mt-3 text-sm text-slate-600">From R350 per month</p>
//                 </Link>
//                 <Link
//                   to="/products"
//                   className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
//                 >
//                   <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Product title</p>
//                   <p className="mt-3 text-lg font-semibold text-slate-900">Long term plan</p>
//                   <p className="mt-3 text-sm text-slate-600">From R450 per month</p>
//                 </Link>
//               </div>
//             </section>
//           </main>

//           <aside className="space-y-6">
//             <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-xl">
//               <h2 className="text-lg font-semibold text-slate-900">Benefits</h2>
//               <ul className="mt-4 space-y-3 text-slate-600">
//                 {benefits.map((item) => (
//                   <li key={item} className="flex gap-3">
//                     <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-sky-600" />
//                     <span>{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-xl">
//               <h2 className="text-lg font-semibold text-slate-900">Requirement</h2>
//               <ul className="mt-4 space-y-3 text-slate-600">
//                 {requirements.map((item) => (
//                   <li key={item} className="flex gap-3">
//                     <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-slate-900" />
//                     <span>{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;
