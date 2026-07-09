import api from "./axios";

export const fetchFlashcardSets = async (
  params?: Record<string, string | number>,
) => {
  const res = await api.get("/sets", { params });
  return res.data.data.items;
};

export const fetchFlashcardSetDetail = async (id: string) => {
  const res = await api.get(`/sets/${id}`);
  return res.data.data;
};

export const fetchUserProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data.data;
};

export const fetchDashboardStats = async () => {
  // Combine user profile and recent sets to build a lightweight dashboard payload
  const [userRes, setsRes] = await Promise.all([
    api.get("/users/profile").catch(() => ({ data: { data: null } })),
    api
      .get("/sets", { params: { limit: 3 } })
      .catch(() => ({ data: { data: { items: [] } } })),
  ]);

  const user = userRes?.data?.data || null;
  const recentSets = setsRes?.data?.data?.items || [];

  return {
    streak: user?.streak || 0,
    totalCardsLearned: user?.totalCardsLearned || 0,
    cardsDueToday: 0,
    totalStudyTime: user?.totalStudyTime || 0,
    weeklyProgress: user?.weeklyProgress || [0, 0, 0, 0, 0, 0, 0],
    recentSets,
    xp: user?.xp || 0,
    level: user?.level || 1,
    xpToNextLevel: user?.xpToNextLevel || 1000,
  };
};
