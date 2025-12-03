import portrait from "@/assets/leaders/leader-portrait.svg";
import educationLead from "@/assets/leaders/leader-education.svg";
import healthLead from "@/assets/leaders/leader-health.svg";
import { LeaderCategory, LeaderProfile } from "@/types";

const principal: LeaderProfile & { speech: string } = {
  name: "Alemu Tesfaye",
  title: "Woreda 9 Administrator",
  photo: portrait,
  speech:
    "We advance every citizen’s wellbeing through measured plans, diligent service, and transparent communication.",
};

const categories: LeaderCategory[] = [
  {
    id: "education",
    title: "Education & Youth",
    leaders: [
      {
        name: "Selamawit Teklu",
        title: "Education Chief",
        photo: educationLead,
      },
      {
        name: "Mulat Yirga",
        title: "Youth Programs Director",
        photo: educationLead,
      },
      {
        name: "Tigist Bekele",
        title: "School Supervisor",
        photo: educationLead,
      },
      {
        name: "Dawit Kebede",
        title: "Curriculum Specialist",
        photo: educationLead,
      },
      {
        name: "Hana Mekonnen",
        title: "Youth Coordinator",
        photo: educationLead,
      },
    ],
  },
  {
    id: "health",
    title: "Health & Community Services",
    leaders: [
      {
        name: "Teshome Alemu",
        title: "Health Director",
        photo: healthLead,
      },
      {
        name: "Eden Gebremedhin",
        title: "Social Services Coordinator",
        photo: healthLead,
      },
      {
        name: "Dr. Abebe Tadesse",
        title: "Medical Officer",
        photo: healthLead,
      },
      {
        name: "Sara Yohannes",
        title: "Public Health Nurse",
        photo: healthLead,
      },
    ],
  },
  {
    id: "planning",
    title: "Planning & Infrastructure",
    leaders: [
      {
        name: "Mihret Hailemariam",
        title: "Planning Officer",
        photo: portrait,
      },
      {
        name: "Dereje Solomon",
        title: "Infrastructure Liaison",
        photo: portrait,
      },
      {
        name: "Kassahun Tsegaye",
        title: "Urban Planner",
        photo: portrait,
      },
      {
        name: "Bethlehem Assefa",
        title: "Project Manager",
        photo: portrait,
      },
    ],
  },
];

export const woredaLeadership = {
  principal,
  categories,
};


