export const useBusinessFeatures = () => {
  return {
    hasBusinessAccess: true,
    isFreeUser: false,
    isFeatureEnabled: (_featureName?: string) => true,
    getEnabledFeatures: () => [] as string[],
  };
};

export default useBusinessFeatures;
