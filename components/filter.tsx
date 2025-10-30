type FilterProps = {
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    statusOptions: string[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
};

export default function Filter({
    statusFilter,
    setStatusFilter,
    statusOptions,
    searchTerm,
    onSearchChange,
    onClearSearch,
}: FilterProps) {
    return (
        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors dark:border-neutral-800 dark:bg-neutral-900 md:border-b">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="applicationSearch"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Search applications
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            id="applicationSearch"
                            type="search"
                            value={searchTerm}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder="Company, title, or notes"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {searchTerm.trim().length > 0 && (
                            <button
                                type="button"
                                onClick={onClearSearch}
                                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
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
                        className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
