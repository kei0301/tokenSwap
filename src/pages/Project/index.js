import React, { useEffect, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import { Box, Button, ButtonGroup, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { SetRepo } from '../../store/Git';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import FolderIcon from '@mui/icons-material/Folder';
import PageviewIcon from '@mui/icons-material/Pageview';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import toast from 'react-hot-toast';
import { green, pink } from '@mui/material/colors';

const currencies = [
    {
        value: '20',
        label: '20',
    },
    {
        value: '50',
        label: '50',
    },
    {
        value: '100',
        label: '100',
    }
];

const label = { inputProps: { 'aria-label': 'Switch demo' } };


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </Box>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const columns = [
    { id: 'image', label: 'avatar', minWidth: 50 },
    { id: 'nft_name', label: 'Name', minWidth: 50 },
    { id: 'status', label: 'Status', minWidth: 70 },
    { id: 'floor_price', label: 'Floor', minWidth: 70 },
    { id: 'supply', label: 'Supply', minWidth: 70 },
    { id: 'royalty_fee', label: 'Royality', minWidth: 70 },
    { id: 'one_day_volume', label: 'one_day_volume' },
    { id: 'seven_day_volume', label: 'seven_day_volume' },
    { id: 'thirty_day_volume', label: 'thirty_day_volume' },
    { id: 'opensea', label: 'OpenSea' },
    { id: 'contract_address', label: 'Etherscan' },
    { id: 'discord', label: 'Discord' },
    { id: 'website', label: 'Metroverse' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'revealed_at', label: 'Revealed_at', minWidth: 70 },
];


export default function Project() {

    const [currency, setCurrency] = React.useState('50');
    const [pagenumber, setPagenumber] = useState(1);

    const handleChange = (event) => {
        setCurrency(event.target.value);
    };

    const history = useHistory();

    const sp_mr = {
        marginRight: '15px',
        fontSize: 'larger',
    }

    const Move = () => {
        history.push('/')
    }

    const [m_data, setM_data] = useState([]);

    const [change_flag, setChangeFlag] = useState(true);

    useEffect(async () => {
        if (pagenumber > 0) {
            var api = `https://api.traitsniper.com/api/projects?page=${pagenumber - 1}&limit=50`;
            if (age === 'unrevealed') {
                api = `https://api.traitsniper.com/api/projects?page=${pagenumber - 1}&limit=50&status=unrevealed`;
            } else if (age === 'revealing') {
                api = `https://api.traitsniper.com/api/projects?page=${pagenumber - 1}&limit=50&status=revealing`;
            } else if (age === 'revealed') {
                api = `https://api.traitsniper.com/api/projects?page=${pagenumber - 1}&limit=50&status=revealed`;
            }
            await axios.get(api)
                .then(res => {
                    setM_data(res.data);
                }).catch(e => {
                    console.log(e)
                })
        } else {
            alert('Input Correct Page Number!')
            toast.error('Input Correct Page Number!')
        }
    }, [change_flag])

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const setData = () => {
        setChangeFlag(!change_flag);
    }

    const [age, setAge] = React.useState('all');

    const handleChangeStatus = (event) => {
        setAge(event.target.value);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Button variant="contained" style={{ position: 'absolute', left: '15px' }} onClick={Move} >Metroverse</Button>
            <h1 style={{ textAlign: 'center', color: 'white' }}>On going Projects</h1>
            <Box sx={{ bgcolor: '#4a4a49', pb: '40px', textAlign: 'center', borderBottom: 'solid 1px #30363d' }}>
                <Box display="flex" style={{ marginTop: '15px', marginLeft: '15px', alignItems: 'center' }} gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={age}
                                label="Status"
                                onChange={handleChangeStatus}
                            >
                                <MenuItem value={'all'}>All</MenuItem>
                                <MenuItem value={'revealed'}>Revealed</MenuItem>
                                <MenuItem value={'unrevealed'}>Unrevealed</MenuItem>
                                <MenuItem value={'revealing'}>Revealing</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <TextField
                        value={pagenumber}
                        onChange={event => setPagenumber(event.target.value)}
                        id="input-with-icon-textfield"
                        label="Page Number"
                        type='number'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                    />
                    <Button variant="contained" onClick={setData} >Set Data</Button>
                </Box>
            </Box>
            <Box>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 550, background: '#4a4a49' }}>
                        <Table stickyHeader aria-label="sticky table" style={{ overflowX: 'overlay', background: '#4a4a49' }}>
                            <TableHead style={{ background: '#4a4a49' }}>
                                <TableRow style={{ background: '#4a4a49' }}>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth, background: '#4a4a49', color: '#1976d2' }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    m_data.projects ?
                                        m_data.projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                        {columns.map((column, i) => {
                                                            const value = row[column.id];
                                                            if (column.id === 'image') {
                                                                return (
                                                                    <TableCell style={{ color: 'white' }} key={i} align={column.align}>
                                                                        <img alt='alt' src={value} width='60px' height='60px' />
                                                                    </TableCell>
                                                                );
                                                            } else if (column.id === 'floor_price') {
                                                                return (
                                                                    <TableCell style={{ color: 'white' }} key={i} align={column.align}>
                                                                        {value * 1000}
                                                                    </TableCell>
                                                                );
                                                            } else if (column.id === 'royalty_fee') {
                                                                return (
                                                                    <TableCell style={{ color: 'white' }} key={i} align={column.align}>
                                                                        {value / 100}%
                                                                    </TableCell>
                                                                );
                                                            } else if (column.id === 'one_day_volume' || column.id === 'seven_day_volume' || column.id === 'thirty_day_volume') {
                                                                return (
                                                                    <TableCell style={{ color: 'white' }} key={i} align={column.align}>
                                                                        {value.toFixed(2)}
                                                                    </TableCell>
                                                                );
                                                            } else if (column.id === 'opensea') {
                                                                return (
                                                                    <TableCell style={{ color: 'white' }} key={i} align={column.align}>
                                                                        <a href='https://opensea.io/collection/hype-bears-club-official-?ref=0xb233ddab5da16808a2401b6895e129f4854e2744'>
                                                                            <Button variant="contained">OpenSea</Button>
                                                                        </a>
                                                                    </TableCell>
                                                                )
                                                            } else if (column.id === 'contract_address') {
                                                                if (value) {
                                                                    return (
                                                                        <TableCell style={{ color: 'white' }} key={i} align={column.align}>
                                                                            <a href={'https://etherscan.io/address/' + value}>
                                                                                <Button variant="contained">Etherscan</Button>
                                                                            </a>
                                                                        </TableCell>
                                                                    )
                                                                } else {
                                                                    return (
                                                                        <TableCell style={{ color: 'white' }} key={i} align={column.align}>
                                                                            <Button variant="contained" disabled>Etherscan</Button>
                                                                        </TableCell>
                                                                    )
                                                                }
                                                            } else if (column.id === 'discord') {
                                                                if (value) {
                                                                    return (
                                                                        <TableCell style={{ color: 'white' }} key={i} align={column.align}>
                                                                            <a href={value}>
                                                                                <Button variant="contained">Discord</Button>
                                                                            </a>
                                                                        </TableCell>
                                                                    )
                                                                } else {
                                                                    return (
                                                                        <TableCell style={{ color: 'white' }} key={i} align={column.align}>
                                                                            <Button variant="contained" disabled>Discord</Button>
                                                                        </TableCell>
                                                                    )
                                                                }
                                                            } else if (column.id === 'website') {
                                                                if (value) {
                                                                    return (
                                                                        <TableCell style={{ color: 'white' }} key={i} align={column.align}>
                                                                            <a href={'https://' + value}>
                                                                                <Button variant="contained">Metroverse</Button>
                                                                            </a>
                                                                        </TableCell>
                                                                    )
                                                                } else {
                                                                    return (
                                                                        <TableCell style={{ color: 'white' }} key={i} align={column.align}>
                                                                            <Button variant="contained" disabled>Metroverse</Button>
                                                                        </TableCell>
                                                                    )
                                                                }
                                                            } else if (column.id === 'twitter') {
                                                                if (value) {
                                                                    return (
                                                                        <TableCell style={{ color: 'white' }} key={i} align={column.align}>
                                                                            <a href={'https://twitter.com/' + value}>
                                                                                <Button variant="contained">Twiiter</Button>
                                                                            </a>
                                                                        </TableCell>
                                                                    )
                                                                } else {
                                                                    return (
                                                                        <TableCell style={{ color: 'white' }} key={i} align={column.align}>
                                                                            <Button variant="contained" disabled>Twiiter</Button>
                                                                        </TableCell>
                                                                    )
                                                                }
                                                            } else {
                                                                return (
                                                                    <TableCell style={{ color: 'white' }} key={i} align={column.align}>
                                                                        {value}
                                                                    </TableCell>
                                                                )
                                                            }
                                                        })}
                                                    </TableRow>
                                                );
                                            })
                                        :
                                        ''
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        style={{ background: '#4a4a49' }}
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={m_data.projects ? m_data.projects.length : 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </Box>
    );
}