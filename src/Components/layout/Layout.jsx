import { useContext } from 'react';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Outlet, useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemIcon } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Tooltip from '@mui/material/Tooltip';
import './layout.css'
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { AuthContext } from '../../Context/AuthLogin';


function LayoutComponent({ children }) {

    const navigate = useNavigate();
    const { setRole } = useContext(AuthContext);
    const moveToHome = () => {
        navigate('/home');
    }

    const moveToHistory = () => {
        navigate('/home/history');
    }

    const moveToProfile = () => {
        navigate('/home/profile');
    }

    const handleLogout = () => {
        localStorage.clear();
        setRole(null);
        navigate('/');
    }

    return (
        <div className='layout'>
            <Grid container spacing={1} className='layout-container'>
                <Grid item md={2} lg={2} rowSpacing={3} className='layout-content ipad-pc'>
                    <div className='layout-nav'>
                        <List className='layout-nav-list'>
                            <Tooltip title="Trang chủ" placement='right-end'>
                                <ListItem button onClick={moveToHome} className='layout-nav-list-item'>
                                    <ListItemIcon className='text-center-flex'> <HomeIcon fontSize="large" color="secondary" /></ListItemIcon>
                                </ListItem>
                            </Tooltip>

                            <Tooltip title="Lịch sử" placement='right-end'>
                                <ListItem button onClick={moveToHistory} className='layout-nav-list-item'>
                                    <ListItemIcon className='text-center-flex'> <HistoryIcon fontSize="large" color="secondary" /></ListItemIcon>
                                </ListItem>
                            </Tooltip>

                        </List>
                        <List className='layout-nav-list'>
                            <Tooltip title="Profile" placement='right-end'>
                                <ListItem button className='layout-nav-list-item' onClick={moveToProfile}>
                                    <ListItemIcon className='text-center-flex' > <AccountCircleIcon fontSize="large" color="secondary" /></ListItemIcon>
                                </ListItem>
                            </Tooltip>

                            <Tooltip title="Đăng xuất" placement='right-end'>
                                <ListItem button className='layout-nav-list-item'>
                                    <ListItemIcon className='text-center-flex' onClick={handleLogout}> <ExitToAppIcon fontSize="large" color="secondary" /></ListItemIcon>
                                </ListItem>
                            </Tooltip>
                        </List>
                    </div>
                </Grid>
                <Grid item xs={12} md={10} lg={10} className='layout-right'>
                    <Outlet />
                </Grid>
            </Grid>
            <Grid className='mobile'>
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'absolute', bottom: 4, left: 16 }}
                    icon={<SpeedDialIcon />}
                >
                    <SpeedDialAction
                        icon={<ExitToAppIcon fontSize="large" color="secondary" />}
                        tooltipTitle={'Trang chủ'}
                        onClick={handleLogout}
                    />
                    <SpeedDialAction
                        icon={<AccountCircleIcon fontSize="large" color="secondary" />}
                        tooltipTitle={'Lịch sử'}
                    />
                    <SpeedDialAction
                        icon={<HistoryIcon fontSize="large" color="secondary" />}
                        tooltipTitle={'Trang chủ'}
                        onClick={moveToHistory}
                    />
                    <SpeedDialAction
                        icon={<HomeIcon fontSize="large" color="secondary" />}
                        tooltipTitle={'Trang chủ'}
                        onClick={moveToHome}
                    />
                </SpeedDial>
            </Grid>
        </div>
    )
};

export default LayoutComponent;