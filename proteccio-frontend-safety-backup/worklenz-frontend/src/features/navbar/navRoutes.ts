export type NavRoutesType = {
  name: string;
  path: string;
  adminOnly: boolean;
  freePlanFeature?: boolean;
  businessPlanRequired?: boolean;
  selfHostedExcluded?: boolean;
  teamLeadOnly?: boolean;
};

export const navRoutes: NavRoutesType[] = [
  {
    name: 'home',
    path: '/Proteccio/home',
    adminOnly: false,
    freePlanFeature: true,
  },
  {
    name: 'projects',
    path: '/Proteccio/projects',
    adminOnly: false,
    freePlanFeature: true,
  },
  {
    name: 'schedule',
    path: '/Proteccio/schedule',
    adminOnly: true,
    freePlanFeature: false,
  },
  {
    name: 'reporting',
    path: '/Proteccio/reporting/overview',
    adminOnly: true,
    freePlanFeature: false,
  },
  {
    name: 'Team Reports',
    path: '/Proteccio/team-lead-reports',
    adminOnly: false,
    freePlanFeature: true,
    teamLeadOnly: true,
  },
  {
    name: 'client-portal',
    path: '/Proteccio/client-portal/clients',
    adminOnly: true,
    freePlanFeature: false,
    businessPlanRequired: true,
    selfHostedExcluded: true,
  },
];
