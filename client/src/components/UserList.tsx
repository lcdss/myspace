import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';

import DataTable from './DataTable';
import { User } from '../model/users';
import { useStoreState } from '../hooks';
import { useStoreActions } from '../hooks';
import AvatarField from './AvatarField';
import PostDetails from './PostDetails';
import AddIcon from '@material-ui/icons/Add';

interface UserListProps {
  onAddClick: () => void;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

export default function UserList({
  onAddClick,
  onPageChange,
  onRowsPerPageChange,
}: UserListProps) {
  const [filters, setFilters] = useState<{ [K in keyof User]?: string }>({});
  const [selectedRow, setSelectedRow] = useState();
  const { items, loading, pagination } = useStoreState(state => state.users);
  const { fetchItems, update, destroy } = useStoreActions(
    actions => actions.users,
  );

  console.log('User List rendered');

  return (
    <Paper elevation={2}>
      <DataTable<User>
        isLoading={loading}
        data={items}
        page={pagination.page}
        totalCount={pagination.total}
        title="Users"
        onChangeRowsPerPage={onRowsPerPageChange}
        onChangePage={page => {
          setSelectedRow(null);
          onPageChange(page);
        }}
        columns={[
          {
            title: 'Avatar',
            field: 'avatar',
            sorting: false,
            grouping: false,
            filtering: false,
            render: user => <Avatar src={user.avatar} />,
            editComponent: props => (
              <AvatarField
                name="avatar"
                size={40}
                src={props.rowData.avatar}
                onChange={event => props.onChange(event.target.files)}
              />
            ),
          },
          {
            title: 'Name',
            field: 'name',
            defaultFilter: filters.name,
            searchable: true,
            grouping: false,
          },
          {
            title: 'E-mail',
            field: 'email',
            defaultFilter: filters.email,
            grouping: false,
          },
          {
            title: 'CPF',
            field: 'cpf',
            defaultFilter: filters.cpf,
            grouping: false,
          },
          {
            title: 'Points',
            field: 'points',
            type: 'numeric',
            filtering: false,
            render: user => (
              <TextField
                name="points"
                type="number"
                defaultValue={user.points}
                onBlur={event => {
                  const points = +event.target.value;

                  // Only update if the points has changed
                  if (points === user.points) return;

                  update({
                    id: user.id,
                    formData: { points },
                  })
                    .then(() => console.log('Points saved'))
                    .catch((error: any) => console.error(error));
                }}
                onKeyDown={event => {
                  if (event.key === 'Tab') {
                    event.preventDefault();

                    const tableBodyEl = event.currentTarget.closest('tbody');

                    if (!tableBodyEl) return;

                    const pointsElList = tableBodyEl.querySelectorAll(
                      'input[type="number"]',
                    );
                    const currentIndex = [...pointsElList.values()].findIndex(
                      el => el === event.target,
                    );

                    const nextIndex =
                      currentIndex + 1 < pointsElList.length
                        ? currentIndex + 1
                        : 0;

                    (pointsElList.item(nextIndex) as HTMLInputElement).focus();
                  }
                }}
              />
            ),
          },
          {
            title: 'Created At',
            field: 'createdAt',
            type: 'date',
            editable: 'never',
          },
        ]}
        editable={{
          onRowUpdate: ({ id, name, email, cpf, avatar, points }) => {
            return update({
              id,
              formData: {
                name,
                email,
                cpf,
                points,
                avatar: typeof avatar === 'string' ? undefined : avatar,
              },
            });
          },
          onRowDelete: ({ id }) => destroy({ id }),
        }}
        detailPanel={rowData => {
          return <PostDetails id={rowData.id} />;
        }}
        actions={[
          {
            icon: () => <AddIcon />,
            tooltip: 'Add',
            isFreeAction: true,
            onClick: onAddClick,
          },
        ]}
        options={{
          actionsColumnIndex: Number.MAX_VALUE,
          draggable: true,
          exportButton: true,
          exportAllData: true,
          exportFileName: `users_${new Date().toLocaleDateString()}`,
          grouping: true,
          selection: true,
          filtering: true,
          pageSize: pagination.perPage,
          paginationType: 'stepped',
          emptyRowsWhenPaging: false,
          columnsButton: true,
          debounceInterval: 500,
          pageSizeOptions: [10, 25, 50, 100],
          rowStyle: (rowData, index) => {
            return {
              backgroundColor:
                rowData.tableData.id === selectedRow?.tableData?.id ||
                rowData.tableData.checked
                  ? 'rgb(216, 232, 230)'
                  : index % 2 === 0
                  ? '#fff'
                  : '#eee',
            };
          },
        }}
        onSearchChange={searchText =>
          fetchItems({ page: 1, search: searchText, filter: filters })
        }
        onFilterChange={filters => {
          let filterParam = {};

          filters
            .filter(filter => filter.column.field !== undefined)
            .map(field => ({
              [field.column.field as string]: field.value,
            }))
            .forEach(filter => {
              filterParam = { ...filterParam, ...filter };
            });

          setFilters(filterParam);

          fetchItems({ page: 1, filter: filterParam });
        }}
        onRowClick={(_event, rowData) =>
          rowData?.id === selectedRow?.id
            ? setSelectedRow(null)
            : setSelectedRow(rowData)
        }
      />
    </Paper>
  );
}
