import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

const ResponsiveAppBar = () => {

    return (
        <AppBar position="static" className='my_header'>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <div>
                        <span>Token Swap</span>
                    </div>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <></>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <WalletModalProvider >
                            <WalletModalProvider>
                                <WalletMultiButton />
                            </WalletModalProvider>
                        </WalletModalProvider>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;
