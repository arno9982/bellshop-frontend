'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
  },
};

export default function HomePage() {
  const router = useRouter();
  const fauxProduits = [
    { 
      id: 1, 
      nom: "Pull Nuage en Mohair", 
      image: "https://res.cloudinary.com/lypydquk/image/upload/v1783129789/wjs3hgcsxdopw7gmiv7y.jpg" 
    },
    { 
      id: 2, 
      nom: "Echarpe Torsadee Cocon", 
      image: "https://res.cloudinary.com/lypydquk/image/upload/v1783128680/wuesllxlt7ckhkqk39wi.jpg" 
    },
    { 
      id: 3, 
      nom: "Bonnet en Laine Merinos", 
      image: "https://res.cloudinary.com/lypydquk/image/upload/v1783128890/oeju9ctyvoaudu66c8ho.jpg" 
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* 1. HERO SECTION - FULL HEIGHT */}
      <motion.section 
        className="relative bg-stone-100 min-h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image */}
        <motion.div 
          className="absolute inset-0 z-0 opacity-70"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <img 
            src="/hero-bg.jpg" 
            alt="Fond tricot vitrine" 
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        
        <div className="relative z-10 text-center max-w-2xl px-4">
          <motion.span 
            className="text-xs font-semibold tracking-widest text-amber-900 uppercase bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full inline-block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Collection Hiver & Spring
          </motion.span>

          <motion.h1 
            className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mt-8 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Le charme du tricot fait main
          </motion.h1>

          <motion.p 
            className="text-stone-700 text-lg mb-8 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Decouvrez des vetements uniques, tricotes avec amour et une laine de haute qualite pour une douceur inegalee.
          </motion.p>

          <motion.button 
            onClick={() => router.push('/catalogue')}
            className="bg-amber-900 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-amber-800 transition tracking-wide font-medium cursor-pointer text-lg"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Decouvrir la collection
          </motion.button>
        </div>
      </motion.section>

      {/* 2. ARGUMENTS / VALEURS */}
      <section className="py-20 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { titre: '100% Fait Main', desc: 'Chaque piece est unique et confectionnee patiemment a l\'aiguille.' },
          { titre: 'Laine Eco-responsable', desc: 'Nous selectionnons des fibres naturelles respectueuses de l\'environnement.' },
          { titre: 'Qualite Durable', desc: 'Des vetements concus pour durer et vous accompagner des annees.' },
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            className="p-8 bg-white rounded-xl shadow-sm border border-stone-200 hover:shadow-md hover:border-amber-200 transition-all text-center"
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
          >
            <motion.div 
              className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-2xl font-serif font-bold text-amber-900">{idx + 1}</span>
            </motion.div>
            <h3 className="font-serif font-semibold text-lg text-stone-900 mb-2">{feature.titre}</h3>
            <p className="text-stone-600 text-sm font-light">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* 3. CREATIONS PHARES */}
      <section className="py-24 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-bold text-stone-900">Nos creations phares</h2>
            <p className="text-stone-500 text-sm mt-2">Les pieces les plus demandees</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {fauxProduits.map((produit, idx) => (
              <motion.div 
                key={produit.id}
                variants={scaleIn}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                  <motion.img 
                    src={produit.image} 
                    alt={produit.nom} 
                    className="h-full w-full object-cover object-center"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-stone-900 font-serif">{produit.nom}</h3>
                  <p className="mt-1 text-xs text-stone-500 uppercase tracking-wide">Pure laine artisanale</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. CTA FINAL */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-amber-900 to-amber-800 text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-4xl font-serif font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Pret a decouvrir votre prochaine piece preferee ?
        </motion.h2>
        <motion.button 
          onClick={() => router.push('/catalogue')}
          className="bg-white text-amber-900 px-10 py-4 rounded-lg font-semibold tracking-wide text-lg shadow-xl hover:shadow-2xl cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Explorer toute la collection
        </motion.button>
      </motion.section>
    </div>
  );
}
