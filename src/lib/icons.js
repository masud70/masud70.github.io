import {
  GraduationCap, BookOpen, Briefcase, Code, Cpu, Database, FileText,
  Award, Trophy, Medal, Star, Flag,
  Github, Globe, Link as LinkIcon, ExternalLink, Mail, Phone, MapPin,
  Calendar, Clock, Zap, Brain, Cog, Wrench, Hammer,
  Rocket, Flame, Sparkles, Lightbulb, Target, Crown,
  Folder, Package, Terminal, Smartphone, Monitor, Server, Cloud,
  FileCode, FileImage, File as FileIcon, Layers,
  School, Library, Microscope, BarChart3, TrendingUp, Users,
} from 'lucide-react';

/**
 * IconRegistry maps a string name (case-insensitive, dash/underscore tolerant)
 * to a lucide-react icon component. Authors write "graduation-cap" in Markdown;
 * we resolve to GraduationCap here.
 */
const MAP = {
  'graduation-cap': GraduationCap,
  'book': BookOpen,
  'book-open': BookOpen,
  'briefcase': Briefcase,
  'code': Code,
  'cpu': Cpu,
  'database': Database,
  'file': FileIcon,
  'file-text': FileText,
  'file-code': FileCode,
  'file-image': FileImage,

  'award': Award,
  'trophy': Trophy,
  'medal': Medal,
  'star': Star,
  'flag': Flag,
  'crown': Crown,

  'github': Github,
  'globe': Globe,
  'link': LinkIcon,
  'external-link': ExternalLink,
  'mail': Mail,
  'email': Mail,
  'phone': Phone,
  'location': MapPin,
  'map-pin': MapPin,

  'calendar': Calendar,
  'clock': Clock,
  'zap': Zap,
  'brain': Brain,
  'cog': Cog,
  'wrench': Wrench,
  'hammer': Hammer,

  'rocket': Rocket,
  'flame': Flame,
  'sparkles': Sparkles,
  'lightbulb': Lightbulb,
  'target': Target,

  'folder': Folder,
  'package': Package,
  'terminal': Terminal,
  'smartphone': Smartphone,
  'mobile': Smartphone,
  'monitor': Monitor,
  'server': Server,
  'cloud': Cloud,
  'layers': Layers,

  'school': School,
  'library': Library,
  'research': Microscope,
  'microscope': Microscope,
  'chart': BarChart3,
  'trending-up': TrendingUp,
  'users': Users,
};

function normalize(name) {
  if (!name || typeof name !== 'string') return '';
  return name.trim().toLowerCase().replace(/[_\s]+/g, '-');
}

/** Resolve an icon name to a component, or null if the name is unknown. */
export function getIcon(name) {
  const key = normalize(name);
  return MAP[key] || null;
}

/** Default dummy icon when nothing else is provided. */
export { Sparkles as DummyIcon };
