import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader, AlertCircle, CheckCircle, Database, Zap, Sparkles, ArrowRight } from 'lucide-react';

interface PDBInputProps {
  onProteinLoaded: (proteinId: string) => void;
  className?: string;
}

const PDBInput: React.FC<PDBInputProps> = ({ onProteinLoaded, className = '' }) => {
  const [pdbId, setPdbId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validatePDBId = (id: string): boolean => {
    // PDB IDs are 4 characters: 1 digit followed by 3 alphanumeric characters
    return /^[0-9][A-Za-z0-9]{3}$/.test(id);
  };

  const checkPDBExists = async (id: string): Promise<boolean> => {
    try {
      // Try to fetch the actual PDB file to verify it exists
      const pdbUrl = `https://files.rcsb.org/download/${id.toUpperCase()}.pdb`;
      const response = await fetch(pdbUrl, { method: 'HEAD' });
      return response.ok;
    } catch {
      // If CORS or network issues, assume it exists if format is valid
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanId = pdbId.trim().toUpperCase();
    
    if (!cleanId) {
      setError('Please enter a PDB ID');
      return;
    }

    if (!validatePDBId(cleanId)) {
      setError('Please enter a valid 4-character PDB ID (e.g., 8R9U)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For now, skip the existence check and let the viewer handle it
      // This avoids CORS issues and lets NGL handle the actual validation
      setSuccess(true);
      
      // Small delay for visual feedback
      setTimeout(() => {
        onProteinLoaded(cleanId);
      }, 800);
      
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 4);
    setPdbId(value);
    setError(null);
    setSuccess(false);
  };

  const exampleIds = [
    { id: '8R9U', name: 'SARS-CoV-2 Spike' },
    { id: '8R99', name: 'COVID-19 Protease' },
    { id: '1BNA', name: 'Barnase' },
    { id: '2GBP', name: 'Glucose Binding' },
    { id: '1HTM', name: 'HIV-1 Protease' },
    { id: '1CRN', name: 'Crambin' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-6 shadow-lg shadow-cyan-500/25 relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Database className="w-10 h-10 text-white" />
          <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl animate-pulse" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-3 flex items-center justify-center space-x-2">
          <span>Load Protein Structure</span>
          <Sparkles className="w-6 h-6 text-cyan-400" />
        </h2>
        <p className="text-slate-300 text-lg">Enter a PDB ID to visualize protein structures in beautiful 3D</p>
      </div>

      {/* Input Form */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Database className="h-6 w-6 text-slate-400" />
          </div>
          
          <input
            type="text"
            value={pdbId}
            onChange={handleInputChange}
            placeholder="Enter PDB ID (e.g., 8R9U)"
            className={`w-full pl-14 pr-14 py-5 bg-slate-700/60 border-2 rounded-2xl text-white placeholder-slate-400 text-xl font-mono tracking-wider text-center focus:outline-none transition-all backdrop-blur-sm shadow-lg ${
              error 
                ? 'border-red-500 focus:border-red-400 shadow-red-500/25' 
                : success
                ? 'border-green-500 focus:border-green-400 shadow-green-500/25'
                : 'border-slate-600 focus:border-cyan-500 focus:shadow-cyan-500/25'
            }`}
            maxLength={4}
            disabled={loading || success}
            autoComplete="off"
            spellCheck={false}
          />
          
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {loading && <Loader className="h-6 w-6 text-cyan-400 animate-spin" />}
            {success && <CheckCircle className="h-6 w-6 text-green-400" />}
            {error && <AlertCircle className="h-6 w-6 text-red-400" />}
          </div>
        </div>

        {error && (
          <motion.div 
            className="text-red-300 text-sm text-center bg-red-400/15 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading || !pdbId || success}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white py-5 px-8 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center space-x-3 shadow-xl hover:shadow-cyan-500/25 hover:scale-105"
          whileHover={{ scale: loading || success ? 1 : 1.02 }}
          whileTap={{ scale: loading || success ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <Loader className="w-6 h-6 animate-spin" />
              <span>Loading Structure...</span>
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-6 h-6" />
              <span>Loading Viewer...</span>
            </>
          ) : (
            <>
              <Zap className="w-6 h-6" />
              <span>Load Protein</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </motion.form>

      {/* Examples */}
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="text-center">
          <span className="text-sm text-slate-400">Try these examples:</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {exampleIds.map(({ id, name }) => (
            <motion.button
              key={id}
              onClick={() => setPdbId(id)}
              className="p-4 bg-slate-700/40 hover:bg-slate-600/60 border border-slate-600/50 hover:border-cyan-500/50 rounded-xl text-left transition-all group backdrop-blur-sm"
              disabled={loading || success}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-mono font-bold text-cyan-400 group-hover:text-cyan-300 text-lg mb-1">
                {id}
              </div>
              <div className="text-sm text-slate-400 group-hover:text-slate-300 truncate">
                {name}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Info */}
      <motion.div 
        className="text-center text-sm text-slate-500 space-y-2 bg-slate-800/30 rounded-xl p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Database className="w-4 h-4 text-slate-400" />
          <p className="font-medium">Structures loaded from RCSB Protein Data Bank</p>
        </div>
        <p>Supports all PDB format files with 3D coordinates</p>
      </motion.div>
    </div>
  );
};

export default PDBInput;