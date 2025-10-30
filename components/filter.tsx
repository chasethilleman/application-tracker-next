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
        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="statusFilter"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                    Filter by status
                </label>
                <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
