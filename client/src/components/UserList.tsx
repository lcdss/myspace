import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import IconButton from '@material-ui/core/IconButton';
import TableFooter from '@material-ui/core/TableFooter';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';

import { User } from '../types';

interface UserListProps {
  items: User[];
  page: number;
  rowsPerPage: number;
  totalRows: number;
  onEdit: (User: User) => void;
  onDelete: (User: User) => void;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

interface Column {
  id: 'name' | 'email' | 'cpf' | 'avatar';
  label: string;
  minWidth?: number;
  align?: 'right';
}

const columns: Column[] = [
  { id: 'avatar', label: 'Avatar', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 200 },
  { id: 'email', label: 'E-mail', minWidth: 200 },
  { id: 'cpf', label: 'CPF', minWidth: 150 },
];

const UserList: React.FC<UserListProps> = ({
  items,
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}) => {
  return (
    <Paper elevation={2}>
      <TableContainer style={{ maxHeight: 920 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                  align={column.align}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell align="center" style={{ width: 130 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(user => {
              return (
                <TableRow hover tabIndex={-1} key={user.id}>
                  {columns.map(column => {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'avatar' ? (
                          <Avatar src={user[column.id]} />
                        ) : (
                          user[column.id]
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell key={user.id} align="center">
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(user)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => onDelete(user)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={(_event, page) => onPageChange(page)}
                onChangeRowsPerPage={e => onRowsPerPageChange(+e.target.value)}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserList;
