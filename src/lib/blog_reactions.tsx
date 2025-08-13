
import {
  FaHandsHelping,
  FaInfoCircle,
  FaCheckCircle,
  FaCalendarDay,
  FaLightbulb,
  FaPenFancy,
  FaBrain,
  FaSmile,
  FaHeart,
  FaBolt,
} from 'react-icons/fa';
import type { JSX } from 'react';
import { ReactionRow } from './types';
export type Reaction = ReactionRow['response'][number];
export const formatLabel = (reaction: string) =>
    reaction.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const iconMap: Record<Reaction, () => JSX.Element> = {
  helpful: () => <FaHandsHelping size={18} />,
  informative: () => <FaInfoCircle size={18} />,
  solved_my_issue: () => <FaCheckCircle size={18} />,
  daily_read: () => <FaCalendarDay size={18} />,
  inspiring: () => <FaLightbulb size={18} />,
  well_written: () => <FaPenFancy size={18} />,
  thought_provoking: () => <FaBrain size={18} />,
  entertaining: () => <FaSmile size={18} />,
  supportive: () => <FaHeart size={18} />,
  actionable: () => <FaBolt size={18} />,
};
