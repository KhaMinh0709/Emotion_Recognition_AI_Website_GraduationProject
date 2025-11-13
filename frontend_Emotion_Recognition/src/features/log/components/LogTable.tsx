// src/features/log/components/LogTable.tsx
import React from "react";
import { Info } from "lucide-react";
import { LogEntry } from "../utils/logTypes";

interface LogTableProps {
    logs: LogEntry[];
    loading?: boolean;
    onShowDetail: (log: LogEntry) => void;
}

export const LogTable: React.FC<LogTableProps> = ({ logs, loading, onShowDetail }) => {
    return (
        <div className="rounded-2xl border border-white/10 bg-slate-950/20 overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-slate-950/40 border-b border-white/5">
                    <tr>
                        <Th>Time</Th>
                        <Th>Source</Th>
                        <Th>Action</Th>
                        <Th>Level</Th>
                        <Th>Message</Th>
                        <Th className="text-right pr-4">Detail</Th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="py-6 text-center text-gray-400">
                                Loading logs...
                            </td>
                        </tr>
                    ) : logs.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-500 text-sm">
                                Chưa có log nào.
                            </td>
                        </tr>
                    ) : (
                        logs.map((log) => (
                            <tr
                                key={log.id}
                                className="border-b border-white/5 hover:bg-white/5/10 transition-colors"
                            >
                                <Td>{new Date(log.timestamp).toLocaleTimeString()}</Td>
                                <Td className="capitalize">{log.source.replace("-", " ")}</Td>
                                <Td>{log.action}</Td>
                                <Td>
                                    <LevelBadge level={log.level} />
                                </Td>
                                <Td
                                    className="max-w-[280px] truncate"
                                    title={log.message}
                                >
                                    {log.message}
                                </Td>
                                <td className="py-3 px-3 text-right">
                                    <button
                                        onClick={() => onShowDetail(log)}
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-100 transition"
                                        title="View detail"
                                    >
                                        <Info className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

function Th(
    {
        children,
        className = "",
        ...rest
    }: {
        children: React.ReactNode;
        className?: string;
    } & React.HTMLAttributes<HTMLTableCellElement>
) {
    return (
        <th
            className={
                "text-left text-[11px] uppercase tracking-wide text-gray-400 py-3 px-3 " + className
            }
            {...rest}
        >
            {children}
        </th>
    );
}

function Td(
    {
        children,
        className = "",
        ...rest
    }: {
        children: React.ReactNode;
        className?: string;
    } & React.TdHTMLAttributes<HTMLTableCellElement>
) {
    return (
        <td className={"py-3 px-3 text-sm text-gray-100 " + className} {...rest}>
            {children}
        </td>
    );
}

function LevelBadge({ level }: { level: string }) {
    if (level === "error")
        return (
            <span className="px-2 py-0.5 text-xs rounded-full bg-rose-500/15 text-rose-100 border border-rose-500/25">
                Error
            </span>
        );
    if (level === "warning")
        return (
            <span className="px-2 py-0.5 text-xs rounded-full bg-amber-400/15 text-amber-100 border border-amber-400/25">
                Warning
            </span>
        );
    if (level === "audit")
        return (
            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/15 text-purple-100 border border-purple-500/25">
                Audit
            </span>
        );
    return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-sky-500/15 text-sky-100 border border-sky-500/25">
            Info
        </span>
    );
}
