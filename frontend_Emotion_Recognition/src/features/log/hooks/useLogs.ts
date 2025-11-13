// src/features/log/hooks/useLogs.ts
import { useEffect, useMemo, useState } from "react";
import { fetchLogs, clearLogs, exportLogs } from "../services/logService";
import { LogEntry, LogLevel } from "../utils/logTypes";

export function useLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<LogLevel | "all">("all");
  const [selected, setSelected] = useState<LogEntry | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchLogs()
      .then((data) => {
        if (mounted) setLogs(data);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchLevel = level === "all" ? true : log.level === level;
      const matchSearch =
        !search ||
        log.message.toLowerCase().includes(search.toLowerCase()) ||
        log.source.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.user?.toLowerCase().includes(search.toLowerCase());
      return matchLevel && matchSearch;
    });
  }, [logs, search, level]);

  const handleClear = async () => {
    await clearLogs();
    setLogs([]);
    setSelected(null);
  };

  const handleExport = async () => {
    const blob = await exportLogs();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    logs,
    loading,
    filtered,
    search,
    setSearch,
    level,
    setLevel,
    selected,
    setSelected,
    handleClear,
    handleExport,
  };
}
