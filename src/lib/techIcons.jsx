import {
  SiPython, SiCplusplus, SiC, SiOpenjdk, SiJavascript, SiTypescript, SiPhp,
  SiPytorch, SiTensorflow, SiLangchain, SiOllama,
  SiReact, SiNextdotjs, SiExpress, SiNodedotjs, SiFlutter, SiHtml5, SiTailwindcss,
  SiMysql, SiPostgresql, SiMongodb, SiSqlite,
  SiGit, SiGithub, SiLatex, SiElectron, SiLinux, SiDocker,
} from 'react-icons/si';
import { Css3 } from './Css3Icon.jsx';

/**
 * Maps a skill label to its brand mark and official colour.
 *
 * Keys are matched case-insensitively after stripping non-alphanumerics, so
 * "Node.js", "nodejs", and "Node JS" all resolve to the same entry. Skills
 * with no entry simply render without an icon — nothing breaks.
 */
const TECH = {
  python:        [SiPython, '#3776AB'],
  c:             [SiC, '#A8B9CC'],
  cpp:           [SiCplusplus, '#00599C'],
  cplusplus:     [SiCplusplus, '#00599C'],
  java:          [SiOpenjdk, '#ED8B00'],
  javascript:    [SiJavascript, '#F7DF1E'],
  typescript:    [SiTypescript, '#3178C6'],
  php:           [SiPhp, '#777BB4'],

  pytorch:       [SiPytorch, '#EE4C2C'],
  tensorflow:    [SiTensorflow, '#FF6F00'],
  langchain:     [SiLangchain, '#1C3C3C'],
  langgraph:     [SiLangchain, '#1C3C3C'],
  ollama:        [SiOllama, '#000000'],

  react:         [SiReact, '#61DAFB'],
  reactjs:       [SiReact, '#61DAFB'],
  reactnative:   [SiReact, '#61DAFB'],
  nextjs:        [SiNextdotjs, '#000000'],
  express:       [SiExpress, '#000000'],
  expressjs:     [SiExpress, '#000000'],
  nodejs:        [SiNodedotjs, '#5FA04E'],
  node:          [SiNodedotjs, '#5FA04E'],
  flutter:       [SiFlutter, '#02569B'],
  html:          [SiHtml5, '#E34F26'],
  html5:         [SiHtml5, '#E34F26'],
  css:           [Css3, '#1572B6'],
  css3:          [Css3, '#1572B6'],
  tailwindcss:   [SiTailwindcss, '#06B6D4'],
  electronjs:    [SiElectron, '#47848F'],
  electron:      [SiElectron, '#47848F'],

  mysql:         [SiMysql, '#4479A1'],
  postgresql:    [SiPostgresql, '#4169E1'],
  mongodb:       [SiMongodb, '#47A248'],
  sqlite:        [SiSqlite, '#003B57'],

  git:           [SiGit, '#F05032'],
  gitgithub:     [SiGithub, '#181717'],
  github:        [SiGithub, '#181717'],
  latex:         [SiLatex, '#008080'],
  linux:         [SiLinux, '#FCC624'],
  docker:        [SiDocker, '#2496ED'],
};

function normalize(label) {
  return String(label || '')
    .toLowerCase()
    .replace(/\+\+/g, 'pp')
    .replace(/[^a-z0-9]/g, '');
}

/** Returns [Component, brandColor] or null when the skill has no known mark. */
export function techIcon(label) {
  return TECH[normalize(label)] || null;
}
