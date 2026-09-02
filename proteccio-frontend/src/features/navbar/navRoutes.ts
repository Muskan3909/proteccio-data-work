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
    path: '/proteccio/home',
    adminOnly: false,
    freePlanFeature: true,
  },
  {
    name: 'projects',
    path: '/proteccio/projects',
    adminOnly: false,
    freePlanFeature: true,
  },
  {
    name: 'schedule',
    path: '/proteccio/schedule',
    adminOnly: true,
    freePlanFeature: false,
  },
  {
    name: 'reporting',
    path: '/proteccio/reporting/overview',
    adminOnly: true,
    freePlanFeature: false,
  },
  {
    name: 'Team Reports',
    path: '/proteccio/team-lead-reports',
    adminOnly: false,
    freePlanFeature: true,
    teamLeadOnly: true,
  },
  {
    name: 'client-portal',
    path: '/proteccio/client-portal/clients',
    adminOnly: true,
    freePlanFeature: false,
    businessPlanRequired: true,
    selfHostedExcluded: true,
  },
];
