
import React from 'react';
import { Briefcase, User, Calendar, CreditCard, Clock } from 'lucide-react';

export const ICONS = {
  SERVICE: <Briefcase className="w-4 h-4" />,
  CLIENT: <User className="w-4 h-4" />,
  DATE: <Calendar className="w-4 h-4" />,
  VALUE: <CreditCard className="w-4 h-4" />,
  TIME: <Clock className="w-4 h-4" />,
};

export const APP_THEME = {
  primary: 'blue-600',
  secondary: 'slate-600',
  success: 'emerald-600',
  danger: 'red-600',
  background: 'slate-50',
};
