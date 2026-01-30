// src/hooks/useReferences.ts
import { useState, useEffect } from 'react';
import { commissionService } from '@/services/commission.service';

export interface ReferenceData {
  commissions: any[];
  regions: any[];
  departements: any[];
  sousPrefectures: any[];
  communes: any[];
  loading: boolean;
  error: string | null;
}

export const useReferences = (): ReferenceData => {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [departements, setDepartements] = useState<any[]>([]);
  const [sousPrefectures, setSousPrefectures] = useState<any[]>([]);
  const [communes, setCommunes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferences = async () => {
      setLoading(true);
      try {
        const [
          commissionsData,
          regionsData,
          departementsData,
          sousPrefecturesData,
          communesData
        ] = await Promise.all([
          commissionService.getAllCommissions(),
          commissionService.getRegions(),
          commissionService.getAllDepartements(),
          commissionService.getAllSousPrefectures(),
          commissionService.getAllCommunes()
        ]);

        setCommissions(commissionsData);
        setRegions(regionsData);
        setDepartements(departementsData);
        setSousPrefectures(sousPrefecturesData);
        setCommunes(communesData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching references:', err);
        setError(err.message || 'Erreur lors du chargement des références');
      } finally {
        setLoading(false);
      }
    };

    fetchReferences();
  }, []);

  return {
    commissions,
    regions,
    departements,
    sousPrefectures,
    communes,
    loading,
    error
  };
};