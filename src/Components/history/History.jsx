import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import './history.css'
import { useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import { Button, List, ListItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { getHistoryRoomChat } from '../../Services/RoomChatService';

const columns = [
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'code', label: 'Code Course', minWidth: 30 },
    {
        id: 'start',
        label: 'Start Date',
        minWidth: 100,
        align: 'right',
    },
    {
        id: 'end',
        label: 'End Date',
        minWidth: 100,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'rate',
        label: 'Rating',
        minWidth: 100,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
];

function createData(email, code, start, end, rate, status, room_id ) {
    return { email, code, start, end, rate, status, room_id};
}

const rows = [
    createData('India', 'IN', '03/05/2022', '04/06/2023'),
];

function HistoryComponent() {

    const theme = useTheme();
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const [listHistory, setListHistory] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        console.log(event);
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const moveToGroupChat = (id) => {
        navigate(`/view-chat-history/${id}`);
    };

    useEffect(() => {
        getHistoryRoomChat((rs) => {
            console.log(rs);
            if(rs.statusCode === 200 && rs.data.length > 0) {
                const dataToRow = rs.data.map(obj => {
                    // Lấy ra user trò chuyện với user hiện tại
                    const getUser = obj.users.filter(user => user._id !== userId);
                    return createData(
                        getUser[0]?.email,
                        obj.courses.code,
                        obj.start_date.split(' ')[0],
                        obj.end_date.split(' ')[0],
                        obj.rate,
                        obj.status,
                        obj._id
                    );
                });
                setListHistory(dataToRow);
            }
        },userId);
    }, []);
    return (
        <Grid container className='history'>
            <Grid xs={12} item mb={2}>
                <Grid container className='history-filter'>
                    <Grid item xs={12} sm={6} md={3} lg={3} className='text-center-flex history-filter-item'>
                        <TextField
                            id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            className='history-filter-item-text history-email'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2} lg={2} className='text-center-flex history-filter'>
                        <TextField
                            id="outlined-basic"
                            label="Code"
                            variant="outlined"
                            className='history-filter-item-text'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={2}  className='text-center-flex history-filter-date history-filter'>
                        <DatePicker className='history-filter-item-text' label="Start Date" />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}  className='text-center-flex history-filter'>
                        <DatePicker className='history-filter-item-text' label="End Date" />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={2}  className='history-btn text-center-flex history-filter'>
                        <Button className='history-btn-filter'>
                            Filter
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth, fontWeight: 600, }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listHistory.length > 0 &&  listHistory
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                            <TableRow 
                                                style={{cursor: 'pointer'}} 
                                                onClick={() => moveToGroupChat(row.room_id)} 
                                                hover 
                                                role="checkbox" 
                                                tabIndex={-1} 
                                                key={row.code}
                                            >
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page || 0}
                        onPageChange={(e,value)=>handleChangePage(value)}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Grid>
        </Grid>
    )
};

export default HistoryComponent;