export default function Filter({
    statusFilter,
    setStatusFilter,
    statusOptions,
}: {
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    statusOptions: string[];
}) {
    return (
        <div className="mb-4 flex items-center space-x-2">
            <label htmlFor="statusFilter" className="font-medium">
                Filter by Status:
            </label>
            <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded border border-gray-300 px-2 py-1"
            >
                {statusOptions.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        </div>
    );
}