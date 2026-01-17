"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Loader2, XCircle, Users, FileCheck, Rocket } from "lucide-react";

interface ProgressTrackerProps {
  status: 'requested' | 'in_progress' | 'completed' | 'rejected';
  assignedTeam?: string[];
}

const stages = [
  { id: 'requested', label: 'Request Submitted', icon: FileCheck },
  { id: 'team_assigned', label: 'Team Assigned', icon: Users },
  { id: 'in_progress', label: 'In Development', icon: Loader2 },
  { id: 'completed', label: 'Delivered', icon: Rocket },
];

export function ProgressTracker({ status, assignedTeam }: ProgressTrackerProps) {
  const getCurrentStage = () => {
    if (status === 'rejected') return -1;
    if (status === 'completed') return 3;
    if (status === 'in_progress') return 2;
    if (assignedTeam && assignedTeam.length > 0) return 1;
    return 0;
  };

  const currentStage = getCurrentStage();

  if (status === 'rejected') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="font-semibold text-red-700">Request Declined</h3>
        <p className="text-sm text-red-600 mt-1">
          Your project request has been declined. Please contact support for more information.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full" />
        <motion.div
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        <div className="relative flex justify-between">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isCompleted = index <= currentStage;
            const isCurrent = index === currentStage;
            
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                      : 'bg-muted text-muted-foreground'
                  } ${isCurrent ? 'ring-4 ring-indigo-200' : ''}`}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {isCompleted && index < currentStage ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isCurrent && status === 'in_progress' && index === 2 ? 'animate-spin' : ''}`} />
                  )}
                </motion.div>
                <span className={`mt-2 text-xs font-medium text-center max-w-[80px] ${
                  isCompleted ? 'text-indigo-600' : 'text-muted-foreground'
                }`}>
                  {stage.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center"
      >
        {status === 'requested' && !assignedTeam?.length && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            Waiting for team assignment
          </div>
        )}
        {status === 'requested' && assignedTeam && assignedTeam.length > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm">
            <Users className="w-4 h-4" />
            {assignedTeam[0]} assigned - Approval pending
          </div>
        )}
        {status === 'in_progress' && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Your project is being developed
          </div>
        )}
        {status === 'completed' && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm">
            <Rocket className="w-4 h-4" />
            Project delivered successfully!
          </div>
        )}
      </motion.div>
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export function AnimatedProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">{progress}%</span>
        </div>
      )}
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full progress-bar-animated"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
