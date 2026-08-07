/**
 * Shared constants for RareRoles application
 * Single source of truth for frontier roles data
 */

import type { SVGProps } from "react";
import {
  BuildingLibraryIcon,
  CloudArrowUpIcon,
  CogIcon,
  ArrowPathIcon,
  CpuChipIcon,
  SparklesIcon,
  ChartBarIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

export type FrontierRole = {
  title: string;
  blurb: string;
  cta: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
};

export const frontierRoles: FrontierRole[] = [
  {
    title: "Oracle PL/SQL Developers",
    blurb: "",
    cta: "",
    icon: BuildingLibraryIcon,
  },
  {
    title: "CCIE Network Engineers",
    blurb: "",
    cta: "",
    icon: CloudArrowUpIcon,
  },
  {
    title: "AIX System Administrators",
    blurb: "",
    cta: "",
    icon: CogIcon,
  },
  {
    title: "SharePoint Engineers",
    blurb: "",
    cta: "",
    icon: ArrowPathIcon,
  },
  {
    title: "AI / Machine Learning Engineers",
    blurb: "",
    cta: "",
    icon: CpuChipIcon,
  },
  {
    title: "AI Automation Engineers",
    blurb: "",
    cta: "",
    icon: SparklesIcon,
  },
  {
    title: "Solution Architects",
    blurb: "",
    cta: "",
    icon: ChartBarIcon,
  },
  {
    title: "AI Operators",
    blurb: "",
    cta: "",
    icon: BoltIcon,
  },
  {
    title: "AI-Enabled Software Engineers",
    blurb: "",
    cta: "",
    icon: SparklesIcon,
  },
];
