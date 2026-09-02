export type ProjectProgressFlags = {
  use_manual_progress?: boolean;
  use_weighted_progress?: boolean;
  use_time_progress?: boolean;
};

export const normalizeProjectProgressMode = (values: ProjectProgressFlags) => {
  const next = {
    use_manual_progress: Boolean(values.use_manual_progress),
    use_weighted_progress: Boolean(values.use_weighted_progress),
    use_time_progress: Boolean(values.use_time_progress),
  };

  const hasManual = next.use_manual_progress;
  const hasWeighted = next.use_weighted_progress;
  const hasTime = next.use_time_progress;

  if (hasManual) {
    return {
      use_manual_progress: true,
      use_weighted_progress: false,
      use_time_progress: false,
    };
  }

  if (hasWeighted) {
    return {
      use_manual_progress: false,
      use_weighted_progress: true,
      use_time_progress: false,
    };
  }

  if (hasTime) {
    return {
      use_manual_progress: false,
      use_weighted_progress: false,
      use_time_progress: true,
    };
  }

  return {
    use_manual_progress: false,
    use_weighted_progress: false,
    use_time_progress: false,
  };
};
