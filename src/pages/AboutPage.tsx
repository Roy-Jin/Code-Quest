import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Settings, Code, Award, BookOpen, Heart, Users, Link2 } from 'lucide-react';
import { TRANSLATIONS } from '../config';
import { CONTRIBUTORS, ACKNOWLEDGMENTS, contributorsByRole } from '../config/contributors';
import { BackgroundGrid } from '../components/BackgroundGrid';
import { PageTransition } from '../components/PageTransition';
import { TooltipButton } from '../components/TooltipButton';
import { useStore } from '../context/StoreContext';

export function AboutPage() {
  const navigate = useNavigate();
  const { settings } = useStore();
  const t = TRANSLATIONS[settings.language];

  const features = [
    {
      icon: <Code className="w-8 h-8 text-blue-400" />,
      title: t.aboutFeature1,
      description: t.aboutFeature1Desc
    },
    {
      icon: <Award className="w-8 h-8 text-purple-400" />,
      title: t.aboutFeature2,
      description: t.aboutFeature2Desc
    },
    {
      icon: <BookOpen className="w-8 h-8 text-cyan-400" />,
      title: t.aboutFeature3,
      description: t.aboutFeature3Desc
    }
  ];

  return (
    <PageTransition className="h-screen w-full bg-slate-950 text-slate-200 font-sans flex flex-col relative overflow-hidden">
      <BackgroundGrid />
      
      <header className="h-20 shrink-0 flex items-center px-4 lg:px-8 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="w-full max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img src="/icons/icon.svg" alt="CQ Logo" className="w-8 h-8 md:w-10 md:h-10 rounded-lg shadow-lg shadow-blue-500/20" />
            </motion.button>
            <h1 className="text-xl md:text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipButton
              icon={<Home size={20} />}
              tooltip={t.backToHome}
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-all backdrop-blur-sm"
            />
            <TooltipButton
              icon={<Settings size={20} />}
              tooltip={t.settings}
              onClick={() => navigate('/settings')}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-all backdrop-blur-sm"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 lg:p-8 overflow-y-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-6 bg-slate-900/30 p-3 pr-8 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
            <img src="/icons/icon.svg" alt="CQ Logo" className="w-12 h-12 rounded-full shadow-lg shadow-cyan-500/20" />
            <span className="text-slate-300 font-medium tracking-wide">v{__APP_VERSION__}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 tracking-tight leading-tight">
            {t.aboutTitle}
          </h2>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t.aboutDescription}
          </p>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-10 text-slate-300 flex items-center gap-2">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="w-1 h-8 bg-blue-500 rounded-full origin-left"
            />
            {t.aboutFeatures}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-blue-500/50 hover:bg-slate-800/90 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm transition-all duration-300"
              >
                <div className="mb-4 p-3 bg-slate-800/50 rounded-xl inline-block">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-100">
                  {feature.title}
                </h4>
                <p className="text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-10 text-slate-300 flex items-center gap-2">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="w-1 h-8 bg-purple-500 rounded-full origin-left"
            />
            {t.aboutHowItWorks}
          </h3>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-500 to-purple-500 transform The class `md:translate-x-[-0.25rem]` can be written as `md:-translate-x-1"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {[1, 2, 3, 4].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-500 transform -translate-x-2 md:-translate-x-2 z-10"></div>
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 md:px-8 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-blue-500/50 hover:bg-slate-800/90 backdrop-blur-sm transition-all duration-300">
                      <h4 className="text-xl font-bold mb-3 text-slate-100">
                        {t[`aboutStep${step}Title`]}
                      </h4>
                      <p className="text-slate-400">
                        {t[`aboutStep${step}Desc`]}
                      </p>
                    </div>
                  </div>
                  
                  {/* Empty Space for other side */}
                  <div className="md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-8 rounded-3xl border border-white/10 bg-linear-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-md shadow-2xl shadow-blue-500/10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-100">
              {t.aboutReady}
            </h3>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              {t.aboutReadyDesc}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/levels')}
              className="px-8 py-4 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-3 mx-auto"
            >
              {t.startGame}
            </motion.button>
          </div>
        </motion.div>

        {/* Contributors Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-10 text-slate-300 flex items-center gap-2">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="w-1 h-8 bg-cyan-500 rounded-full origin-left"
            />
            <span className="flex items-center gap-2">
              <Users className="w-6 h-6" />
              {t.teamMembers}
            </span>
          </h3>

          {/* Group contributors by role */}
          {Object.entries(contributorsByRole).map(([role, roleContributors], roleIndex) => (
            <motion.div key={role} className="mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {roleContributors.map((contributor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 + roleIndex * 0.1 + index * 0.05 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-blue-500/50 hover:bg-slate-800/90 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm transition-all duration-300 flex flex-col items-center text-center"
                  >
                    <div className="w-20 h-20 mb-4 rounded-full overflow-hidden border-2 border-blue-500/30">
                      <img 
                        src={contributor.avatar} 
                        alt={contributor.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h5 className="text-lg font-bold mb-1 text-slate-100">
                      {contributor.name}
                    </h5>
                    <p className="text-slate-400 mb-4 text-sm">
                      {contributor.role}
                    </p>
                    {contributor.link && (
                      <a 
                        href={contributor.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors text-sm"
                      >
                        <Link2 className="w-4 h-4" />
                        <span>{t.viewProfile}</span>
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Acknowledgments Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-10 text-slate-300 flex items-center gap-2">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="w-1 h-8 bg-green-500 rounded-full origin-left"
            />
            <span className="flex items-center gap-2">
              <Link2 className="w-6 h-6" />
              {t.acknowledgments}
            </span>
          </h3>

          <div className="space-y-4">
            {ACKNOWLEDGMENTS.map((acknowledgment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1 + index * 0.05 }}
                whileHover={{ x: 8, transition: { duration: 0.2 } }}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-green-500/50 hover:bg-slate-800/90 transition-all duration-300"
              >
                <div>
                  <h4 className="text-lg font-semibold text-slate-100">
                    {acknowledgment.link ? (
                      <a 
                        href={acknowledgment.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2"
                      >
                        {acknowledgment.name}
                        <Link2 className="w-4 h-4" />
                      </a>
                    ) : (
                      acknowledgment.name
                    )}
                  </h4>
                  {acknowledgment.description && (
                    <p className="text-slate-400 text-sm mt-1">
                      {acknowledgment.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="text-center text-slate-500 py-8 border-t border-slate-800"
        >
          <p className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>{t.aboutFooter}</span>
          </p>
        </motion.div>
      </main>
    </PageTransition>
  );
}
