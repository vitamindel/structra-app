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
        className="fixed bottom-4 right-4 z-20 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-3"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
      >
        <button
          onClick={onToggleCollapse}
          className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors"
        >
          <Ruler className="w-5 h-5" />
          <span className="font-medium">{measurements.length}</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-20 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden max-w-sm"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      layout
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center">
            <Ruler className="w-5 h-5 mr-2 text-cyan-400" />
            Measurements
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onExportMeasurements}
              className="p-2 text-slate-400 hover:text-cyan-400 transition-colors rounded-lg hover:bg-slate-700/50"
              title="Export measurements"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClear}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700/50"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleCollapse}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-slate-700/50 rounded-lg p-1">
          {[
            { key: 'all', label: 'All', icon: <Target className="w-3 h-3" /> },
            { key: 'distance', label: 'Distance', icon: <Ruler className="w-3 h-3" /> },
            { key: 'angle', label: 'Angle', icon: <Triangle className="w-3 h-3" /> },
            { key: 'torsion', label: 'Torsion', icon: <RotateCw className="w-3 h-3" /> }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-3 py-1 rounded-md text-xs transition-all flex items-center space-x-1 ${
                filter === key
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
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
            className="mt-3 p-3 bg-slate-700/30 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center">
                <div className="text-slate-400">Count</div>
                <div className="text-white font-mono">{stats.count}</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400">Avg</div>
                <div className="text-white font-mono">{stats.avg.toFixed(1)}</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400">Min</div>
                <div className="text-white font-mono">{stats.min.toFixed(1)}</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400">Max</div>
                <div className="text-white font-mono">{stats.max.toFixed(1)}</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Measurements List */}
      <div className="max-h-80 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredMeasurements.map((measurement, index) => (
            <motion.div
              key={measurement.id}
              className={`border-b border-slate-700/50 last:border-b-0 transition-all ${
                selectedMeasurement === measurement.id ? 'bg-slate-700/50' : 'hover:bg-slate-700/20'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getMeasurementColor(measurement.type)}`}>
                      {getMeasurementIcon(measurement.type)}
                    </div>
                    <div>
                      <div className="text-white font-mono text-lg font-bold">
                        {formatValue(measurement)}
                      </div>
                      <div className="text-xs text-slate-400 capitalize">
                        {measurement.type} measurement
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onHighlightMeasurement(measurement.id)}
                      className={`p-2 rounded-lg transition-all ${
                        measurement.highlighted
                          ? 'bg-cyan-600 text-white'
                          : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50'
                      }`}
                      title="Highlight in viewer"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyMeasurement(measurement)}
                      className="p-2 text-slate-400 hover:text-green-400 transition-colors rounded-lg hover:bg-slate-700/50"
                      title="Copy measurement"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveMeasurement(measurement.id)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700/50"
                      title="Remove measurement"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Atom sequence */}
                <div className="flex items-center space-x-1 mb-2">
                  {measurement.atoms.map((atom, i) => (
                    <React.Fragment key={i}>
                      <span className="text-sm font-mono bg-slate-700/50 px-2 py-1 rounded text-slate-200">
                        {atom.residue}{atom.residueNumber}
                      </span>
                      {i < measurement.atoms.length - 1 && (
                        <span className="text-slate-500">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Timestamp */}
                <div className="text-xs text-slate-500">
                  Measured {measurement.timestamp.toLocaleTimeString()}
                </div>

                {/* Notes */}
                {measurement.notes && (
                  <div className="mt-2 p-2 bg-slate-700/30 rounded text-sm text-slate-300">
                    {measurement.notes}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredMeasurements.length === 0 && (
          <motion.div
            className="p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
              <Ruler className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 mb-1">
              {filter === 'all' ? 'No measurements yet' : `No ${filter} measurements`}
            </p>
            <p className="text-sm text-slate-500">
              Select atoms to start measuring
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdvancedMeasurementPanel;