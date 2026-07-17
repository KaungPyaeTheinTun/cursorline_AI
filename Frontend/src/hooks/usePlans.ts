import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../lib/axios";
import type { Plan } from "../types";

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    try {
      const { data } = await apiClient.get<Plan[]>("/plans");
      setPlans(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading };
}
