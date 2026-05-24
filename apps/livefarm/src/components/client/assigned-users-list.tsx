'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  AssignedUser,
  Avatar,
  Icon,
  Pagination,
  useDynamicPageSize,
} from '@@agrosphere/shared';
import { AssignUsersDialogWrapper } from './assign-users-dialog';
interface AssignedUsersListProps {
  users: AssignedUser[];
}

export function AssignedUsersList({ users }: AssignedUsersListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { pageSize: dynamicPageSize } = useDynamicPageSize(containerRef, {
    estimatedRowHeight: 60,
    headerHeight: 80,
    paginationHeight: 80,
  });

  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(users.map((u) => u.name));
  const [tempSelected, setTempSelected] = useState<string[]>(selected);

  const assignedUsers = users.filter((u) => selected.includes(u.name));
  const pageSize = dynamicPageSize;
  const totalPagesAssigned = pageSize
    ? Math.ceil(assignedUsers.length / pageSize)
    : 0;
  const pagedUsersAssigned = pageSize
    ? assignedUsers.slice((page - 1) * pageSize, page * pageSize)
    : [];

  useEffect(() => {
    setPage(1);
  }, [assignedUsers.length]);

  useEffect(() => {
    if (page > totalPagesAssigned && totalPagesAssigned > 0) {
      setPage(totalPagesAssigned);
    }
  }, [page, totalPagesAssigned]);

  useEffect(() => {
    setTempSelected(selected);
  }, [selected]);

  const handleOpenDialog = () => {
    setTempSelected(selected);
    setDialogOpen(true);
  };

  const handleSave = () => {
    setSelected(tempSelected);
    setDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-xl border border-basic-white h-full flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between p-5 border-b border-basic-white">
        <h3 className="text-base font-semibold">
          Users assigned to the client
        </h3>
        <Icon aria-label="Add user" onClick={handleOpenDialog} icon="add" />
      </div>
      <div className="flex-1 min-h-0 overflow-auto p-5">
        {pagedUsersAssigned.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center pt-8">
            <div className="text-xl font-semibold mb-2 text-basic-black">
              No users assigned
            </div>
            <div className="text-basic-black mb-4 max-w-xs">
              Assign users to this client to manage their tasks and
              responsibilities.
            </div>
          </div>
        ) : (
          pagedUsersAssigned.map((user, i) => (
            <div key={user.name}>
              <div className="flex items-center text-sm font-medium">
                <Avatar
                  className="rounded-sm bg-[#00AF4D1F] w-7 h-7 text-basic-greenfont-bold mr-4"
                  row={{
                    original: {
                      client: {
                        name: user.name,
                        surname: '',
                        avatarSrc: user.avatar,
                      },
                    },
                  }}
                  rounded="md"
                  tooltipText={user.name}
                />
                <span className="text-basic-black">{user.name}</span>
                <span className="ml-auto bg-basic-white text-basic-black py-[1.5px] text-xs rounded-[4px] px-2 font-normal">
                  {user.role}
                </span>
              </div>
              {i !== pagedUsersAssigned.length - 1 && (
                <div className="w-full h-px bg-basic-white my-3" />
              )}
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex-shrink-0">
        <Pagination
          currentPage={page}
          totalPages={totalPagesAssigned}
          onPageChange={setPage}
          maxVisiblePages={4}
          prevButtonText="Previous"
          nextButtonText="Next"
          activeClassName="bg-[#16C35D] text-white rounded-xl"
          itemClassName="w-10 h-10 flex items-center justify-center rounded-xl text-base font-medium"
          containerClassName="justify-center"
        />
      </div>
      <AssignUsersDialogWrapper
        open={dialogOpen}
        onClose={handleCloseDialog}
        users={users}
        selected={tempSelected}
        onChangeSelected={setTempSelected}
        onSave={handleSave}
      />
    </div>
  );
}
