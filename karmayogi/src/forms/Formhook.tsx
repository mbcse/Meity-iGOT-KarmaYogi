import { useEffect, useState } from "react";

interface Template {
  id: string;
  name: string;
  body: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export function useFetchSubFormData(templateType: string) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [buckets, setBuckets] = useState<string[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(
          `http://localhost:3010/templates/list/${templateType}`
        );
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    const fetchBuckets = async () => {
      try {
        const response = await fetch(`/api/db/showviewlist`);
        const data = await response.json();
        setBuckets(data);
      } catch (error) {
        console.error("Error fetching buckets:", error);
      }
    };

    fetchBuckets();
    fetchTemplates();
  }, [templateType]);

  return { templates, buckets };
}
