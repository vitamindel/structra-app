import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ruler, 
  Triangle, 
  RotateCw,
  X, 
  Trash2, 
  Copy,
  Download,
  ChevronDown,
  ChevronUp,
  Target,
  Zap
} from 'lucide-react';

interface MeasurementData {
  id: number;
  type: 'distance' | 'angle' | 'torsion';
  atoms: any[];
  value: number;
  timestamp: Date;
  notes?: string;
  highlighted: boolean;
}

interface AdvancedMeasurementPanelProps {
  measurements: MeasurementData[];
  onClear: () => void;
  onRemoveMeasurement: (id: number) => void;
  onHighlightMeasurement: (id: number) => void;
  onExportMeasurements: () => void;
  isCollapsed?: boolean;
  onToggleCollapse: () => void;
}

const AdvancedMeasurementPanel: React.FC<AdvancedMeasurementPanelProps> = ({
  measurements,
  onClear,
  onRemoveMeasurement,
  onHighlightMeasurement,
  onExportMeasurements,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [selectedMeasurement, setSelectedMeasurement] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'distance' | 'angle' | 'torsion'>('all');

  const filteredMeasurements = measurements.filter(m => 
    filter === 'all' || m.type === filter
  );

  const getMeasurementIcon = (type: string) => {
    switch (type) {
      case 'distance': return <Ruler className="w-4 h-4" />;
      case 'angle': return <Triangle className="w-4 h-4" />;
      case 'torsion': return <RotateCw className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getMeasurementColor = (type: string) => {
    switch (type) {
      case 'distance': return 'from-orange-500 to-red-500';
      case 'angle': return 'from-cyan-500 to-blue-500';
      case 'torsion': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatValue = (measurement: MeasurementData) => {
    switch (measurement.type) {
      case 'distance':
        return `${measurement.value.toFixed(2)} Å`;
      case 'angle':
      case 'torsion':
        return `${measurement.value.toFixed(1)}°`;
      default:
        return measurement.value.toFixed(2);
    }
  };

  const copyMeasurement = (measurement: MeasurementData) => {
    const text = `${measurement.type}: ${formatValue(measurement)} - ${measurement.atoms.map(a => `${a.residue}${a.residueNumber}`).join(' → ')}`;
    navigator.clipboard.writeText(text);
  };

  const getStatistics = () => {
    if (filteredMeasurements.length === 0) return null;
    
    const values = filteredMeasurements.map(m => m.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return { avg, min, max, count: filteredMeasurements.length };
  };

  const stats = getStatistics();

  if (isCollapsed) {
    return (
      <motion.div
        className="fixed bottom-6 right-6 z-20 bg-slate-800/95 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05, y: -2 }}
      >
        <button
          onClick={onToggleCollapse}
          className="flex items-center space-x-3 text-white hover:text-cyan-400 transition-colors"
        >
          <div className="w-8 h-8 bg-orange-600/30 rounded-lg flex items-center justify-center">
            <Ruler className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg">{measurements.length}</span>
          <ChevronUp className="w-5 h-5" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-20 bg-slate-800/95 backdrop-blur-md border border-slate-700/60 rounded-2xl overflow-hidden max-w-md shadow-2xl"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      layout
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700/60 bg-slate-900/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg flex items-center">
            <div className="w-8 h-8 bg-orange-600/30 rounded-lg flex items-center justify-center mr-3">
              <Ruler className="w-4 h-4 text-orange-400" />
            </div>
            Measurements
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={onExportMeasurements}
              className="p-2.5 text-slate-400 hover:text-cyan-400 transition-colors rounded-xl hover:bg-slate-700/60 shadow-lg"
              title="Export measurements"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClear}
              className="p-2.5 text-slate-400 hover:text-red-400 transition-colors rounded-xl hover:bg-red-600/20 shadow-lg"
              title="Clear all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onToggleCollapse}
              className="p-2.5 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-700/60 shadow-lg"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-slate-700/60 rounded-xl p-1.5">
          {[
            { key: 'all', label: 'All', icon: <Target className="w-3 h-3" /> },
            { key: 'distance', label: 'Distance', icon: <Ruler className="w-3 h-3" /> },
            { key: 'angle', label: 'Angle', icon: <Triangle className="w-3 h-3" /> },
            { key: 'torsion', label: 'Torsion', icon: <RotateCw className="w-3 h-3" /> }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center space-x-2 font-medium ${
                filter === key
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-600/60'
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Statistics */}
        {stats && (
          <motion.div
            className="mt-4 p-4 bg-slate-700/40 rounded-xl backdrop-blur-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-4 gap-3 text-sm">
              <div className="text-center">
                <div className="text-slate-400 font-medium">Count</div>
                <div className="text-white font-mono font-bold text-lg">{stats.count}</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400 font-medium">Avg</div>
                <div className="text-white font-mono font-bold text-lg">{stats.avg.toFixed(1)}</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400 font-medium">Min</div>
                <div className="text-white font-mono font-bold text-lg">{stats.min.toFixed(1)}</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400 font-medium">Max</div>
                <div className="text-white font-mono font-bold text-lg">{stats.max.toFixed(1)}</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Measurements List */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredMeasurements.map((measurement, index) => (
            <motion.div
              key={measurement.id}
              className={`border-b border-slate-700/50 last:border-b-0 transition-all ${
                selectedMeasurement === measurement.id ? 'bg-slate-700/60' : 'hover:bg-slate-700/30'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${getMeasurementColor(measurement.type)} shadow-lg`}>
                      {getMeasurementIcon(measurement.type)}
                    </div>
                    <div>
                      <div className="text-white font-mono text-xl font-bold">
                        {formatValue(measurement)}
                      </div>
                      <div className="text-sm text-slate-400 capitalize font-medium">
                        {measurement.type} measurement
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onHighlightMeasurement(measurement.id)}
                      className={`p-2.5 rounded-xl transition-all ${
                        measurement.highlighted
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                          : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-700/60'
                      }`}
                      title="Highlight in viewer"
                    >
                      <Zap className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => copyMeasurement(measurement)}
                      className="p-2.5 text-slate-400 hover:text-green-400 transition-colors rounded-xl hover:bg-green-600/20"
                      title="Copy measurement"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onRemoveMeasurement(measurement.id)}
                      className="p-2.5 text-slate-400 hover:text-red-400 transition-colors rounded-xl hover:bg-red-600/20"
                      title="Remove measurement"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Atom sequence */}
                <div className="flex items-center space-x-2 mb-3">
                  {measurement.atoms.map((atom, i) => (
                    <React.Fragment key={i}>
                      <span className="text-sm font-mono bg-slate-700/60 px-3 py-1.5 rounded-lg text-slate-200 font-medium">
                        {atom.residue}{atom.residueNumber}
                      </span>
                      {i < measurement.atoms.length - 1 && (
                        <span className="text-slate-500 font-bold">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Timestamp */}
                <div className="text-sm text-slate-500 font-medium">
                  Measured {measurement.timestamp.toLocaleTimeString()}
                </div>

                {/* Notes */}
                {measurement.notes && (
                  <div className="mt-3 p-3 bg-slate-700/40 rounded-lg text-sm text-slate-300">
                    {measurement.notes}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredMeasurements.length === 0 && (
          <motion.div
            className="p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-700/60 rounded-2xl flex items-center justify-center">
              <Ruler className="w-10 h-10 text-slate-500" />
            </div>
            <p className="text-slate-400 mb-2 text-lg font-medium">
              {filter === 'all' ? 'No measurements yet' : `No ${filter} measurements`}
            </p>
            <p className="text-slate-500">
              Select atoms to start measuring
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdvancedMeasurementPanel;