import { useEffect, useState } from "react";
import { contentAPI } from "@/utils/api";

export default function useEditableContent(page) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    contentAPI
      .getByPage(page)
      .then((response) => setRecords(response?.data || []))
      .catch(() => {});
  }, [page]);

  const get = (section, field, fallback = "") => {
    const record = records.find((item) => item.section === section);
    return record?.[field] || fallback;
  };

  const getItems = (section) =>
    records
      .filter((item) => item.section === section && item.isActive !== false)
      .map((item) => ({
        ...item,
        description: item.content || item.description || "",
      }));

  return { records, get, getItems };
}
