import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#F7F9FC]">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(49, 94, 251, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(49, 94, 251, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center'
          }}
        />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-black text-[#182230] tracking-tight mb-6 max-w-4xl leading-[1.1]"
        >
          Always Stay In-tune <br />
          With Your <span className="text-primary">OrbiVAI.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg text-[#182230]/70 max-w-2xl mb-10 leading-relaxed"
        >
          Combines a powerful set of user-friendly collaborative tools and AI-driven
          workspaces to provide seamless access and management for your team.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-24"
        >
          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-[0_8px_20px_rgba(49,94,251,0.25)] hover:shadow-[0_12px_25px_rgba(49,94,251,0.35)] w-full sm:w-auto text-sm"
          >
            Get Started
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('features');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3.5 bg-white text-primary font-semibold rounded-xl border border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all shadow-sm w-full sm:w-auto text-sm"
          >
            Try Demo
          </button>
        </motion.div>

        {/* Browser Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative w-full max-w-5xl mx-auto perspective-1000"
        >
          {/* Decorative lines connecting mockup to background */}
          <div className="absolute -left-12 top-1/2 w-12 h-px bg-primary/20 hidden lg:block" />
          <div className="absolute -right-12 top-1/2 w-12 h-px bg-primary/20 hidden lg:block" />
          <div className="absolute left-0 top-1/2 -translate-x-full w-px h-12 bg-primary/20 hidden lg:block" />
          <div className="absolute right-0 top-1/2 translate-x-full w-px h-12 bg-primary/20 hidden lg:block" />

          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(18,28,48,0.1)] border border-[#E4E9F0] overflow-hidden">
            {/* Browser Header */}
            <div className="h-12 border-b border-[#E4E9F0] bg-[#F7F9FC] flex items-center px-4 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white border border-[#E4E9F0] rounded-md h-7 w-64 flex items-center justify-center text-[10px] text-[#182230]/50 font-medium font-sans shadow-sm">
                  <svg className="w-3 h-3 mr-1.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path><path d="M12 8v4l3 3"></path></svg>
                  orbivai.com
                </div>
              </div>
              <div className="flex gap-3 text-[#182230]/30">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"></path></svg>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
            </div>

            {/* Browser Body */}
            <div className="p-8 bg-white flex gap-6 h-[450px] relative">
              {/* Left Column */}
              <div className="w-1/3 flex flex-col gap-6">
                <div className="bg-[#F7F9FC] border border-[#E4E9F0] rounded-xl p-5 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-[#E4E9F0] flex items-center justify-center shadow-sm">
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-[#182230]">Workspace</h3>
                      <p className="text-[10px] text-[#182230]/50">Team build</p>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-[#F7F9FC] text-[8px] flex items-center justify-center font-bold text-primary">+2</div>
                  </div>
                </div>

                <div className="space-y-3 px-2">
                  <div className="h-2.5 w-3/4 bg-[#F7F9FC] rounded-full"></div>
                  <div className="h-2.5 w-1/2 bg-[#F7F9FC] rounded-full"></div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-2 w-12 bg-[#27C93F]/20 rounded-full"></div>
                    <div className="h-2 w-16 bg-primary/20 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Right Column (Code Editor) */}
              <div className="w-2/3 bg-[#F7F9FC] rounded-xl border border-[#E4E9F0] p-6 font-mono text-[10px] leading-loose text-left overflow-hidden relative shadow-inner">
                <span className="text-[#E06C75]">const</span> <span className="text-[#61AFEF]">podConfig</span> <span className="text-[#56B6C2]">=</span> {'{'}
                <br />
                &nbsp;&nbsp;<span className="text-[#D19A66]">name:</span> <span className="text-[#98C379]">'Frontend Core'</span>,
                <br />
                &nbsp;&nbsp;<span className="text-[#D19A66]">members:</span> [
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;{'{'} <span className="text-[#D19A66]">role:</span> <span className="text-[#98C379]">'Admin'</span>, <span className="text-[#D19A66]">user:</span> <span className="text-[#98C379]">'@alex'</span> {'}'},
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;{'{'} <span className="text-[#D19A66]">role:</span> <span className="text-[#98C379]">'Developer'</span>, <span className="text-[#D19A66]">user:</span> <span className="text-[#98C379]">'@sarah'</span> {'}'}
                <br />
                &nbsp;&nbsp;],
                <br />
                &nbsp;&nbsp;<span className="text-[#D19A66]">services:</span> [
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;{'{'}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#D19A66]">name:</span> <span className="text-[#98C379]">'web-app'</span>,
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#D19A66]">framework:</span> <span className="text-[#98C379]">'React'</span>,
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#D19A66]">port:</span> <span className="text-[#D19A66]">3000</span>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;{'}'}
                <br />
                &nbsp;&nbsp;],
                <br />
                &nbsp;&nbsp;<span className="text-[#D19A66]">aiEnabled:</span> <span className="text-[#D19A66]">true</span>
                <br />
                {'}'};
              </div>

              {/* Floating Dark Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[-40px] bottom-10 bg-[#0d1117] border border-white/10 rounded-2xl p-5 shadow-2xl w-64 z-20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/10 px-3 py-1 rounded text-[10px] font-semibold text-white">
                    Documentation
                  </div>
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-6 h-6 rounded-full border border-white/20 bg-gray-800" />
                </div>
                <div className="font-mono text-[9px] text-[#8b949e] leading-relaxed text-left">
                  <span className="text-[#79c0ff]">import</span> {'{'} <span className="text-[#d2a8ff]">PodAI</span> {'}'} <span className="text-[#79c0ff]">from</span> <span className="text-[#a5d6ff]">'@orbivai/core'</span>;
                  <br /><br />
                  <span className="text-[#ff7b72]">const</span> workspace <span className="text-[#ff7b72]">=</span> <span className="text-[#ff7b72]">new</span> <span className="text-[#d2a8ff]">PodAI</span>();
                  <br />
                  <span className="text-[#ff7b72]">await</span> workspace.<span className="text-[#d2a8ff]">sync</span>();
                  <br /><br />
                  <span className="text-[#8b949e]">// Real-time collaboration enabled</span>
                </div>
              </motion.div>

              {/* Floating Light Card */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute right-6 bottom-[-30px] bg-white border border-[#E4E9F0] rounded-2xl p-5 shadow-xl w-72 z-20"
              >
                <div className="flex gap-1.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#E4E9F0]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#E4E9F0]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#E4E9F0]"></div>
                </div>
                <p className="text-[9px] text-[#182230]/70 leading-relaxed font-mono text-left mb-4">
                  Pod configuration initialized. Ready to orchestrate collaborative environments and AI assistants across your team's workspace.
                </p>
                <div className="flex justify-end gap-2">
                  <div className="w-5 h-5 rounded bg-[#F7DF1E]/20 text-[#F7DF1E] flex items-center justify-center text-[10px] font-bold">JS</div>
                  <div className="w-5 h-5 rounded bg-[#3178C6]/20 text-[#3178C6] flex items-center justify-center text-[10px] font-bold">TS</div>
                  <div className="w-5 h-5 rounded bg-[#61DAFB]/20 text-[#61DAFB] flex items-center justify-center text-[10px] font-bold">RE</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;