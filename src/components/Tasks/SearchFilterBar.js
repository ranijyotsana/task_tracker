import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, setSortBy, setSearchQuery } from '../../features/tasks/taskSlice';

const SearchFilterBar = () => {
  const dispatch = useDispatch();
  const { filter, sortBy, searchQuery } = useSelector(state => state.tasks);

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-6 p-4 bg-white dark:bg-gray-800 shadow rounded">
      <input
        type="text"
        placeholder="Search by title or description"
        className="p-3 border rounded w-full md:w-1/3 focus:ring-2 focus:ring-blue-400"
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      />

      <select
        className="p-3 border rounded bg-blue-50"
        value={filter}
        onChange={(e) => dispatch(setFilter(e.target.value))}
      >
        <option value="">All Status</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Pending Approval">Pending Approval</option>
        <option value="Closed">Closed</option>
      </select>

      <select
        className="p-3 border rounded bg-purple-50"
        value={sortBy}
        onChange={(e) => dispatch(setSortBy(e.target.value))}
      >
        <option value="">Sort By</option>
        <option value="priority">Priority</option>
        <option value="status">Status</option>
        <option value="date">Created Date</option>
      </select>
    </div>
  );
};

export default SearchFilterBar;
